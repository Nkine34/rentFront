import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';

export interface PropertyCardData {
    id: number;
    title: string;
    location: string;
    imageUrl: string;
    rating: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    pricePerMonth: number;
    badge?: 'FEATURED' | 'NEW';
    isFavorite?: boolean;
}

@Component({
    selector: 'app-property-card',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule
    ],
    templateUrl: './property-card.component.html',
    styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent {
    @Input() property!: PropertyCardData;
    @Output() viewDetails = new EventEmitter<number>();
    @Output() toggleFavorite = new EventEmitter<number>();

    onViewDetails(): void {
        this.viewDetails.emit(this.property.id);
    }

    onToggleFavorite(event: Event): void {
        event.stopPropagation();
        this.toggleFavorite.emit(this.property.id);
    }
}
