import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LLocation } from '../models/rental.models';

@Injectable({
  providedIn: 'root'
})
export class RentalApiService { // Renamed to RentalApiService for consistency
  private apiUrl = 'http://localhost:8080/api/rentals'; // TODO: Configure your actual backend API URL

  constructor(private http: HttpClient) { }

  getRental(id: string): Observable<LLocation> {
    return this.http.get<LLocation>(`${this.apiUrl}/${id}`);
  }

  createRental(rental: LLocation): Observable<LLocation> {
    return this.http.post<LLocation>(this.apiUrl, rental);
  }

  updateRental(id: string, rental: Partial<LLocation>): Observable<LLocation> {
    return this.http.put<LLocation>(`${this.apiUrl}/${id}`, rental);
  }

  uploadPhotos(locationId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    // Assuming your backend has an endpoint like /api/rentals/{locationId}/photos for uploads
    return this.http.post(`${this.apiUrl}/${locationId}/photos`, formData);
  }

  deletePhoto(locationId: string, photoId: string): Observable<void> {
    // Assuming your backend has an endpoint like /api/rentals/{locationId}/photos/{photoId} for deletion
    return this.http.delete<void>(`${this.apiUrl}/${locationId}/photos/${photoId}`);
  }
}
