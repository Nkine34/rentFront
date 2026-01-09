import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {LocationListComponent} from '../locations/location-list.component';
import {LocationStore} from '../state/location.store';
import { SearchBarComponent } from './search-bar.component';
import { SearchCriteria } from '../models';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, LocationListComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  private readonly router = inject(Router);
  protected readonly store = inject(LocationStore);

  // Affichez tous les résultats sur la page de recherche, sans limite par pays.
  listingsPerCountry = 100;

  handleSearch(criteria: SearchCriteria): void {
    // Déclenche la recherche avec les critères fournis
    // Cette méthode appelle le backend avec les critères et met à jour le store
    this.store.searchLocations(criteria);
  }

  // Méthode pour gérer la navigation
  navigateToDetails(id: number): void {
    console.log(`SearchPageComponent: Navigation vers les détails de l'annonce ID: ${id}`);
    this.router.navigate(['/details', id]);
  }
}
