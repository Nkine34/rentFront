export type CancellationPolicy = 'Flexible' | 'Modérée' | 'Stricte';

export interface BookingDetails {
  minNights: number;
  maxNights?: number; // Optional
  cleaningFee: number;
  serviceFee: number;
  taxRate: number; // Percentage, e.g., 0.15 for 15%
  cancellationPolicy: CancellationPolicy;
}
