import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users'; // Assurez-vous que cela correspond à votre proxy ou URL complète

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}
