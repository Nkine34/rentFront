import { Component, computed, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';
import { SearchCriteria } from '../../../models';

@Component({
  selector: 'app-simple-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.scss']
})
export class SimpleSearchComponent {
  @Output() searchSubmit = new EventEmitter<SearchCriteria>();

  searchForm = new FormGroup({
    destination: new FormControl(''),
    checkIn: new FormControl<Date | null>(null),
    checkOut: new FormControl<Date | null>(null),
  });

  adults = signal(1);
  children = signal(0);
  babies = signal(0);
  pets = signal(0);

  totalTravelers = computed(() => this.adults() + this.children() + this.babies());

  // Store advanced criteria to persist them across search actions
  private advancedCriteria: Partial<SearchCriteria> = {};

  constructor(private dialog: MatDialog) { }

  openAdvancedSearch() {
    this.dialog.open(AdvancedSearchComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'advanced-search-dialog',
      data: this.advancedCriteria // Optional: pass current state back to dialog if implemented
    }).afterClosed().subscribe((result: Partial<SearchCriteria> | undefined) => {
      if (result) {
        this.advancedCriteria = result; // Persist selection
        this.performSearch(); // Trigger search immediately
      }
    });
  }

  search(): void {
    this.performSearch();
  }

  private performSearch(): void {
    const formValue = this.searchForm.value;
    const baseCriteria: SearchCriteria = {
      destination: formValue.destination ?? null,
      checkIn: formValue.checkIn ?? null,
      checkOut: formValue.checkOut ?? null,
      travelers: {
        adults: this.adults(),
        children: this.children(),
        babies: this.babies(),
        pets: this.pets()
      }
    };

    // Merge base criteria with persisted advanced criteria
    const mergedCriteria = { ...baseCriteria, ...this.advancedCriteria };
    console.log('Emitting Search Criteria:', mergedCriteria);
    this.searchSubmit.emit(mergedCriteria);
  }

  increment(travelerType: 'adults' | 'children' | 'babies' | 'pets') {
    this[travelerType].update(value => value + 1);
  }

  decrement(travelerType: 'adults' | 'children' | 'babies' | 'pets') {
    if (this[travelerType]() > 0) {
      if (travelerType === 'adults' && this[travelerType]() === 1) {
        return;
      }
      this[travelerType].update(value => value - 1);
    }
  }
}
