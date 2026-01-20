import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateReservationDto, ReservationDto, ReservationListDto, StayQuoteDto } from '../models/reservation.model';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private readonly http = inject(HttpClient);
    // Assuming environment.apiUrl is defined in environment files. If not, fallback to /api
    private readonly apiUrl = '/api';

    quote(locationId: number, startDate: string, endDate: string): Observable<StayQuoteDto> {
        return this.http.post<StayQuoteDto>(`${this.apiUrl}/locations/${locationId}/quote`, { startDate, endDate });
    }

    createReservation(locationId: number, dto: CreateReservationDto): Observable<ReservationDto> {
        return this.http.post<ReservationDto>(`${this.apiUrl}/locations/${locationId}/reservations`, dto);
    }

    getMyReservations(): Observable<ReservationListDto[]> {
        return this.http.get<ReservationListDto[]>(`${this.apiUrl}/me/reservations`);
    }

    // NOTE: This endpoint is missing in MVP4 Backend, but required for Host features.
    // Reporting as limitation.
    getIncomingReservations(): Observable<ReservationListDto[]> {
        return this.http.get<ReservationListDto[]>(`${this.apiUrl}/me/reservations/incoming`);
    }

    cancelReservation(reservationId: string): Observable<ReservationDto> {
        return this.http.patch<ReservationDto>(`${this.apiUrl}/reservations/${reservationId}/cancel`, {});
    }

    updateStatus(reservationId: string, status: 'CONFIRMED' | 'REJECTED' | 'CANCELLED'): Observable<ReservationDto> {
        return this.http.patch<ReservationDto>(`${this.apiUrl}/reservations/${reservationId}/status`, { status });
    }
}
