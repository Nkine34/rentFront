import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common'; // NgIf added specifically
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { Location } from '../models/location.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { LocationStore } from '../state/location.store';
import { BookingCardComponent } from './booking-card.component';
import { AmenitiesListComponent } from './amenities-list.component';

@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [
    CommonModule, // Required for *ngIf
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BookingCardComponent,
    AmenitiesListComponent,
    DatePipe
  ],
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // animations: [ ... ] // Can add Angular animations here if needed, sticking to CSS transitions for now as per plan
})
export class LocationDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(LocationStore);

  // 1. Signal 'id' from URL
  private readonly locationId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  // 2. Computed Signal for Location
  readonly location: Signal<Location | undefined> = computed(() => {
    const id = this.locationId();
    if (!id) return undefined;
    return this.store.entityMap()[Number(id)];
  });

  goBack(): void {
    this.router.navigate(['/']);
  }
}
