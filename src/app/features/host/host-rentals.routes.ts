import { Routes } from '@angular/router';
import { RentalListComponent } from './rental-list/rental-list.component';

export const hostRentalsRoutes: Routes = [
    {
        path: '',
        component: RentalListComponent
    },
    {
        path: 'new',
        redirectTo: '/locations/new',
        pathMatch: 'full'
    },
    {
        path: ':id/edit',
        redirectTo: '/locations/:id/edit',
        pathMatch: 'full'
    }
];
