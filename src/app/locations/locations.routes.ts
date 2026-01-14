import { Routes } from '@angular/router';
import { LocationShellComponent } from './components/location-shell/location-shell';
import { HostLocationGuard } from './guards/host-location.guard';

export const locationsRoutes: Routes = [
  {
    path: 'new',
    component: LocationShellComponent,
    canActivate: [HostLocationGuard]
  },
  {
    path: ':id/edit',
    component: LocationShellComponent,
    canActivate: [HostLocationGuard]
  },
  // {
  //   path: '', // Default path for /host/locations
  //   component: RentalListComponent // TODO: Create RentalListComponent
  // }
];
