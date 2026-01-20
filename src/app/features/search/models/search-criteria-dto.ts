import { SortBy } from './sort-by.enum';

/**
 * Search criteria DTO matching backend SearchCriteriaDTO.
 * Used for API requests to /api/v1/locations/search
 */
export interface SearchCriteriaDTO {
    // Text search
    location?: string;

    // Geo-proximity
    latitude?: number;
    longitude?: number;
    radiusKm?: number;

    // Availability
    checkIn?: string; // ISO 8601 date (YYYY-MM-DD)
    checkOut?: string; // ISO 8601 date (YYYY-MM-DD)

    // Capacity
    guests?: number;

    // Price range
    minPrice?: number;
    maxPrice?: number;

    // Property type
    propertyType?: string;

    // Amenities
    amenities?: string[];

    // Sorting
    sortBy?: SortBy;

    // Pagination
    page: number;
    size: number;
}
