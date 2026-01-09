import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SearchBarComponent } from './rentals/search/search-bar.component';
import { LocationStore } from './rentals/state/location.store';
import { SearchCriteria } from './rentals/models';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    SearchBarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('rant-room');
  private readonly store = inject(LocationStore);
  private readonly router = inject(Router);
  private readonly keycloak = inject(KeycloakService);

  public isKeycloakInitialized = signal(false);
  public isLoggedIn = signal(false);
  public userProfile = signal<KeycloakProfile | null>(null);

  public async ngOnInit() {
    try {
      await this.keycloak.init({
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

      this.isKeycloakInitialized.set(true);
      const loggedIn = await this.keycloak.isLoggedIn();
      this.isLoggedIn.set(loggedIn);

      if (loggedIn) {
        this.userProfile.set(await this.keycloak.loadUserProfile());
      }
    } catch (error) {
      console.error('Keycloak init failed', error);
      this.isKeycloakInitialized.set(true); // On affiche l'UI même en cas d'échec
    }
  }

  handleSearch(criteria: SearchCriteria): void {
    this.store.searchLocations(criteria);
    if (this.router.url !== '/search') {
      this.router.navigate(['/search']);
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout(window.location.origin);
  }
}
