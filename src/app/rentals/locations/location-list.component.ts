import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Location} from '../models';
import {NightsPipe} from '../pipes/nights.pipe';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, DatePipe } from '@angular/common';
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
    NightsPipe,
    ScrollingModule
  ],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationListComponent {
  @Input() groupedLocations: { [key: string]: Location[] } | null = {};
  @Output() detailsClick = new EventEmitter<number>();
  private notificationService = inject(NotificationService);

  objectKeys = Object.keys;

  trackById(index: number, item: Location): number {
    return item.id;
  }

  onDetailsClick(id: number): void {
    this.detailsClick.emit(id);
  }

  showGps(location: Location, event: MouseEvent): void {
    event.stopPropagation();
    if (location.address.latitude && location.address.longitude) {
      this.notificationService.show(`GPS: ${location.address.latitude}, ${location.address.longitude}`);
    } else {
      this.notificationService.show('Coordonnées GPS non disponibles.');
    }
  }
}
