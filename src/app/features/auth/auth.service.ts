import { Injectable, signal } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isInitialized = signal(false);
  public isLoggedIn = signal(false);
  public userProfile = signal<KeycloakProfile | null>(null);

  constructor(private readonly keycloak: KeycloakService) {}

  public async init(): Promise<void> {
    try {
      const authenticated = await this.keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'rent',
          clientId: 'rent-front'
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/assets/silent-check-sso.html'
        }
      });

      this.isLoggedIn.set(authenticated);
      if (authenticated) {
        this.userProfile.set(await this.keycloak.loadUserProfile());
      }
    } catch (error) {
      console.error('Keycloak init failed', error);
    } finally {
      this.isInitialized.set(true);
    }
  }

  public login(): void {
    this.keycloak.login();
  }

  public register(): void {
    this.keycloak.register();
  }

  public logout(): void {
    this.keycloak.logout(window.location.origin);
  }
}
