import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocationsApiService } from '../../../locations/services/locations-api.service';
import { Location } from '../../../locations/models/location.interface';

@Component({
    standalone: true,
    selector: 'app-rental-list',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="rental-list-container">
      <div class="header">
        <h1>Mes Annonces</h1>
        <button mat-raised-button color="primary" (click)="createNewRental()">
          <mat-icon>add</mat-icon>
          Créer une nouvelle annonce
        </button>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
          <p>Chargement de vos annonces...</p>
        </div>
      } @else if (error()) {
        <div class="error-container">
          <mat-icon color="warn">error</mat-icon>
          <p>{{ error() }}</p>
          <button mat-raised-button (click)="loadRentals()">Réessayer</button>
        </div>
      } @else if (rentals().length === 0) {
        <div class="empty-state">
          <mat-icon>home_work</mat-icon>
          <h2>Aucune annonce pour le moment</h2>
          <p>Commencez par créer votre première annonce pour accueillir des voyageurs.</p>
          <button mat-raised-button color="primary" (click)="createNewRental()">
            <mat-icon>add</mat-icon>
            Créer ma première annonce
          </button>
        </div>
      } @else {
        <div class="rentals-grid">
          @for (rental of rentals(); track rental.id) {
            <mat-card class="rental-card">
              <div class="rental-image">
                @if (rental.photos && rental.photos.length > 0) {
                  <img [src]="rental.photos[0].url" [alt]="rental.title">
                } @else {
                  <div class="no-image">
                    <mat-icon>image</mat-icon>
                  </div>
                }
              </div>
              <mat-card-content>
                <h3>{{ rental.title }}</h3>
                <p class="location-type">{{ rental.locationType }}</p>
                <p class="capacity">
                  <mat-icon>people</mat-icon>
                  {{ rental.capacity }} voyageurs · 
                  {{ rental.bedrooms }} chambres · 
                  {{ rental.beds }} lits · 
                  {{ rental.bathrooms }} salles de bain
                </p>
                <p class="price">{{ rental.basePrice }} {{ rental.currency }} / nuit</p>
                @if (rental.rating) {
                  <p class="rating">
                    <mat-icon>star</mat-icon>
                    {{ rental.rating }}
                  </p>
                }
              </mat-card-content>
              <mat-card-actions>
                <button mat-button color="primary" (click)="editRental(rental.id!)">
                  <mat-icon>edit</mat-icon>
                  Modifier
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
    styles: [`
    .rental-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
      color: #222;
    }

    .header button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .loading-container,
    .error-container,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .loading-container p,
    .error-container p {
      margin-top: 1rem;
      color: #666;
    }

    .error-container mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .error-container button {
      margin-top: 1rem;
    }

    .empty-state mat-icon {
      font-size: 5rem;
      width: 5rem;
      height: 5rem;
      color: #ddd;
    }

    .empty-state h2 {
      margin: 1rem 0 0.5rem;
      color: #222;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .empty-state button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rentals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .rental-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .rental-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .rental-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 4px 4px 0 0;
      background: #f5f5f5;
    }

    .rental-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e0e0e0;
    }

    .no-image mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #999;
    }

    mat-card-content {
      padding: 1rem;
    }

    mat-card-content h3 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: #222;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .location-type {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 0.5rem;
      text-transform: capitalize;
    }

    .capacity {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }

    .capacity mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .price {
      font-weight: 600;
      color: #222;
      margin: 0.5rem 0 0;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #222;
      font-size: 0.9rem;
      margin: 0.5rem 0 0;
    }

    .rating mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #ffa726;
    }

    mat-card-actions {
      padding: 0 1rem 1rem;
      display: flex;
      justify-content: flex-end;
    }

    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    @media (max-width: 768px) {
      .rental-list-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .rentals-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RentalListComponent implements OnInit {
    rentals = signal<Location[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    constructor(
        private locationsApiService: LocationsApiService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadRentals();
    }

    loadRentals(): void {
        this.loading.set(true);
        this.error.set(null);

        this.locationsApiService.getMyLocations().subscribe({
            next: (locations) => {
                this.rentals.set(locations);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading rentals:', err);
                this.error.set('Impossible de charger vos annonces. Veuillez réessayer.');
                this.loading.set(false);
            }
        });
    }

    createNewRental(): void {
        this.router.navigate(['/locations/new']);
    }

    editRental(id: string): void {
        this.router.navigate(['/locations', id, 'edit']);
    }
}
