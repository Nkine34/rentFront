import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocationListComponent } from '../locations/location-list.component';
import { LocationStore } from '../state/location.store';
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocationListComponent,
    CommonModule
  ]
})
export class HomeComponent implements OnInit {
  protected readonly store = inject(LocationStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.loadLocations();
  }

  // Méthode pour gérer la navigation
  navigateToDetails(id: number): void {
    console.log(`HomeComponent: Navigation vers les détails de l'annonce ID: ${id}`);
    this.router.navigate(['/details', id]);
  }
}
