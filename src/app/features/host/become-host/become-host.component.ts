import { Component, OnInit, effect, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

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
  constructor(
    public hostStore: HostStore,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    effect(() => {
      const host = this.hostStore.host();
      if (host) {
        // Success! Refresh user profile to get the new HOST role
        this.authService.loadCurrentUser().subscribe(() => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/locations/new';
          this.router.navigateByUrl(returnUrl);
        });
      }
    });
  }

  ngOnInit(): void {
    this.hostStore.loadCurrentHost();
  }

  onBecomeHost(): void {
    this.hostStore.becomeHost();
  }
}
