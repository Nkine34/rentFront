import { Routes } from '@angular/router';
import { SearchPageComponent } from './components/search-page/search-page.component';

/**
 * Search feature routes.
 * Public routes (no authentication required).
 */
export const searchRoutes: Routes = [
    {
        path: '',
        component: SearchPageComponent,
        title: 'Search Locations'
    }
];
