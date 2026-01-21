import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { HomeComponent } from './features/rentals/home/home.component';
import { locationsResolver } from './features/rentals/location.resolver';
import { LoginComponent } from './features/auth/login/login.component';
import { CallbackComponent } from './features/auth/callback/callback.component';
import { SearchPageComponent } from './features/rentals/search/pages/search-page/search-page.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LocationDetailsComponent } from './features/rentals/details/location-details.component';

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
    path: 'trips',
    loadComponent: () => import('./features/my-trips/my-trips.component').then(m => m.MyTripsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'host/become-host',
    loadComponent: () => import('./features/host/become-host/become-host.component').then(m => m.BecomeHostComponent),
    canActivate: [authGuard]
  },
  {
    path: 'host/reservations',
    loadComponent: () => import('./features/host/reservations/host-reservations.component').then(m => m.HostReservationsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'host/rentals',
    loadChildren: () => import('./features/host/host-rentals.routes').then(m => m.hostRentalsRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'locations', // New base path for locations feature (Host Properties)
    loadChildren: () => import('./features/host/properties/locations.routes').then(m => m.locationsRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'checkout/:id',
    loadComponent: () => import('./features/checkout/pages/checkout-page/checkout-page.component').then(m => m.CheckoutPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inbox',
    loadComponent: () => import('./features/rentals/inbox/inbox.component').then(m => m.InboxComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
