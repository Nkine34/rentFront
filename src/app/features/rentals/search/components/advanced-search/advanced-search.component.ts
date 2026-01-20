import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { SearchCriteria } from '../../../models';

type Profile = 'DIGITAL_NOMAD' | 'FAMILY' | 'QUIET' | 'SMART_SAVER';

@Component({
    selector: 'app-advanced-search',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatChipsModule,
        FormsModule
    ],
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent {
    selectedProfile = signal<Profile>('DIGITAL_NOMAD');

    // Smart Filter States
    minInternetSpeed = 0;
    isQuietZone = false;
    requireErgonomicChair = false;
    requireCrib = false;
    requireBathtub = false;

    constructor(public dialogRef: MatDialogRef<AdvancedSearchComponent>) { }

    selectProfile(profile: Profile): void {
        this.selectedProfile.set(profile);
        this.applyProfilePresets(profile);
    }

    applyProfilePresets(profile: Profile): void {
        // Reset all first
        this.minInternetSpeed = 0;
        this.isQuietZone = false;
        this.requireErgonomicChair = false;
        this.requireCrib = false;
        this.requireBathtub = false;

        switch (profile) {
            case 'DIGITAL_NOMAD':
                this.minInternetSpeed = 100;
                this.requireErgonomicChair = true;
                break;
            case 'QUIET':
                this.isQuietZone = true;
                break;
            case 'FAMILY':
                this.requireCrib = true;
                this.requireBathtub = true;
                break;
            case 'SMART_SAVER':
                // Logic for deals could be handled in backend, here we just might set a flag or leave defaults
                break;
        }
    }

    applyFilters(): void {
        const amenities: string[] = [];
        if (this.requireErgonomicChair) amenities.push('ergonomic_chair');
        if (this.requireCrib) amenities.push('crib');
        if (this.requireBathtub) amenities.push('bathtub');

        const criteria: Partial<SearchCriteria> = {
            minInternetSpeed: this.minInternetSpeed > 0 ? this.minInternetSpeed : undefined,
            isQuietZone: this.isQuietZone ? true : undefined,
            amenities: amenities.length > 0 ? amenities : undefined,
            priceRuleType: this.selectedProfile() === 'SMART_SAVER' ? 'SEASONAL' : undefined // Simplified logic
        };

        this.dialogRef.close(criteria);
    }

    formatSpeedLabel(value: number): string {
        return `${value} Mbps`;
    }
}
