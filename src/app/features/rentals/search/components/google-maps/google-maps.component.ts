import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
    selector: 'app-google-maps',
    standalone: true,
    imports: [CommonModule /*, GoogleMap, MapMarker */],
    template: `
    <div class="google-map-container">
        <!-- 
            NOTE: Google Maps API Key is missing.
            To enable this component:
            1. Add your API key to index.html or environment.ts
            2. Uncomment the google-map tag below
         -->
        <!--
        <google-map 
            height="100%" 
            width="100%" 
            [center]="center" 
            [zoom]="zoom">
            @for (marker of markers; track marker.title) {
                <map-marker 
                    [position]="marker.position" 
                    [title]="marker.title">
                </map-marker>
            }
        </google-map>
        -->
        <div class="placeholder-message">
            <p>Google Maps Component is prepared but inactive (Missing API Key).</p>
        </div>
    </div>
  `,
    styles: [`
    .google-map-container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
        border-radius: 12px;
        overflow: hidden;
    }
    .placeholder-message {
        color: #777;
        font-size: 0.9rem;
    }
  `]
})
export class GoogleMapsComponent {
    @Input() locations: any[] = [];

    center: google.maps.LatLngLiteral = { lat: 46.603354, lng: 1.888334 }; // France center
    zoom = 6;
    markers: any[] = [];

    ngOnChanges(): void {
        if (this.locations && this.locations.length > 0) {
            this.updateMarkers();
        }
    }

    private updateMarkers(): void {
        this.markers = this.locations
            .filter(loc => loc.address && loc.address.latitude && loc.address.longitude) // Ensure coordinates exist
            .map(loc => ({
                position: {
                    lat: loc.address.latitude,
                    lng: loc.address.longitude
                },
                title: loc.type + ' - ' + loc.pricePerNight + '€'
            }));

        if (this.markers.length > 0) {
            this.center = this.markers[0].position;
        }
    }
}
