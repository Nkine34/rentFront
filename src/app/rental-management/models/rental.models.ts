// Using "L" prefix for interfaces to avoid name collisions with potential future classes.

export interface LAddress {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface LAmenities {
  id?: string;
  wifi: boolean;
  tv: boolean;
  kitchen: boolean;
  airConditioning: boolean;
  pool: boolean;
  freeParking: boolean;
  petFriendly: boolean;
}

export interface LBookingDetails {
  id?: string;
  minNights: number;
  maxNights: number;
  cleaningFee: number;
  serviceFee: number;
  taxRate: number;
  cancellationPolicy: string; // Could be an enum: 'flexible', 'moderate', 'strict'
}

export interface LLocationPhoto {
  id?: string;
  url: string;
  description: string;
  isCover: boolean;
}

export interface LLocationHighlight {
  id?: string;
  title: string;
  icon?: string; // e.g., 'beach-access', 'mountain-view'
}

export interface LLocationAvailabilityPeriod {
  id?: string;
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format
  priceBase: number;
  promoRate?: number;
}

export interface LLocation {
  id?: string;
  hostId: string;
  title: string;
  description: string;
  locationType: string; // Could be an enum: 'apartment', 'house', 'villa'
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  basePrice: number;
  currency: string; // ISO 4217 code, e.g., 'USD', 'EUR'
  rating?: number;

  // Relational Objects
  address: LAddress;
  amenities: LAmenities;
  bookingDetails: LBookingDetails;
  photos: LLocationPhoto[];
  highlights: LLocationHighlight[];
  availability: LLocationAvailabilityPeriod[];
}
