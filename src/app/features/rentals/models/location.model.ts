import { HousingType } from "./housing-type.model";
import { Address } from "./address.model";
import { Amenities } from "./amenities.model";
import { Host } from "./host.model";
import { BookingDetails } from "./booking-details.model";

import { LocationPhoto } from "./location-photo.model";

export interface Location {
  id: number;
  type: HousingType;
  address: Address;
  description: string;
  photos: LocationPhoto[];
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: Amenities;
  host: Host;
  bookingDetails: BookingDetails;
  highlights: string[];
  totalReviews: number;
  availableFrom: string; // Les dates des API sont généralement des chaînes (format ISO 8601)
  availableTo: string;   // Le modèle doit refléter la source de données
  hostType: 'particulier' | 'professionnel';
  pricePerNight: number;
  rating: number;
}
