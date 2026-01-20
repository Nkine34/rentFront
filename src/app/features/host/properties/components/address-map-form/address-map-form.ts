import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Keep CommonModule for ngIf/ngSwitch

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; // For map provider toggle

// Google Maps Module
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

// Services
import { GeocodingService } from '../../services/geocoding.service'; // Import GeocodingService

@Component({
  selector: 'app-address-map-form',
  standalone: true,
  imports: [
    CommonModule, // Keep CommonModule
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule, // Add MatButtonToggleModule
    GoogleMapsModule
  ],
  templateUrl: './address-map-form.html',
  styleUrls: ['./address-map-form.css']
})
export class AddressMapFormComponent implements OnInit {
  @Input() parentForm!: FormGroup;

  addressSearch = new FormControl('');
  mapProvider = new FormControl<'Google' | 'Nominatim'>('Google'); // Toggle for map provider

  // Google Maps properties
  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 }; // Default to Paris
  zoom = 10;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  markerPosition: google.maps.LatLngLiteral | undefined;

  constructor(private snackBar: MatSnackBar, private geocodingService: GeocodingService) { } // Inject GeocodingService

  get formGroup(): FormGroup {
    return this.parentForm;
  }

  ngOnInit(): void {
    // Initialize map center and marker if parentForm has lat/lng
    const lat = this.parentForm.get('address.latitude')?.value;
    const lng = this.parentForm.get('address.longitude')?.value;
    if (lat && lng && lat !== 0 && lng !== 0) {
      this.center = { lat, lng };
      this.markerPosition = { lat, lng };
      this.zoom = 15;
    }

    this.addressSearch.valueChanges.subscribe(address => {
      if (address && address.length > 3) {
        this.geocodeAddress(address);
      }
    });

    // Listen to map provider changes
    this.mapProvider.valueChanges.subscribe(provider => {
      if (provider === 'Nominatim') {
        this.snackBar.open('OpenStreetMap (Leaflet) integration requires Leaflet library. Please install it manually.', 'Dismiss', { duration: 5000 });
      }
      // Re-geocode current address if provider changes
      if (this.addressSearch.value) {
        this.geocodeAddress(this.addressSearch.value);
      }
    });
  }

  mapClicked(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.updateFormCoordinates(this.markerPosition);
      this.reverseGeocodeCoordinates(this.markerPosition);
    }
  }

  markerDragged(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.updateFormCoordinates(this.markerPosition);
      this.reverseGeocodeCoordinates(this.markerPosition);
    }
  }

  private updateFormCoordinates(coords: { lat: number; lng: number }): void {
    this.parentForm.patchValue({
      address: {
        latitude: coords.lat,
        longitude: coords.lng
      }
    });
  }

  private geocodeAddress(address: string): void {
    this.geocodingService.searchAddress(address, this.mapProvider.value || 'Google').subscribe({
      next: (results) => {
        if (results && results.length > 0) {
          const firstResult = results[0];
          this.center = { lat: firstResult.lat, lng: firstResult.lng };
          this.markerPosition = { lat: firstResult.lat, lng: firstResult.lng };
          this.zoom = 15;
          this.updateFormCoordinates(firstResult);
          this.parentForm.patchValue({ address: firstResult.address });
        } else {
          this.snackBar.open('Address not found.', 'Dismiss', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Geocoding error:', err);
        this.snackBar.open('Error during geocoding.', 'Dismiss', { duration: 3000 });
      }
    });
  }

  private reverseGeocodeCoordinates(coords: { lat: number; lng: number }): void {
    this.geocodingService.reverseGeocode(coords.lat, coords.lng, this.mapProvider.value || 'Google').subscribe({
      next: (result) => {
        if (result) {
          this.parentForm.patchValue({ address: result.address });
          this.snackBar.open('Address updated from map location.', 'Dismiss', { duration: 3000 });
        } else {
          this.snackBar.open('Could not reverse geocode location.', 'Dismiss', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Reverse geocoding error:', err);
        this.snackBar.open('Error during reverse geocoding.', 'Dismiss', { duration: 3000 });
      }
    });
  }
}
