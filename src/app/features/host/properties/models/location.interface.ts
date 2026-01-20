export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Amenities {
  id?: string;
  wifi: boolean;
  tv: boolean;
  kitchen: boolean;
  airConditioning: boolean;
  pool: boolean;
  freeParking: boolean;
  petFriendly: boolean;
}

export interface BookingDetails {
  id?: string;
  minNights: number;
  maxNights: number;
  cleaningFee: number;
  serviceFee: number;
  taxRate: number;
  cancellationPolicy: string; // Could be an enum: 'flexible', 'moderate', 'strict'
}

export interface LocationPhoto {
  id?: string;
  url: string;
  isCover: boolean;
  uploadedAt?: Date;
  isPrimary: boolean;
  orderIndex: number;
  description?: string;
  thumbnailUrl?: string;
}

export interface LocationHighlight {
  id?: string;
  title: string;
  icon?: string; // e.g., 'beach-access', 'mountain-view'
}

export interface LocationAvailabilityPeriod {
  id?: string;
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format
  priceBase: number;
  promoRate?: number;
}

export interface Location {
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
  address: Address;
  amenities: Amenities;
  bookingDetails: BookingDetails;
  photos: LocationPhoto[];
  highlights: LocationHighlight[];
  availability: LocationAvailabilityPeriod[];
}
