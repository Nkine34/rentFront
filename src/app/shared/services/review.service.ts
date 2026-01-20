import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReviewDto, CreateReviewDto } from '../models/review.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(private http: HttpClient) { }

    getReviewsForLocation(locationId: number): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${this.apiUrl}/locations/${locationId}/reviews`);
    }

    createReview(reservationId: string, review: CreateReviewDto): Observable<ReviewDto> {
        return this.http.post<ReviewDto>(`${this.apiUrl}/reservations/${reservationId}/reviews`, review);
    }

    getReviewsForHost(hostId: number): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${this.apiUrl}/hosts/${hostId}/reviews`);
    }
}
