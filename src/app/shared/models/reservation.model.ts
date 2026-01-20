export interface ReservationDto {
  id: string;
  locationId: number;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  guestsCount: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';
}

export interface ReservationListDto {
  id: string;
  locationId: number;
  locationTitle: string;
  locationCity: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';
}

export interface CreateReservationDto {
  startDate: string;
  endDate: string;
  guestsCount: number;
}

export interface PriceBreakdownDto {
  currency: string;
  nights: number;
  nightlySubtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  total: number;
}

export interface StayQuoteDto {
  locationId: number;
  startDate: string;
  endDate: string;
  isBookable: boolean;
  reasons: string[];
  price: PriceBreakdownDto;
}
