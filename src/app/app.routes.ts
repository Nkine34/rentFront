import {Routes} from '@angular/router';
import { HomeComponent } from './rentals/home/home.component';
import { locationsResolver } from './rentals/location.resolver';
import { SearchPageComponent } from './rentals/search/search-page.component';
import { LocationDetailsComponent } from './rentals/details/location-details.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';

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
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { path: '**', redirectTo: '' }
];
