import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { LocationCardComponent } from '../location-card/location-card.component';
import { SearchResultDTO } from '../../models/search-result-dto';
import { SearchResultPageDTO } from '../../models/search-result-page-dto';

/**
 * Search results component.
 * Displays grid of location cards with pagination.
 * Handles loading, empty, and error states.
 */
@Component({
    selector: 'app-search-results',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatCardModule,
        LocationCardComponent
    ],
    template: `
    <div class="search-results">
      <!-- Loading State -->
      @if (loading()) {
        <div class="state-container">
          <mat-spinner diameter="60"></mat-spinner>
          <p class="state-message">Searching for perfect locations...</p>
        </div>
      }

      <!-- Error State -->
      @else if (error()) {
        <div class="state-container">
          <mat-card class="error-card">
            <mat-card-content>
              <p class="error-message">{{ error() }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      }

      <!-- Empty State -->
      @else if (results().length === 0) {
        <div class="state-container">
          <mat-card class="empty-card">
            <mat-card-content>
              <h2>No locations found</h2>
              <p>Try adjusting your search criteria to find more options.</p>
            </mat-card-content>
          </mat-card>
        </div>
      }

      <!-- Results Grid -->
      @else {
        <div class="results-container">
          <!-- Results Count -->
          @if (page()) {
            <div class="results-header">
              <p class="results-count">
                {{ page()!.totalElements }} {{ page()!.totalElements === 1 ? 'location' : 'locations' }} found
              </p>
            </div>
          }

          <!-- Grid -->
          <div class="results-grid">
            @for (location of results(); track location.publicId) {
              <app-location-card [location]="location" />
            }
          </div>

          <!-- Pagination -->
          @if (page() && page()!.totalPages > 1) {
            <mat-paginator
              [length]="page()!.totalElements"
              [pageSize]="page()!.numberOfElements"
              [pageIndex]="page()!.currentPage"
              [hidePageSize]="true"
              (page)="onPageChange($event)"
              class="pagination"
            />
          }
        </div>
      }
    </div>
  `,
    styles: [`
    .search-results {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px 48px;
    }

    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
    }

    .state-message {
      margin-top: 24px;
      font-size: 16px;
      color: #666;
    }

    .error-card,
    .empty-card {
      max-width: 500px;
      text-align: center;
    }

    .error-message {
      color: #d32f2f;
      font-size: 16px;
    }

    .results-header {
      margin-bottom: 24px;
    }

    .results-count {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .pagination {
      display: flex;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .results-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SearchResultsComponent {
    readonly results = input.required<SearchResultDTO[]>();
    readonly page = input<SearchResultPageDTO | null>(null);
    readonly loading = input<boolean>(false);
    readonly error = input<string | null>(null);
    readonly pageChange = output<number>();

    onPageChange(event: PageEvent): void {
        this.pageChange.emit(event.pageIndex);
    }
}
