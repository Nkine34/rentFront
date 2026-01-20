import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { SearchApiService } from '../../services/search-api.service';
import { SearchCriteriaDTO } from '../../models/search-criteria-dto';
import { SearchResultPageDTO } from '../../models/search-result-page-dto';
import { SortBy } from '../../models/sort-by.enum';

/**
 * Main search page container component.
 * Manages search state and coordinates child components.
 */
@Component({
    selector: 'app-search-page',
    standalone: true,
    imports: [CommonModule, SearchBarComponent, SearchResultsComponent],
    template: `
    <div class="search-page">
      <app-search-bar 
        (search)="onSearch($event)"
        [loading]="loading()"
      />
      
      <app-search-results
        [results]="searchResults()?.results ?? []"
        [page]="searchResults()"
        [loading]="loading()"
        [error]="error()"
        (pageChange)="onPageChange($event)"
      />
    </div>
  `,
    styles: [`
    .search-page {
      min-height: 100vh;
      background-color: #f7f7f7;
    }
  `]
})
export class SearchPageComponent {
    private readonly searchApi = inject(SearchApiService);

    // State signals
    protected readonly searchResults = signal<SearchResultPageDTO | null>(null);
    protected readonly loading = signal<boolean>(false);
    protected readonly error = signal<string | null>(null);
    private currentCriteria: SearchCriteriaDTO | null = null;

    /**
     * Handle search form submission.
     * Resets to page 0.
     */
    onSearch(criteria: Partial<SearchCriteriaDTO>): void {
        this.currentCriteria = {
            ...criteria,
            page: 0,
            size: 20,
            sortBy: criteria.sortBy ?? SortBy.RELEVANCE
        } as SearchCriteriaDTO;

        this.executeSearch();
    }

    /**
     * Handle pagination change.
     * Maintains current search criteria.
     */
    onPageChange(page: number): void {
        if (this.currentCriteria) {
            this.currentCriteria = {
                ...this.currentCriteria,
                page
            };
            this.executeSearch();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    /**
     * Execute search API call.
     */
    private executeSearch(): void {
        if (!this.currentCriteria) return;

        this.loading.set(true);
        this.error.set(null);

        this.searchApi.searchLocations(this.currentCriteria).subscribe({
            next: (results) => {
                this.searchResults.set(results);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Search error:', err);
                this.error.set('Unable to load search results. Please try again.');
                this.loading.set(false);
            }
        });
    }
}
