import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationsApiService } from './locations-api.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoUploadService {

  constructor(private locationsApiService: LocationsApiService) { }

  uploadPhotos(rentalId: string, files: File[]): Observable<any> {
    return this.locationsApiService.uploadPhotos(rentalId, files);
  }

  deletePhoto(rentalId: string, photoId: string): Observable<void> {
    return this.locationsApiService.deletePhoto(rentalId, photoId);
  }
}
