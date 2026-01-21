import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';

import { Router } from '@angular/router';
import { LocationStore } from '../../../state/location.store';
import { PropertyCardComponent, PropertyCardData } from '../../components/property-card/property-card.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OpenStreetMapComponent } from '../../components/open-street-map/open-street-map.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    PropertyCardComponent,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    MatProgressSpinnerModule,
    OpenStreetMapComponent
  ],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  private readonly router = inject(Router);
  protected readonly store = inject(LocationStore);

  // Computed signals for property cards
  protected readonly propertyCards = computed(() => {
    const locations = this.store.filteredLocations();
    return locations.map(loc => this.mapToPropertyCard(loc));
  });

  protected readonly resultsCount = computed(() => {
    return this.propertyCards().length;
  });

  protected readonly searchLocation = computed(() => {
    const criteria = this.store.searchCriteria();
    return criteria?.destination || '';
  });

  // Map Location to PropertyCardData
  private mapToPropertyCard(location: any): PropertyCardData {
    return {
      id: location.id,
      title: `${location.type} ${location.address.city}`,
      location: `${location.address.city}, ${location.address.country}`,
      imageUrl: location.photos[0]?.url || '/assets/placeholder.jpg',
      rating: location.rating,
      bedrooms: location.bedrooms,
      bathrooms: location.bathrooms,
      sqft: location.beds * 100, // Placeholder calculation
      pricePerMonth: location.pricePerNight * 30, // Estimate monthly price
      badge: location.rating >= 4.8 ? 'FEATURED' : undefined,
      isFavorite: false
    };
  }

  navigateToDetails(id: number): void {
    console.log(`SearchPageComponent: Navigation vers les détails de l'annonce ID: ${id}`);
    this.router.navigate(['/details', id]);
  }

  onToggleFavorite(id: number): void {
    console.log(`Toggle favorite for property ${id}`);
    // TODO: Implement favorite logic
  }
}
