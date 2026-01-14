import { ChangeDetectionStrategy, Component, Input, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BookingDetails } from '../models/booking-details.model';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCardComponent {
  @Input({ required: true }) pricePerNight!: number;
  @Input({ required: true }) details!: BookingDetails;
  @Input({ required: true }) maxGuests!: number;

  bookingForm = new FormGroup({
    checkIn: new FormControl<Date | null>(null, Validators.required),
    checkOut: new FormControl<Date | null>(null, Validators.required),
    guests: new FormControl<number>(1, [Validators.required, Validators.min(1)])
  });

  // Signals for calculated values
  totalNights = signal(0);
  totalPrice = signal(0);

  constructor() {
    // Effect to validate guest max input dynamically if needed, or we rely on template min/max
  }

  calculateTotal() {
    const checkIn = this.bookingForm.get('checkIn')?.value;
    const checkOut = this.bookingForm.get('checkOut')?.value;

    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (nights > 0) {
        this.totalNights.set(nights);

        const stayPrice = nights * this.pricePerNight;
        const cleaning = this.details.cleaningFee || 0;
        const service = this.details.serviceFee || 0;

        this.totalPrice.set(stayPrice + cleaning + service);
      } else {
        this.totalNights.set(0);
        this.totalPrice.set(0);
      }
    }
  }

  reserve() {
    if (this.bookingForm.valid) {
      console.log('Reservation triggered:', this.bookingForm.value);
      alert('Fonctionnalité de réservation à implémenter (Backend requis).');
    }
  }
}