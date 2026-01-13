import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HostStore } from '../host.store';

@Component({
  standalone: true,
  selector: 'app-become-host',
  imports: [CommonModule, MatButtonModule],
  template: `
    <ng-container *ngIf="hostStore.host() as host; else canBecome">
      <!-- Déjà hôte : éventuellement redirection / message -->
      <p>Vous êtes déjà hôte.</p>
    </ng-container>

    <ng-template #canBecome>
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

        <p *ngIf="hostStore.error() as error" class="error">{{ error }}</p>
      </section>
    </ng-template>
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
