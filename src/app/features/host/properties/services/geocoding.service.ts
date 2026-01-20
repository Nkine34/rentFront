import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map } from 'rxjs/operators';

interface GeocodingResult {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  lat: number;
  lng: number;
  provider: 'Google' | 'Nominatim';
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private geocoder!: google.maps.Geocoder;
  private nominatimApiUrl = 'https://nominatim.openstreetmap.org/search';
  private nominatimReverseApiUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
      this.geocoder = new google.maps.Geocoder();
    } else {
      console.warn('Google Maps API not loaded. Google Geocoding will not be available.');
    }
  }

  searchAddress(query: string, provider: 'Google' | 'Nominatim' = 'Google'): Observable<GeocodingResult[]> {
    if (provider === 'Google' && this.geocoder) {
      return new Observable<GeocodingResult[]>(observer => {
        this.geocoder.geocode({ address: query }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            const mappedResults: GeocodingResult[] = results.map(result => ({
              address: this.parseGoogleAddressComponents(result.address_components),
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
              provider: 'Google'
            }));
            observer.next(mappedResults);
          } else {
            this.snackBar.open(`Google Geocoding failed: ${status}`, 'Dismiss', { duration: 5000 });
            observer.error(`Google Geocoding failed: ${status}`);
          }
          observer.complete();
        });
      });
    } else if (provider === 'Nominatim') {
      // Nominatim (OpenStreetMap) geocoding
      return this.http.get<any[]>(this.nominatimApiUrl, {
        params: {
          q: query,
          format: 'json',
          addressdetails: '1',
          limit: '5'
        }
      }).pipe(
        map(response => response.map(item => ({
          address: {
            street: item.address.road || '',
            city: item.address.city || item.address.town || item.address.village || '',
            state: item.address.state || '',
            zipCode: item.address.postcode || '',
            country: item.address.country || ''
          },
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          provider: 'Nominatim' as const
        }))),
        catchError(error => {
          this.snackBar.open(`Nominatim Geocoding failed: ${error.message}`, 'Dismiss', { duration: 5000 });
          return of([]);
        })
      );
    } else {
      this.snackBar.open('Geocoding provider not available or not selected.', 'Dismiss', { duration: 5000 });
      return of([]);
    }
  }

  reverseGeocode(lat: number, lng: number, provider: 'Google' | 'Nominatim' = 'Google'): Observable<GeocodingResult | null> {
    if (provider === 'Google' && this.geocoder) {
      return new Observable<GeocodingResult | null>(observer => {
        this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const result = results[0];
            observer.next({
              address: this.parseGoogleAddressComponents(result.address_components),
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
              provider: 'Google'
            });
          } else {
            this.snackBar.open(`Google Reverse Geocoding failed: ${status}`, 'Dismiss', { duration: 5000 });
            observer.error(`Google Reverse Geocoding failed: ${status}`);
          }
          observer.complete();
        });
      });
    } else if (provider === 'Nominatim') {
      // Nominatim (OpenStreetMap) reverse geocoding
      return this.http.get<any>(this.nominatimReverseApiUrl, {
        params: {
          lat: lat.toString(),
          lon: lng.toString(),
          format: 'json',
          addressdetails: '1'
        }
      }).pipe(
        map(response => ({
          address: {
            street: response.address.road || '',
            city: response.address.city || response.address.town || response.address.village || '',
            state: response.address.state || '',
            zipCode: response.address.postcode || '',
            country: response.address.country || ''
          },
          lat: parseFloat(response.lat),
          lng: parseFloat(response.lon),
          provider: 'Nominatim' as const
        })),
        catchError(error => {
          this.snackBar.open(`Nominatim Reverse Geocoding failed: ${error.message}`, 'Dismiss', { duration: 5000 });
          return of(null);
        })
      );
    } else {
      this.snackBar.open('Reverse Geocoding provider not available or not selected.', 'Dismiss', { duration: 5000 });
      return of(null);
    }
  }

  private parseGoogleAddressComponents(components: google.maps.GeocoderAddressComponent[]): GeocodingResult['address'] {
    const address: GeocodingResult['address'] = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };

    components.forEach(component => {
      if (component.types.includes('street_number')) {
        address.street = `${component.long_name} ${address.street}`;
      } else if (component.types.includes('route')) {
        address.street = `${address.street} ${component.long_name}`.trim();
      } else if (component.types.includes('locality')) {
        address.city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        address.state = component.long_name;
      } else if (component.types.includes('postal_code')) {
        address.zipCode = component.long_name;
      } else if (component.types.includes('country')) {
        address.country = component.long_name;
      }
    });

    return address;
  }
}
