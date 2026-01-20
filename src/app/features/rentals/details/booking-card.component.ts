import { ChangeDetectionStrategy, Component, Input, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingDetails } from '../models/booking-details.model';
import { ReservationService } from '../../../shared/services/reservation.service';
import { PriceBreakdownDto, StayQuoteDto } from '../../../shared/models/reservation.model';
import { Router } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCardComponent {
  @Input({ required: true }) locationId!: number;
  @Input({ required: true }) pricePerNight!: number;
  @Input({ required: true }) details!: BookingDetails;
  @Input({ required: true }) maxGuests!: number;

  private readonly reservationService = inject(ReservationService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  bookingForm = new FormGroup({
    checkIn: new FormControl<Date | null>(null, Validators.required),
    checkOut: new FormControl<Date | null>(null, Validators.required),
    guests: new FormControl<number>(1, [Validators.required, Validators.min(1)])
  });

  // State
  quote = signal<StayQuoteDto | null>(null);
  isLoading = signal(false);
  isReserving = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    // Listen to form changes to trigger quote
    this.bookingForm.valueChanges.subscribe(val => {
      if (val.checkIn && val.checkOut && val.guests) {
        this.calculateQuote();
      } else {
        this.quote.set(null);
      }
    });
  }

  calculateQuote() {
    const checkIn = this.bookingForm.value.checkIn;
    const checkOut = this.bookingForm.value.checkOut;

    if (!checkIn || !checkOut) return;

    // Format dates to YYYY-MM-DD
    const startDate = this.formatDate(checkIn);
    const endDate = this.formatDate(checkOut);

    if (startDate === endDate) return; // Ignore same day

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.reservationService.quote(this.locationId, startDate, endDate)
      .pipe(
        catchError(err => {
          console.error('Quote error', err);
          this.errorMessage.set('Dates non disponibles ou erreur serveur.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(quote => {
        if (quote && quote.isBookable) {
          this.quote.set(quote);
        } else if (quote && !quote.isBookable) {
          this.quote.set(null);
          this.errorMessage.set(quote.reasons.join(', '));
        } else {
          this.quote.set(null);
        }
      });
  }

  reserve() {
    if (this.bookingForm.invalid || !this.quote()) return;

    this.isReserving.set(true);
    const val = this.bookingForm.value;
    const dto = {
      startDate: this.formatDate(val.checkIn!),
      endDate: this.formatDate(val.checkOut!),
      guestsCount: val.guests!
    };

    this.reservationService.createReservation(this.locationId, dto)
      .pipe(
        finalize(() => this.isReserving.set(false))
      )
      .subscribe({
        next: (res) => {
          this.snackBar.open('Réservation confirmée !', 'Voir mes voyages', { duration: 5000 })
            .onAction().subscribe(() => {
              this.router.navigate(['/trips']);
            });
          this.bookingForm.reset();
          this.quote.set(null);
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message || 'Erreur lors de la réservation.';
          this.snackBar.open(msg, 'Fermer', { duration: 5000 });
        }
      });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }
}