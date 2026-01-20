import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocationStore } from './state/location.store';

/**
 * Un resolver de route qui garantit que les données des locations sont
 * chargées (ou en cours de chargement) avant que le composant de la route ne soit affiché.
 * C'est une pratique robuste qui évite les états de chargement scintillants dans les composants
 * et garantit que les données nécessaires sont disponibles dès l'initialisation.
 *
 * @returns void
 */
export const locationsResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  inject(LocationStore).loadLocations();
};
