import { Injectable, signal, computed } from '@angular/core';
import { LocationsApiService } from './locations-api.service';
import { Location } from '../models/location.interface';
import { tap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface LocationsState {
  currentRental: Location | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class LocationsStore {
  // State
  private state = signal<LocationsState>({
    currentRental: null,
    isLoading: false,
    error: null,
  });

  // Selectors
  currentRental = computed(() => this.state().currentRental);
  isLoading = computed(() => this.state().isLoading);
  error = computed(() => this.state().error);
  isDraft = computed(() => {
    const rental = this.state().currentRental;
    return rental ? !rental.id : true;
  });

  constructor(private locationsApiService: LocationsApiService) { }

  loadRental(id: string): void {
    this.state.update(state => ({ ...state, isLoading: true, error: null }));
    this.locationsApiService.getRental(id).pipe(
      finalize(() => this.state.update(state => ({ ...state, isLoading: false })))
    ).subscribe({
      next: (rental) => this.state.update(state => ({ ...state, currentRental: rental })),
      error: (err) => this.state.update(state => ({ ...state, error: err.message || 'Failed to load rental' }))
    });
  }

  createRental(rental: Location): Observable<Location> {
    this.state.update(state => ({ ...state, isLoading: true, error: null }));
    return this.locationsApiService.createRental(rental).pipe(
      tap(newRental => this.state.update(state => ({ ...state, currentRental: newRental }))),
      finalize(() => this.state.update(state => ({ ...state, isLoading: false })))
    );
  }

  updateRental(id: string, rental: Partial<Location>): Observable<Location> {
    this.state.update(state => ({ ...state, isLoading: true, error: null }));
    return this.locationsApiService.updateRental(id, rental).pipe(
      tap(updatedRental => this.state.update(state => ({ ...state, currentRental: updatedRental }))),
      finalize(() => this.state.update(state => ({ ...state, isLoading: false })))
    );
  }

  saveDraft(rental: Partial<Location>): Observable<Location> {
    this.state.update(state => ({ ...state, isLoading: true, error: null }));
    return this.locationsApiService.saveDraft(rental).pipe(
      tap(savedRental => this.state.update(state => ({ ...state, currentRental: savedRental }))),
      finalize(() => this.state.update(state => ({ ...state, isLoading: false })))
    );
  }

  publishRental(id: string): Observable<Location> {
    this.state.update(state => ({ ...state, isLoading: true, error: null }));
    return this.locationsApiService.publishRental(id).pipe(
      tap(publishedRental => this.state.update(state => ({ ...state, currentRental: publishedRental }))),
      finalize(() => this.state.update(state => ({ ...state, isLoading: false })))
    );
  }

  // Optionally, clear the current rental when navigating away
  clearCurrentRental(): void {
    this.state.update(state => ({ ...state, currentRental: null }));
  }
}
