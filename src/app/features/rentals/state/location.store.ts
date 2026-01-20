import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs'; // Removed filter from here
import { tapResponse } from '@ngrx/operators';

import { Location, SearchCriteria } from '../models';
import { SearchService } from '../services/search.service';
import { withCallState } from '../../../shared/state/call-state.feature';

// --- 1. Définition de la structure de l'état ---
interface LocationsState {
  searchCriteria: SearchCriteria | null;
}

const initialState: LocationsState = {
  searchCriteria: null,
};

// --- Alias de type pour une meilleure lisibilité ---
type GroupedLocations = Record<string, Location[]>;

// --- Fonctions de filtrage pures ---
const filterByDestination = (locations: Location[], destination: string | null | undefined): Location[] => {
  if (!destination) return locations;
  const term = destination.toLowerCase();
  return locations.filter(loc => loc.address.city.toLowerCase().includes(term));
};

const filterByGuests = (locations: Location[], criteria: SearchCriteria | null): Location[] => {
  if (!criteria?.travelers) return locations;
  const totalGuests = criteria.travelers.adults + criteria.travelers.children;
  if (totalGuests <= 1) return locations;
  return locations.filter(loc => loc.maxGuests >= totalGuests);
};

// const filterByDates = (locations: Location[], criteria: SearchCriteria | null): Location[] => {
//   // Logique de filtrage par date à implémenter ici
//   return locations;
// };

// --- 2. Fonction utilitaire pure ---
const groupLocationsByCountry = (locations: Location[]): GroupedLocations => {
  if (!locations) return {};
  return locations.reduce((acc, location) => {
    const country = location.address.country;
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(location);
    return acc;
  }, {} as GroupedLocations);
};

// --- 3. Définition du SignalStore ---
export const LocationStore = signalStore(
  { providedIn: 'root' }, // Le store est un singleton disponible dans toute l'app
  withState(initialState), // État métier spécifique aux locations
  withCallState(), // Ajoute les signaux et méthodes pour loading/error
  withEntities<Location>(), // Gestion des entités Location

  // --- 4. Création des sélecteurs de base ---
  withComputed((store) => ({
    filteredLocations: computed(() => {
      const criteria = store.searchCriteria();
      let locations = store.entities();

      locations = filterByDestination(locations, criteria?.destination);
      locations = filterByGuests(locations, criteria);
      // locations = filterByDates(locations, criteria);

      return locations;
    }),
    groupedLocations: computed(() => groupLocationsByCountry(store.entities())),
  })),
  // --- 5. Composition des sélecteurs pour créer des données dérivées plus complexes ---
  withComputed((store) => ({
    filteredAndGroupedLocations: computed(() => groupLocationsByCountry(store.filteredLocations())),
  })),
  // --- 6. "Actions" et "Effects" sous forme de méthodes ---
  withMethods((store, searchService = inject(SearchService)) => ({
    // Méthode simple pour mettre à jour l'état (équivalent d'une action + reducer)
    updateSearchCriteria(criteria: SearchCriteria): void {
      patchState(store, { searchCriteria: criteria });
    },
    // Méthode asynchrone pour charger les données (équivalent d'un effect)
    loadLocations: rxMethod<void>(
      pipe(
        // filter(() => store.entities().length === 0), // Removed this filter
        tap(() => store.setLoading()), // Utilise la méthode de la feature
        switchMap(() =>
          searchService.getLocations().pipe(
            tapResponse({
              next: (locations) => {
                patchState(store, setAllEntities(locations));
                store.setLoaded(); // Utilise la méthode dédiée de la feature pour une meilleure abstraction
              },
              error: (error: Error) => {
                console.error('Error loading locations', error);
                store.setError('Impossible de charger les annonces.'); // Utilise la méthode de la feature
              }
            })
          )
        )
      )
    ),
    /**
     * Recherche les locations selon les critères fournis
     * @param criteria Critères de recherche (destination, dates, voyageurs)
     */
    searchLocations: rxMethod<SearchCriteria>(
      pipe(
        tap((criteria) => {
          patchState(store, { searchCriteria: criteria });
          store.setLoading();
        }),
        switchMap((criteria) =>
          searchService.searchLocations(criteria).pipe(
            tapResponse({
              next: (locations) => {
                patchState(store, setAllEntities(locations));
                store.setLoaded();
              },
              error: (error: Error) => {
                console.error('Error searching locations', error);
                store.setError('Erreur lors de la recherche des annonces.');
              }
            })
          )
        )
      )
    ),
  }))
);
