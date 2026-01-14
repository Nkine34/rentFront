import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

// Google Maps Module
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-address-map-form',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    GoogleMapsModule
  ],
  templateUrl: './address-map-form.html',
  styleUrls: ['./address-map-form.css']
})
export class AddressMapFormComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  addressSearch = new FormControl('');

  // Google Maps properties
  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 }; // Default to Paris
  zoom = 10;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  markerPosition: google.maps.LatLngLiteral | undefined;

  private geocoder!: google.maps.Geocoder;

  constructor(private snackBar: MatSnackBar) {} // Inject MatSnackBar

  ngOnInit(): void {
    // Initialize Geocoder after Google Maps API is loaded
    if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
      this.geocoder = new google.maps.Geocoder();
    } else {
      // Fallback or error handling if Google Maps API is not loaded
      console.error('Google Maps API not loaded. Geocoding will not work.');
      this.snackBar.open('Google Maps API not loaded. Please check your API key and internet connection.', 'Dismiss', { duration: 5000 });
    }

    // Initialize map center and marker if formGroup has lat/lng
    const lat = this.formGroup.get('latitude')?.value;
    const lng = this.formGroup.get('longitude')?.value;
    if (lat && lng && lat !== 0 && lng !== 0) { // Check for non-zero values
      this.center = { lat, lng };
      this.markerPosition = { lat, lng };
      this.zoom = 15; // Zoom in if coordinates are already set
    }

    // Subscribe to address search changes (for geocoding)
    this.addressSearch.valueChanges.subscribe(address => {
      if (address && address.length > 3) {
        this.geocodeAddress(address);
      }
    });
  }

  // Handle map clicks to place marker
  mapClicked(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.updateFormCoordinates(this.markerPosition);
      this.reverseGeocodeCoordinates(this.markerPosition);
    }
  }

  // Handle marker drag end to update coordinates
  markerDragged(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.updateFormCoordinates(this.markerPosition);
      this.reverseGeocodeCoordinates(this.markerPosition);
    }
  }

  // Update form group with new latitude and longitude
  private updateFormCoordinates(coords: google.maps.LatLngLiteral): void {
    this.formGroup.patchValue({
      latitude: coords.lat,
      longitude: coords.lng
    });
  }

  // Geocode address using Google Maps Geocoding API
  private geocodeAddress(address: string): void {
    if (!this.geocoder) {
      this.snackBar.open('Geocoder not initialized. Google Maps API might not be loaded.', 'Dismiss', { duration: 5000 });
      return;
    }

    this.geocoder.geocode({ address: address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        this.center = location.toJSON();
        this.markerPosition = location.toJSON();
        this.zoom = 15; // Zoom in on the found address
        this.updateFormCoordinates(location.toJSON());

        // Update address fields from geocoding result
        const addressComponents = results[0].address_components;
        const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
        const route = addressComponents.find(c => c.types.includes('route'))?.long_name || '';
        const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
        const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
        const zipCode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';
        const country = addressComponents.find(c => c.types.includes('country'))?.long_name || '';

        this.formGroup.patchValue({
          street: `${streetNumber} ${route}`.trim(),
          city: city,
          state: state,
          zipCode: zipCode,
          country: country
        });
      } else {
        this.snackBar.open(`Geocoding failed: ${status}`, 'Dismiss', { duration: 5000 });
        console.error('Geocoding failed:', status, results);
      }
    });
  }

  // Reverse geocode coordinates using Google Maps Geocoding API
  private reverseGeocodeCoordinates(coords: google.maps.LatLngLiteral): void {
    if (!this.geocoder) {
      this.snackBar.open('Geocoder not initialized. Google Maps API might not be loaded.', 'Dismiss', { duration: 5000 });
      return;
    }

    this.geocoder.geocode({ location: coords }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const addressComponents = results[0].address_components;
        const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
        const route = addressComponents.find(c => c.types.includes('route'))?.long_name || '';
        const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
        const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
        const zipCode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';
        const country = addressComponents.find(c => c.types.includes('country'))?.long_name || '';

        this.formGroup.patchValue({
          street: `${streetNumber} ${route}`.trim(),
          city: city,
          state: state,
          zipCode: zipCode,
          country: country
        });
        this.snackBar.open('Address updated from map location.', 'Dismiss', { duration: 3000 });
      } else {
        this.snackBar.open(`Reverse geocoding failed: ${status}`, 'Dismiss', { duration: 5000 });
        console.error('Reverse geocoding failed:', status, results);
      }
    });
  }
}
