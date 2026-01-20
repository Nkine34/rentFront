/**
 * Single search result item DTO matching backend SearchResultDTO.
 * Lightweight representation for location cards.
 */
export interface SearchResultDTO {
    publicId: string;
    slug: string;
    title: string;
    city: string;
    country: string;
    pricePerNight: number;
    rating: number;
    totalReviews: number;
    primaryPhotoUrl: string | null;
    topAmenities: string[];
    maxGuests: number;
    type: string;
    distanceKm?: number | null;
}
