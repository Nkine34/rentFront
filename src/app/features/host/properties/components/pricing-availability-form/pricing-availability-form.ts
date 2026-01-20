import { Component, Input, signal } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';  // Bonus

@Component({
  selector: 'app-pricing-availability-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  // ✅ AJOUTÉ (c'était manquant !)
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule
  ],
  templateUrl: './pricing-availability-form.html',
  styleUrls: ['./pricing-availability-form.css']
})
export class PricingAvailabilityFormComponent {
  @Input() parentForm!: FormGroup;

  // Signal pour devises (moderne)
  availableCurrencies = signal(['USD', 'EUR', 'GBP', 'CAD', 'AUD']);

  constructor(private fb: FormBuilder) {}

  get availability(): FormArray {
    return this.parentForm.get('availability') as FormArray;
  }

  addAvailabilityPeriod(): void {
    const basePrice = this.parentForm.get('basePrice')?.value || 0;

    this.availability.push(this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      priceBase: [basePrice, [Validators.required, Validators.min(0.01)]],
      promoRate: [0, [Validators.min(0), Validators.max(100)]],
      currency: ['EUR', Validators.required]
    }));
  }

  removeAvailabilityPeriod(index: number): void {
    this.availability.removeAt(index);
  }

  // Ajoute ces méthodes
  getAvailabilityControls() {
    return (this.parentForm.get('availability') as FormArray).controls;
  }

// Validation dates (bonus)
  onDateChange(): void {
    // Vérif start < end + pas chevauchement
  }


  // Validation croisée (pas de chevauchement)
  validateNoOverlap(): void {
    // Logique à implémenter
  }
}
