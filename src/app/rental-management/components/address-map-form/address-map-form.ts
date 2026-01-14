import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Google Maps Module
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-address-map-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    GoogleMapsModule // Corrected to GoogleMapsModule
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

  ngOnInit(): void {
    // Initialize map center and marker if formGroup has lat/lng
    const lat = this.formGroup.get('latitude')?.value;
    const lng = this.formGroup.get('longitude')?.value;
    if (lat && lng) {
      this.center = { lat, lng };
      this.markerPosition = { lat, lng };
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

  // Geocode address (simulated or using a service)
  private geocodeAddress(address: string): void {
    // In a real application, you would use Google Maps Geocoding API
    // For now, a simple simulation:
    console.log('Geocoding address:', address);
    // Simulate API call
    setTimeout(() => {
      const simulatedCoords = { lat: 48.8566 + Math.random() * 0.1, lng: 2.3522 + Math.random() * 0.1 };
      this.center = simulatedCoords;
      this.markerPosition = simulatedCoords;
      this.updateFormCoordinates(simulatedCoords);
      // Also update address fields based on geocoding result
      this.formGroup.patchValue({
        street: address.split(',')[0] || '',
        city: address.split(',')[1] || '',
        // ... other address fields
      });
    }, 1000);
  }

  // Reverse geocode coordinates (simulated or using a service)
  private reverseGeocodeCoordinates(coords: google.maps.LatLngLiteral): void {
    // In a real application, you would use Google Maps Geocoding API
    // For now, a simple simulation:
    console.log('Reverse geocoding coordinates:', coords);
    setTimeout(() => {
      this.formGroup.patchValue({
        street: `Simulated Street ${Math.floor(Math.random() * 100)}`,
        city: 'Simulated City',
        state: 'Simulated State',
        zipCode: '12345',
        country: 'Simulated Country'
      });
    }, 1000);
  }
}
