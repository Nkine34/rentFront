import { Component, Input, OnChanges, AfterViewInit, OnDestroy, SimpleChanges, ElementRef, ViewChild, Inject, PLATFORM_ID, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

@Component({
    selector: 'app-open-street-map',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="map-container" #mapContainer></div>
  `,
    styles: [`
    .map-container {
        height: 100%;
        width: 100%;
        z-index: 1;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenStreetMapComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() locations: any[] = [];
    @ViewChild('mapContainer') mapContainer!: ElementRef;

    private map: L.Map | undefined;
    private markers: L.Marker[] = [];
    private isBrowser: boolean;

    // Fix for default icon issues in Webpack/Angular
    private defaultIcon = L.icon({
        iconUrl: 'assets/marker-icon.png', // We might need to ensure these exist or use CDN
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);

        // Fallback if local assets are missing (common issue)
        L.Marker.prototype.options.icon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }

    ngAfterViewInit(): void {
        if (this.isBrowser) {
            this.initMap();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.map && changes['locations']) {
            this.updateMarkers();
        }
    }

    private initMap(): void {
        if (!this.mapContainer) return;

        // Default center (France)
        this.map = L.map(this.mapContainer.nativeElement).setView([46.603354, 1.888334], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.updateMarkers();
    }

    private updateMarkers(): void {
        if (!this.map) return;

        // Clear existing markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        if (!this.locations || this.locations.length === 0) return;

        const bounds = L.latLngBounds([]);

        this.locations.forEach(loc => {
            if (loc.address && loc.address.latitude && loc.address.longitude) {
                const marker = L.marker([loc.address.latitude, loc.address.longitude])
                    .bindPopup(`
            <div style="text-align: center;">
                <b>${loc.type}</b><br>
                ${loc.address.city}<br>
                <b>${loc.pricePerNight}€</b> / night
            </div>
          `);

                marker.addTo(this.map!);
                this.markers.push(marker);
                bounds.extend([loc.address.latitude, loc.address.longitude]);
            }
        });

        if (this.markers.length > 0) {
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }
}
