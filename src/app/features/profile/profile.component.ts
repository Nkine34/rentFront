import { Component, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  template: `
    <h2>Profil Utilisateur</h2>
    @if (userProfile) {
      <p><strong>Nom d'utilisateur :</strong> {{ userProfile.username }}</p>
      <p><strong>Email :</strong> {{ userProfile.email }}</p>
      <p><strong>Prénom :</strong> {{ userProfile.firstName }}</p>
      <p><strong>Nom :</strong> {{ userProfile.lastName }}</p>
    } @else {
      <p>Chargement du profil...</p>
    }
  `
})
export class ProfileComponent implements OnInit {
  public userProfile: KeycloakProfile | null = null;

  constructor(private readonly keycloak: KeycloakService) {}

  public async ngOnInit() {
    if (await this.keycloak.isLoggedIn()) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
  }
}
