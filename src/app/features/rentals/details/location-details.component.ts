import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common'; // NgIf added specifically
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
import { BookingCardComponent } from './components/booking-card/booking-card.component';
import { AmenitiesListComponent } from './components/amenities-list/amenities-list.component';
import { ReviewListComponent } from './components/reviews/review-list.component';

import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

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
    ReviewListComponent,
    ImageGalleryComponent
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

  // Gallery State
  readonly isGalleryOpen = signal(false);
  readonly selectedImageIndex = signal(0);

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

  // 3. Computed Signal for Sorted Photos (Primary first, then by order)
  readonly sortedPhotos = computed(() => {
    const loc = this.location();
    if (!loc || !loc.photos) return [];

    return [...loc.photos].sort((a, b) => {
      // Primary photo always first
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      // Then by order index
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    });
  });

  goBack(): void {
    this.router.navigate(['/']);
  }

  openGallery(index: number): void {
    this.selectedImageIndex.set(index);
    this.isGalleryOpen.set(true);
  }

  closeGallery(): void {
    this.isGalleryOpen.set(false);
  }
}
