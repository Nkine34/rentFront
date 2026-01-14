import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { Observable, throwError, from } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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

  constructor() { }

  public async init(): Promise<void> {
    console.log('AuthService: Début de l\'initialisation...');
    try {
      await this.keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'rent',
          clientId: 'front-rent'
        },
        initOptions: {},
        enableBearerInterceptor: false
      });

      console.log('AuthService: Keycloak.init() terminé.');

      const loggedIn = await this.keycloak.isLoggedIn();
      this.isLoggedIn.set(loggedIn);
      console.log('AuthService: Statut de connexion vérifié :', loggedIn);

      if (loggedIn) {
        this.userProfile.set(await this.keycloak.loadUserProfile());
        this.loadCurrentUser();
      } else {
        const token = localStorage.getItem('access_token');
        if (token) {
          console.log('AuthService: Tentative de restauration de session via localStorage...');
          const user = this.decodeJwt(token);
          if (user) {
            this.currentUser.set(user);
            this.isLoggedIn.set(true);
            const profile: KeycloakProfile = {
              username: user.email,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            };
            this.userProfile.set(profile);
            console.log('AuthService: Session restaurée depuis le localStorage.');
          }
        }
      }

    } catch (error) {
      console.error('AuthService: Keycloak init a échoué. L\'application continue en mode anonyme.', error);
    } finally {
      this.isInitialized.set(true);
      console.log('AuthService: Initialisation terminée, isInitialized est maintenant true.');
    }
  }

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

        const user = this.decodeJwt(tokens.access_token);
        if (user) {
          this.currentUser.set(user);
          // Simuler un KeycloakProfile à partir des infos du JWT
          const profile: KeycloakProfile = {
            username: user.email,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
          this.userProfile.set(profile);
        }
      }),
      map(() => { }), // On transforme le résultat en void pour le subscriber
      catchError(this.handleError)
    );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isLoggedIn.set(false);
    this.userProfile.set(null);
    this.currentUser.set(null);
    window.location.href = '/';
  }

  public async getToken(): Promise<string | null> {
    try {
      if (await this.keycloak.isLoggedIn()) {
        await this.keycloak.updateToken(20);
        return await this.keycloak.getToken();
      }
    } catch (error) {
      // Keycloak error or not initialized or session expired
      console.warn('Failed to refresh token or not logged in via Keycloak', error);
    }
    return localStorage.getItem('access_token');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('AuthService login failed:', error);
    if (error.status === 401) {
      return throwError(() => new Error('Email ou mot de passe invalide.'));
    }
    return throwError(() => new Error('Un problème est survenu lors de la connexion.'));
  }
}
