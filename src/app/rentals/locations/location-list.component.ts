import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NightsPipe} from '../pipes/nights.pipe';
import {Location} from '../models/location.model';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule, DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {PriceDisplayPipe} from '../pipes/price-display.pipe';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    PriceDisplayPipe,
    NightsPipe
  ],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationListComponent {
  @Input() groupedLocations: { [key: string]: Location[] } | null = {};
  @Input() listingsPerCountry: number = 4;
  @Output() detailsClick = new EventEmitter<number>();
  private notificationService = inject(NotificationService);

  objectKeys = Object.keys;

  onDetailsClick(id: number): void {
    this.detailsClick.emit(id);
  }

  showGps(location: Location, event: MouseEvent): void {
    event.stopPropagation(); // Correction cruciale pour arrêter la propagation du clic
    if (location.address.latitude && location.address.longitude) {
      this.notificationService.show(`GPS: ${location.address.latitude}, ${location.address.longitude}`);
    } else {
      this.notificationService.show('Coordonnées GPS non disponibles.');
    }
  }
}
