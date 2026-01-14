import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { HostStore } from '../host.store';

@Component({
  standalone: true,
  selector: 'app-become-host',
  imports: [MatButtonModule],
  template: `
    @if (hostStore.host(); as host) {
      <!-- Déjà hôte : éventuellement redirection / message -->
      <p>Vous êtes déjà hôte.</p>
    } @else {
      <section>
        <h1>Devenir hôte</h1>
        <p>Explique les avantages, etc.</p>
        <button
          mat-raised-button
          color="primary"
          (click)="onBecomeHost()"
          [disabled]="hostStore.loading()"
          >
          Devenir hôte
        </button>
        @if (hostStore.error(); as error) {
          <p class="error">{{ error }}</p>
        }
      </section>
    }
    
    `
})
export class BecomeHostComponent implements OnInit {
  constructor(public hostStore: HostStore) {}

  ngOnInit(): void {
    this.hostStore.loadCurrentHost();
  }

  onBecomeHost(): void {
    this.hostStore.becomeHost();
  }
}
