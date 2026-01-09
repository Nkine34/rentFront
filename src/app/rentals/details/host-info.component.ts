import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Host } from '../models/host.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="host-card">
      <h4>Hôte</h4>
      @if (host) {
        <div class="host-info">
          <img [src]="host.photo" [alt]="'Photo de ' + host.name" class="host-photo">
          <div>
            <strong>{{ host.name }}</strong>
            @if (host.isSuperhost) {
              <span class="superhost-badge">
                <mat-icon>verified_user</mat-icon> Superhôte
              </span>
            }
          </div>
        </div>
        <p>Taux de réponse : {{ host.responseRate }}%</p>
        <p>Temps de réponse : {{ host.responseTime }}</p>
      }
    </div>
  `,
  styleUrls: ['./host-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostInfoComponent {
  @Input({ required: true }) host!: Host;
}