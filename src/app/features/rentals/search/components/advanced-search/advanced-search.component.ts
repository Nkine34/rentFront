import { Component, ChangeDetectionStrategy, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { SearchCriteria } from '../../../models';

@Component({
    selector: 'app-advanced-search',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatDividerModule,
        FormsModule
    ],
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedSearchComponent {

    // Section 1: 🚀 Performance & Télétravail
    minDownloadSpeed = 0;
    minUploadSpeed = 0;
    hasErgonomicChair = false;

    // Section 2: 👨‍👩‍👧‍👦 Famille & Confort
    hasCrib = false;
    hasBathtub = false;
    hasKitchen = false;

    // Section 3: 🌙 Silence & Sérénité
    isQuietZone = false;
    minSoundproofingRating = 0; // 0 means any, 4+ is high

    // Section 4: 💎 Offres & Durée
    wantsLongTermDeal = false; // > 30% discount
    wantsSeasonalOffer = false;

    constructor(
        public dialogRef: MatDialogRef<AdvancedSearchComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Partial<SearchCriteria>
    ) {
        if (data) {
            // Restore state from passed data
            this.minDownloadSpeed = data.minInternetSpeed || 0;
            this.minUploadSpeed = data.minUploadSpeed || 0;
            this.hasErgonomicChair = data.amenities?.includes('ergonomic_chair') || false;

            this.hasCrib = data.amenities?.includes('crib') || false;
            this.hasBathtub = data.amenities?.includes('bathtub') || false;
            this.hasKitchen = data.amenities?.includes('kitchen') || false;

            this.isQuietZone = data.isQuietZone || false;
            this.minSoundproofingRating = data.minSoundproofingRating || 0;

            this.wantsSeasonalOffer = data.priceRuleType === 'SEASONAL';
            this.wantsLongTermDeal = data.priceRuleType === 'long_term';
        }
    }

    applyFilters(): void {
        const amenities: string[] = [];
        if (this.hasErgonomicChair) amenities.push('ergonomic_chair');
        if (this.hasCrib) amenities.push('crib');
        if (this.hasBathtub) amenities.push('bathtub');
        if (this.hasKitchen) amenities.push('kitchen');

        const criteria: Partial<SearchCriteria> = {
            // Work
            minInternetSpeed: this.minDownloadSpeed > 0 ? this.minDownloadSpeed : undefined,
            minUploadSpeed: this.minUploadSpeed > 0 ? this.minUploadSpeed : undefined,

            // Quiet
            isQuietZone: this.isQuietZone ? true : undefined,
            minSoundproofingRating: this.minSoundproofingRating > 0 ? this.minSoundproofingRating : undefined,

            // Amenities (Family + Work)
            amenities: amenities.length > 0 ? amenities : undefined,

            // Deals
            // We map these boolean toggles to the enum expected by backend/model
            priceRuleType: this.wantsSeasonalOffer ? 'SEASONAL' : (this.wantsLongTermDeal ? 'long_term' : undefined)
        };

        this.dialogRef.close(criteria);
    }

    formatSpeedLabel(value: number): string {
        return `${value} Mb`;
    }
}
