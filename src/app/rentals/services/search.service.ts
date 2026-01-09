import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Location } from '../models';
import { SearchCriteria } from '../models';
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
      pets: criteria.travelers.pets,
      adults: criteria.travelers.adults,
      babies: criteria.travelers.babies,
      children: criteria.travelers.children,
      destination: criteria.destination || '',
      checkIn: criteria.checkIn ? this.formatDate(criteria.checkIn) : null,
      checkOut: criteria.checkOut ? this.formatDate(criteria.checkOut) : null
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
