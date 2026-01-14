import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Import child components
import { BasicsFormComponent } from '../basics-form/basics-form';
import { AddressMapFormComponent } from '../address-map-form/address-map-form';
import { PhotosHighlightsFormComponent } from '../photos-highlights-form/photos-highlights-form';
import { DetailsFormComponent } from '../details-form/details-form';
import { PricingAvailabilityFormComponent } from '../pricing-availability-form/pricing-availability-form';

@Component({
  selector: 'app-rental-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicsFormComponent,
    AddressMapFormComponent,
    PhotosHighlightsFormComponent,
    DetailsFormComponent,
    PricingAvailabilityFormComponent
  ],
  template: `
    <div [formGroup]="parentForm">
      <app-basics-form [parentForm]="parentForm"></app-basics-form>
      <app-address-map-form [parentForm]="parentForm"></app-address-map-form>
      <app-photos-highlights-form [parentForm]="parentForm"></app-photos-highlights-form>
      <app-details-form [parentForm]="parentForm"></app-details-form>
      <app-pricing-availability-form [parentForm]="parentForm"></app-pricing-availability-form>
    </div>
  `
})
export class RentalForm implements OnInit {
  @Input() parentForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
