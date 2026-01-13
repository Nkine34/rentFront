import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private keycloak = inject(KeycloakService);

  public isInitialized = signal(false);
  public isLoggedIn = signal(false);
  public userProfile = signal<KeycloakProfile | null>(null);

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
          clientId: 'rent-front'
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
      }

    } catch (error) {
      console.error('AuthService: Keycloak init a échoué. L\'application continue en mode anonyme.', error);
    } finally {
      this.isInitialized.set(true);
      console.log('AuthService: Initialisation terminée, isInitialized est maintenant true.');
    }
  }

  public loginWithPassword(email: string, password: string): Observable<void> {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(tokens => {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        this.isLoggedIn.set(true);
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
