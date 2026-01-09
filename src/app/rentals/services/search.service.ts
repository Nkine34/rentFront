import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Location } from '../models/location.model';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  getLocations(): Observable<Location[]> {
    const url = `${environment.apiUrl}/api/locations`;
    return this.http.get<Location[]>(url);
  }
}
