import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchCriteriaDTO } from '../models/search-criteria-dto';
import { SearchResultPageDTO } from '../models/search-result-page-dto';

/**
 * Service for location search API calls.
 * Communicates with backend /api/v1/locations/search endpoint.
 */
@Injectable({
    providedIn: 'root'
})
export class SearchApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/v1/locations/search';

    /**
     * Search for locations with given criteria.
     * Automatically builds HTTP params from criteria object.
     * 
     * @param criteria Search criteria
     * @returns Observable of paginated search results
     */
    searchLocations(criteria: SearchCriteriaDTO): Observable<SearchResultPageDTO> {
        const params = this.buildHttpParams(criteria);
        return this.http.get<SearchResultPageDTO>(this.baseUrl, { params });
    }

    /**
     * Build HTTP query parameters from criteria object.
     * Only includes non-null/undefined values.
     */
    private buildHttpParams(criteria: SearchCriteriaDTO): HttpParams {
        let params = new HttpParams()
            .set('page', criteria.page.toString())
            .set('size', criteria.size.toString());

        if (criteria.location) {
            params = params.set('location', criteria.location);
        }
        if (criteria.latitude !== undefined && criteria.latitude !== null) {
            params = params.set('latitude', criteria.latitude.toString());
        }
        if (criteria.longitude !== undefined && criteria.longitude !== null) {
            params = params.set('longitude', criteria.longitude.toString());
        }
        if (criteria.radiusKm) {
            params = params.set('radiusKm', criteria.radiusKm.toString());
        }
        if (criteria.checkIn) {
            params = params.set('checkIn', criteria.checkIn);
        }
        if (criteria.checkOut) {
            params = params.set('checkOut', criteria.checkOut);
        }
        if (criteria.guests) {
            params = params.set('guests', criteria.guests.toString());
        }
        if (criteria.minPrice !== undefined && criteria.minPrice !== null) {
            params = params.set('minPrice', criteria.minPrice.toString());
        }
        if (criteria.maxPrice !== undefined && criteria.maxPrice !== null) {
            params = params.set('maxPrice', criteria.maxPrice.toString());
        }
        if (criteria.propertyType) {
            params = params.set('propertyType', criteria.propertyType);
        }
        if (criteria.sortBy) {
            params = params.set('sortBy', criteria.sortBy);
        }
        if (criteria.amenities && criteria.amenities.length > 0) {
            criteria.amenities.forEach(amenity => {
                params = params.append('amenities', amenity);
            });
        }

        return params;
    }
}
