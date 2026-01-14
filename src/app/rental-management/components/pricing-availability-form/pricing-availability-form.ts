import { Component, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';


// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // For matDatepicker

@Component({
  selector: 'app-pricing-availability-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
],
  templateUrl: './pricing-availability-form.html',
  styleUrls: ['./pricing-availability-form.css']
})
export class PricingAvailabilityFormComponent {
  @Input() formGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  // --- Getters for FormArrays to use in the template ---
  get availability(): FormArray {
    return this.formGroup.get('availability') as FormArray;
  }

  // --- Methods to dynamically add/remove FormArray controls ---
  addAvailabilityPeriod(): void {
    this.availability.push(this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      priceBase: [this.formGroup.get('basePrice')?.value || 0, Validators.required],
      promoRate: [null]
    }));
  }

  removeAvailabilityPeriod(index: number): void {
    this.availability.removeAt(index);
  }
}
