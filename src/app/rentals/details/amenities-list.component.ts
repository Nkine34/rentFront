import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Amenities } from '../models/amenities.model';
import { AmenityDetailsPipe } from '../pipes/amenity-details.pipe';

@Component({
  selector: 'app-amenities-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, AmenityDetailsPipe],
  template: `
    <h3>Équipements</h3>
    @if (amenities) {
      <ul class="amenities-list">
        @for (amenity of objectKeys(amenities); track amenity) {
          @if (amenities[amenity]) {
            <li><mat-icon>{{ (amenity | amenityDetails).icon }}</mat-icon> {{ (amenity | amenityDetails).label }}</li>
          }
        }
      </ul>
    }
  `,
  styleUrls: ['./amenities-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmenitiesListComponent {
  @Input({ required: true }) amenities!: Amenities;

  objectKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }
}