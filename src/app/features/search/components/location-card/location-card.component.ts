import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { SearchResultDTO } from '../../models/search-result-dto';

/**
 * Location card component for search results.
 * Displays essential location information in a card format.
 * Clicking navigates to location details page.
 */
@Component({
    selector: 'app-location-card',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatChipsModule
    ],
    template: `
    <mat-card class="location-card" [routerLink]="['/locations', location().slug]">
      <!-- Image -->
      <div class="card-image-container">
        <img 
          [src]="location().primaryPhotoUrl || 'assets/placeholder-location.jpg'"
          [alt]="location().title"
          class="card-image"
        />
      </div>

      <!-- Content -->
      <mat-card-content class="card-content">
        <!-- Header -->
        <div class="card-header">
          <h3 class="card-title">{{ location().title }}</h3>
          @if (location().rating > 0) {
            <div class="rating">
              <mat-icon class="star-icon">star</mat-icon>
              <span class="rating-value">{{ location().rating | number:'1.1-1' }}</span>
              <span class="reviews-count">({{ location().totalReviews }})</span>
            </div>
          }
        </div>

        <!-- Location -->
        <p class="location-text">
          <mat-icon class="location-icon">place</mat-icon>
          {{ location().city }}, {{ location().country }}
        </p>

        <!-- Amenities -->
        @if (location().topAmenities.length > 0) {
          <div class="amenities">
            @for (amenity of location().topAmenities; track amenity) {
              <mat-chip class="amenity-chip">{{ amenity }}</mat-chip>
            }
          </div>
        }

        <!-- Footer -->
        <div class="card-footer">
          <div class="price-container">
            <span class="price">€{{ location().pricePerNight }}</span>
            <span class="price-label">/ night</span>
          </div>
          <div class="guests">
            <mat-icon class="guests-icon">person</mat-icon>
            <span>{{ location().maxGuests }} guests</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
    .location-card {
      cursor: pointer;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .location-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .card-image-container {
      width: 100%;
      height: 220px;
      overflow: hidden;
      background-color: #f0f0f0;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .card-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #222;
      flex: 1;
      margin-right: 8px;
      line-height: 1.3;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .star-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #FFB400;
    }

    .rating-value {
      font-weight: 600;
      font-size: 14px;
    }

    .reviews-count {
      font-size: 12px;
      color: #666;
    }

    .location-text {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 14px;
      margin: 8px 0;
    }

    .location-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #666;
    }

    .amenities {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0;
      min-height: 32px;
    }

    .amenity-chip {
      font-size: 12px;
      height: 28px;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }

    .price-container {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .price {
      font-size: 20px;
      font-weight: 700;
      color: #FF385C;
    }

    .price-label {
      font-size: 14px;
      color: #666;
    }

    .guests {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #666;
    }

    .guests-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class LocationCardComponent {
    readonly location = input.required<SearchResultDTO>();
}
