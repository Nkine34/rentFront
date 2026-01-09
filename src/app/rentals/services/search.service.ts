import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Location } from '../models/location.model';
import { SearchCriteria } from '../models/search-criteria.model';
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

  /**
   * Recherche les locations selon les critères fournis
   * @param criteria Critères de recherche (destination, dates, voyageurs)
   * @returns Observable contenant les locations filtrées
   */
  searchLocations(criteria: SearchCriteria): Observable<Location[]> {
    const url = `${environment.apiUrl}/api/locations/search`;

    // Préparer les données pour l'envoi au backend
    const searchPayload = {
      destination: criteria.destination || '',
      checkIn: criteria.checkIn ? this.formatDate(criteria.checkIn) : null,
      checkOut: criteria.checkOut ? this.formatDate(criteria.checkOut) : null,
      adults: criteria.travelers.adults,
      children: criteria.travelers.children,
      babies: criteria.travelers.babies,
      pets: criteria.travelers.pets
    };

    return this.http.post<Location[]>(url, searchPayload);
  }

  /**
   * Formate une Date JavaScript en format ISO (YYYY-MM-DD) pour le backend
   */
  private formatDate(date: Date): string {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
