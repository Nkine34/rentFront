import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { Action } from 'rxjs/internal/scheduler/Action';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Location } from '../models/location.model';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LocationStore } from '../state/location.store';
import { HostInfoComponent } from './host-info.component';
import { BookingCardComponent } from './booking-card.component';
import { AmenitiesListComponent } from './amenities-list.component';

@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HostInfoComponent,
    BookingCardComponent,
    AmenitiesListComponent,
    DatePipe
  ],
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(LocationStore);

  // 1. Crée un signal à partir du paramètre 'id' de l'URL. Il se mettra à jour automatiquement si l'URL change.
  private readonly locationId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  // 2. Crée un signal calculé qui trouve la location correspondante dans le store en se basant sur le signal de l'ID.
  readonly location: Signal<Location | undefined> = computed(() => {
    const id = this.locationId();
    if (!id) return undefined;
    return this.store.entityMap()[Number(id)]; // Accès direct et instantané
  });

  goBack(): void {
    this.router.navigate(['/']);
  }
}
