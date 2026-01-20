import { Component, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { SearchCriteriaDTO } from '../../models/search-criteria-dto';
import { SortBy } from '../../models/sort-by.enum';

/**
 * Search bar component with reactive form.
 * Emits search criteria when user submits.
 */
@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatIconModule
    ],
    template: `
    <div class="search-bar">
      <form [formGroup]="searchForm" (ngSubmit)="onSubmit()" class="search-form">
        <div class="form-row">
          <!-- Location -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Where</mat-label>
            <input matInput formControlName="location" placeholder="City, country...">
            <mat-icon matPrefix>location_on</mat-icon>
          </mat-form-field>

          <!-- Check-in -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Check-in</mat-label>
            <input matInput [matDatepicker]="checkin" formControlName="checkIn">
            <mat-datepicker-toggle matIconSuffix [for]="checkin"></mat-datepicker-toggle>
            <mat-datepicker #checkin></mat-datepicker>
          </mat-form-field>

          <!-- Check-out -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Check-out</mat-label>
            <input matInput [matDatepicker]="checkout" formControlName="checkOut">
            <mat-datepicker-toggle matIconSuffix [for]="checkout"></mat-datepicker-toggle>
            <mat-datepicker #checkout></mat-datepicker>
          </mat-form-field>

          <!-- Guests -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Guests</mat-label>
            <input matInput type="number" formControlName="guests" min="1" placeholder="1">
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <!-- Sort By -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Sort by</mat-label>
            <mat-select formControlName="sortBy">
              <mat-option [value]="SortBy.RELEVANCE">Relevance</mat-option>
              <mat-option [value]="SortBy.PRICE_LOW_TO_HIGH">Price: Low to High</mat-option>
              <mat-option [value]="SortBy.PRICE_HIGH_TO_LOW">Price: High to Low</mat-option>
              <mat-option [value]="SortBy.RATING">Highest Rated</mat-option>
              <mat-option [value]="SortBy.NEWEST">Newest</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Search Button -->
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="loading()" class="search-button">
            <mat-icon>search</mat-icon>
            {{ loading() ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .search-bar {
      background: white;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 32px;
    }

    .search-form {
      max-width: 1200px;
      margin: 0 auto;
    }

    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }

    .form-field {
      flex: 1;
      min-width: 180px;
    }

    .search-button {
      height: 56px;
      min-width: 150px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
      
      .form-field,
      .search-button {
        width: 100%;
      }
    }
  `]
})
export class SearchBarComponent {
    readonly search = output<Partial<SearchCriteriaDTO>>();
    readonly loading = input<boolean>(false);

    protected readonly SortBy = SortBy;

    protected searchForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.searchForm = this.fb.group({
            location: [''],
            checkIn: [null],
            checkOut: [null],
            guests: [1, [Validators.min(1)]],
            sortBy: [SortBy.RELEVANCE]
        });
    }

    onSubmit(): void {
        if (this.searchForm.valid) {
            const formValue = this.searchForm.value;

            const criteria: Partial<SearchCriteriaDTO> = {
                location: formValue.location || undefined,
                checkIn: formValue.checkIn ? this.formatDate(formValue.checkIn) : undefined,
                checkOut: formValue.checkOut ? this.formatDate(formValue.checkOut) : undefined,
                guests: formValue.guests || undefined,
                sortBy: formValue.sortBy
            };

            this.search.emit(criteria);
        }
    }

    /**
     * Format Date to ISO 8601 string (YYYY-MM-DD).
     */
    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}
