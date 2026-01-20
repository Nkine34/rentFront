import { Component, computed, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
    MatTooltipModule,
    RouterLink
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

  constructor(private dialog: MatDialog) { }

  openAdvancedSearch() {
    this.dialog.open(AdvancedSearchComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'advanced-search-dialog'
    }).afterClosed().subscribe((result: Partial<SearchCriteria> | undefined) => {
      if (result) {
        // Merge advanced filters with current form filters and emit
        const formValue = this.searchForm.value;
        const currentCriteria: SearchCriteria = {
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
        const mergedCriteria = { ...currentCriteria, ...result };
        this.searchSubmit.emit(mergedCriteria);
      }
    });
  }

  search(): void {
    const formValue = this.searchForm.value;
    const searchCriteria: SearchCriteria = {
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
    this.searchSubmit.emit(searchCriteria);
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
