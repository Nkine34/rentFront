import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../models/location.interface'; // Updated import

@Injectable({
  providedIn: 'root'
})
export class LocationsApiService { // Renamed class
  private apiUrl = 'http://localhost:8080/api/rentals'; // TODO: Configure your actual backend API URL

  constructor(private http: HttpClient) { }

  getMyLocations(): Observable<Location[]> {
    return this.http.get<Location[]>('http://localhost:8080/api/hosts/me/locations');
  }

  getRental(id: string): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/${id}`);
  }

  createRental(rental: Location): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, rental);
  }

  updateRental(id: string, rental: Partial<Location>): Observable<Location> {
    return this.http.put<Location>(`${this.apiUrl}/${id}`, rental);
  }

  saveDraft(rental: Partial<Location>): Observable<Location> {
    if (rental.id) {
      return this.updateRental(rental.id, rental);
    } else {
      return this.createRental(rental as Location);
    }
  }

  publishRental(id: string): Observable<Location> {
    return this.http.post<Location>(`${this.apiUrl}/${id}/publish`, {});
  }

  uploadPhotos(locationId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    return this.http.post(`${this.apiUrl}/${locationId}/photos`, formData);
  }

  deletePhoto(locationId: string, photoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${locationId}/photos/${photoId}`);
  }
}
