import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationShellComponent } from './components/location-shell/location-shell'; // Import LocationShellComponent

const routes: Routes = [
  {
    path: 'new',
    component: LocationShellComponent // Use LocationShellComponent
  },
  {
    path: ':id/edit',
    component: LocationShellComponent // Use LocationShellComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentalManagementRoutingModule { }
