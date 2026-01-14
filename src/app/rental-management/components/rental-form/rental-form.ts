import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
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
  templateUrl: './rental-form.html',
  styleUrls: ['./rental-form.css']
})
export class RentalForm implements OnInit {
  @Input() formGroup!: FormGroup; // The main form group passed from parent
  @Output() formReady = new EventEmitter<FormGroup>(); // Emits the constructed form group
  @Output() filesSelected = new EventEmitter<File[]>(); // Emits selected files

  selectedFiles: File[] = []; // Local state for selected files

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    // Initialize the form structure if it's not already provided (e.g., for testing)
    // In production, this.formGroup will be provided by LocationShellComponent
    if (!this.formGroup) {
      this.formGroup = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        locationType: ['', Validators.required],
        capacity: [1, [Validators.required, Validators.min(1)]],
        bedrooms: [1, [Validators.required, Validators.min(1)]],
        beds: [1, [Validators.required, Validators.min(1)]],
        bathrooms: [1, [Validators.required, Validators.min(1)]],
        
        address: this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zipCode: ['', Validators.required],
          country: ['', Validators.required],
          latitude: [0, Validators.required],
          longitude: [0, Validators.required],
        }),

        highlights: this.fb.array([]),

        amenities: this.fb.group({
          wifi: [false],
          tv: [false],
          kitchen: [false],
          airConditioning: [false],
          pool: [false],
          freeParking: [false],
          petFriendly: [false],
        }),
        bookingDetails: this.fb.group({
          minNights: [1, Validators.min(1)],
          maxNights: [30, Validators.min(1)],
          cleaningFee: [0, Validators.min(0)],
          serviceFee: [0, Validators.min(0)],
          taxRate: [0, [Validators.min(0), Validators.max(100)]],
          cancellationPolicy: ['flexible', Validators.required],
        }),

        basePrice: [0, [Validators.required, Validators.min(0)]],
        currency: ['USD', Validators.required],
        availability: this.fb.array([]),
      });
    }
    this.formReady.emit(this.formGroup);
  }

  get highlights(): FormArray {
    return this.formGroup.get('highlights') as FormArray;
  }

  get availability(): FormArray {
    return this.formGroup.get('availability') as FormArray;
  }

  get addressFormGroup(): FormGroup {
    return this.formGroup.get('address') as FormGroup;
  }

  addHighlight(): void {
    this.highlights.push(this.fb.group({
      title: ['', Validators.required],
      icon: ['']
    }));
  }

  removeHighlight(index: number): void {
    this.highlights.removeAt(index);
  }

  addAvailabilityPeriod(): void {
    this.availability.push(this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      priceBase: [this.formGroup.get('basePrice')?.value || 0, Validators.required],
      promoRate: [null]
    }));
  }

  removeAvailabilityPeriod(index: number): void {
    this.availability.removeAt(index);
  }

  onFilesSelected(files: File[]): void {
    this.selectedFiles = files;
    this.filesSelected.emit(this.selectedFiles); // Emit to parent
  }
}

