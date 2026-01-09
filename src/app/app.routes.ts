import {Routes} from '@angular/router';
import { HomeComponent } from './rentals/home/home.component';
import { locationsResolver } from './rentals/location.resolver';
import { SearchPageComponent } from './rentals/search/search-page.component';
import { LocationDetailsComponent } from './rentals/details/location-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { data: locationsResolver }
  },
  {
    path: 'search',
    component: SearchPageComponent,
    resolve: { data: locationsResolver }
  },
  {
    path: 'details/:id',
    component: LocationDetailsComponent,
    resolve: { data: locationsResolver }
  },
  { path: '**', redirectTo: '' }
];
