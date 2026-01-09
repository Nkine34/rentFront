import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private keycloak = inject(KeycloakService);

  public isInitialized = signal(false);
  public isLoggedIn = signal(false);
  public userProfile = signal<KeycloakProfile | null>(null);

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      // On vérifie si un token est déjà dans le localStorage
      const token = localStorage.getItem('access_token');
      if (token) {
        // On initialise Keycloak avec le token existant
        const authenticated = await this.keycloak.init({
          config: {
            url: 'http://localhost:8080',
            realm: 'rent',
            clientId: 'rent-front'
          },
          initOptions: {
            token: token,
            refreshToken: localStorage.getItem('refresh_token') || undefined,
            onLoad: 'check-sso'
          },
          enableBearerInterceptor: false
        });
        this.isLoggedIn.set(authenticated);
        if (authenticated) {
          this.userProfile.set(await this.keycloak.loadUserProfile());
        }
      } else {
        // Pas de token, initialisation simple
        await this.keycloak.init({
          config: {
            url: 'http://localhost:8080',
            realm: 'rent',
            clientId: 'rent-front'
          },
          enableBearerInterceptor: false
        });
      }
    } catch (error) {
      console.error('Keycloak init a échoué.', error);
    } finally {
      this.isInitialized.set(true);
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
      catchError(this.handleError)
    );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isLoggedIn.set(false);
    this.userProfile.set(null);
    this.keycloak.logout(window.location.origin);
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Email ou mot de passe invalide.'));
  }
}
