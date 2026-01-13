import {Routes} from '@angular/router';
import { authGuard } from './auth.guard';
import { HomeComponent } from './rentals/home/home.component';
import { locationsResolver } from './rentals/location.resolver';
import { LoginComponent } from './features/auth/login/login.component';
import { CallbackComponent } from './features/auth/callback/callback.component';
import { SearchPageComponent } from './rentals/search/search-page.component';
import { RegisterComponent } from './features/auth/register/register.component';
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
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'become-host',
    loadComponent: () => import('./features/host/become-host/become-host.component').then(m => m.BecomeHostComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
