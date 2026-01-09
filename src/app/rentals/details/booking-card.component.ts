import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetails } from '../models/booking-details.model';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="booking-card">
      <h4>Réservation</h4>
      @if (pricePerNight && details) {
        <p><strong>{{ pricePerNight | currency:'EUR':'symbol':'1.0-0' }}</strong> par nuit</p>
        <p>Frais de ménage: {{ details.cleaningFee | currency:'EUR' }}</p>
        <p>Frais de service: {{ details.serviceFee | currency:'EUR' }}</p>
        <p>Politique d'annulation : {{ details.cancellationPolicy }}</p>
      }
    </div>
  `,
  styleUrls: ['./booking-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCardComponent {
  @Input({ required: true }) pricePerNight!: number;
  @Input({ required: true }) details!: BookingDetails;
}