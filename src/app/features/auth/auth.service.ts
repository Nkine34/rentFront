import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { CurrentUser } from './models/current-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private keycloak = inject(KeycloakService);

  public isInitialized = signal(false);
  public isLoggedIn = signal(false);
  public userProfile = signal<KeycloakProfile | null>(null);
  public currentUser = signal<CurrentUser | null>(null);

  constructor() {}

  public async init(): Promise<void> {
    console.log('AuthService: Début de l\'initialisation...');
    try {
      // Initialisation la plus simple et passive possible.
      // Aucune option qui pourrait causer une redirection.
      await this.keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'rent',
          clientId: 'front-rent'
        },
        initOptions: {}, // Vide !
        enableBearerInterceptor: false
      });

      console.log('AuthService: Keycloak.init() terminé.');

      // C'est SEULEMENT APRES l'init qu'on vérifie si l'utilisateur est connecté
      // (par exemple, s'il revient de la page de login de Keycloak avec un token dans l'URL)
      const loggedIn = await this.keycloak.isLoggedIn();
      this.isLoggedIn.set(loggedIn);
      console.log('AuthService: Statut de connexion vérifié :', loggedIn);

      if (loggedIn) {
        this.userProfile.set(await this.keycloak.loadUserProfile());
        // Charger le profil utilisateur complet depuis le serveur
        this.loadCurrentUser();
      }

    } catch (error) {
      console.error('AuthService: Keycloak init a échoué. L\'application continue en mode anonyme.', error);
    } finally {
      this.isInitialized.set(true);
      console.log('AuthService: Initialisation terminée, isInitialized est maintenant true.');
    }
  }

  /**
   * Charger le profil utilisateur complet depuis /api/users/me
   */
  public loadCurrentUser(): Observable<CurrentUser> {
    return this.http.get<any>('/api/users/me').pipe(
      map(dto => ({
        publicId: dto.publicId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        pictureUrl: dto.pictureUrl,
        roles: dto.roles || [],
        isHost: dto.roles?.includes('HOST') ?? false
      })),
      tap(user => this.currentUser.set(user)),
      catchError(error => {
        console.error('Erreur lors du chargement du profil utilisateur:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Décoder un JWT et extraire les informations utilisateur
   */
  public decodeJwt(token: string): CurrentUser | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      return {
        publicId: decoded.sub || '',
        email: decoded.email || '',
        firstName: decoded.given_name || '',
        lastName: decoded.family_name || '',
        pictureUrl: decoded.picture || '',
        roles: decoded.roles || [],
        isHost: (decoded.roles || []).includes('HOST')
      };
    } catch (error) {
      console.error('Erreur lors du décodage du JWT:', error);
      return null;
    }
  }

  public loginWithPassword(email: string, password: string): Observable<void> {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(tokens => {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        this.isLoggedIn.set(true);

        // Décoder le JWT pour mettre à jour currentUser immédiatement
        const user = this.decodeJwt(tokens.access_token);
        if (user) {
          this.currentUser.set(user);
        }
      }),
      switchMap(() => from(this.keycloak.loadUserProfile()).pipe(
        tap(profile => this.userProfile.set(profile))
      )),
      map(() => {}),
      catchError(this.handleError)
    );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isLoggedIn.set(false);
    this.userProfile.set(null);
    this.currentUser.set(null);
    // On ne redirige plus vers le logout de Keycloak pour éviter les problèmes
    // avec le flux de mot de passe. On redirige simplement vers l'accueil.
    window.location.href = '/';
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Email ou mot de passe invalide.'));
  }
}
