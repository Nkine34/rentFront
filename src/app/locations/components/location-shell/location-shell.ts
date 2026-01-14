import { Component, OnInit, ViewChild, OnDestroy, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, finalize } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

// Feature Components
import { BasicsFormComponent } from '../basics-form/basics-form';
import { AddressMapFormComponent } from '../address-map-form/address-map-form';
import { PhotosHighlightsFormComponent } from '../photos-highlights-form/photos-highlights-form';
import { DetailsFormComponent } from '../details-form/details-form';
import { PricingAvailabilityFormComponent } from '../pricing-availability-form/pricing-availability-form';

import { LocationsApiService } from '../../services/locations-api.service';
import { Location, LocationHighlight, LocationAvailabilityPeriod } from '../../models/location.interface';
import { LocationsStore } from '../../services/locations.store'; // Import LocationsStore

type SaveState = 'draft' | 'published' | 'unsaved' | 'error';

@Component({
  selector: 'app-location-shell',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    BasicsFormComponent,
    AddressMapFormComponent,
    PhotosHighlightsFormComponent,
    DetailsFormComponent,
    PricingAvailabilityFormComponent
  ],
  templateUrl: './location-shell.html',
  styleUrls: ['./location-shell.css']
})
export class LocationShellComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;

  private locationsStore = inject(LocationsStore); // Inject LocationsStore using inject()

  isEditMode = false;
  rentalId: string | null = null;
  formTitle = 'Create New Rental';
  rentalForm!: FormGroup;
  selectedFiles: File[] = [];
  // loading = false; // Managed by store
  saveState: SaveState = 'unsaved';

  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';
  private breakpointSubscription: Subscription;

  // Access store signals
  isLoading = this.locationsStore.isLoading;
  currentRental = this.locationsStore.currentRental;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private locationsApiService: LocationsApiService, // Keep for direct photo upload
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(
        map(result => result.matches)
      )
      .subscribe(matches => {
        this.stepperOrientation = matches ? 'vertical' : 'horizontal';
      });

    effect(() => {
      const rental = this.currentRental();
      if (rental && this.rentalForm) {
        this.rentalForm.patchValue(rental);
        this.saveState = 'published'; // Assuming fetched data is published or last saved state

        // Populate highlights FormArray
        const highlights = this.rentalForm.get('highlights') as FormArray;
        highlights.clear();
        if (rental.highlights) {
          rental.highlights.forEach((highlight: LocationHighlight) => {
            highlights.push(this.fb.group(highlight));
          });
        }

        // Populate availability FormArray
        const availability = this.rentalForm.get('availability') as FormArray;
        availability.clear();
        if (rental.availability) {
          rental.availability.forEach((period: LocationAvailabilityPeriod) => {
            availability.push(this.fb.group(period));
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.rentalId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.rentalId;
    if (this.isEditMode) {
      this.formTitle = 'Edit Rental';
      this.locationsStore.loadRental(this.rentalId!); // Load rental into store
    }
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
    this.locationsStore.clearCurrentRental(); // Clear store state on destroy
  }

  onRentalFormReady(form: FormGroup): void {
    this.rentalForm = form;

    // Subscribe to form changes to update save state
    this.rentalForm.valueChanges.subscribe(() => {
      if (this.saveState !== 'published') {
        this.saveState = 'unsaved';
      }
    });
  }

  onFilesSelected(files: File[]): void {
    this.selectedFiles = files;
    if (this.saveState !== 'published') {
      this.saveState = 'unsaved';
    }
  }

  onPhotoDeleted(photoId: string): void {
    if (this.saveState !== 'published') {
      this.saveState = 'unsaved';
    }
  }

  get highlights(): FormArray {
    return this.rentalForm.get('highlights') as FormArray;
  }

  get availability(): FormArray {
    return this.rentalForm.get('availability') as FormArray;
  }

  get addressFormGroup(): FormGroup {
    return this.rentalForm.get('address') as FormGroup;
  }

  get bookingDetailsFormGroup(): FormGroup {
    return this.rentalForm.get('bookingDetails') as FormGroup;
  }

  goForward(): void {
    this.stepper.next();
  }

  goBackward(): void {
    this.stepper.previous();
  }

  saveDraft(): void {
    if (!this.rentalForm) {
      this.snackBar.open('Form not initialized.', 'Dismiss', { duration: 3000 });
      return;
    }

    const payload: Location = this.rentalForm.value;
    if (this.rentalId) {
      payload.id = this.rentalId;
    }

    this.locationsStore.saveDraft(payload)
      .subscribe({
        next: (response: Location) => {
          console.log('Draft saved!', response);
          this.snackBar.open('Draft saved successfully!', 'Dismiss', { duration: 3000 });
          this.saveState = 'draft';
          if (!this.isEditMode) {
            this.rentalId = response.id!;
            this.isEditMode = true;
            this.formTitle = 'Edit Rental';
            this.router.navigate(['/host/rentals', this.rentalId, 'edit'], { replaceUrl: true });
          }
        },
        error: (err: any) => {
          console.error('Error saving draft:', err);
          this.snackBar.open('Failed to save draft.', 'Dismiss', { duration: 3000 });
          this.saveState = 'error';
        }
      });
  }

  preview(): void {
    this.snackBar.open('Opening preview...', 'Dismiss', { duration: 3000 });
    console.log('Preview clicked');
  }

  publish(): void {
    if (this.rentalForm.valid) {
      const payload: Location = this.rentalForm.value;
      if (this.rentalId) {
        payload.id = this.rentalId;
      }

      // First save/update the rental
      this.locationsStore.saveDraft(payload)
        .subscribe({
          next: (response: Location) => {
            console.log('Rental saved successfully:', response);
            const savedRentalId = response.id!;

            // Then publish it
            this.locationsStore.publishRental(savedRentalId)
              .subscribe({
                next: (publishedRental: Location) => {
                  console.log('Rental published successfully:', publishedRental);
                  this.snackBar.open('Rental published successfully!', 'Dismiss', { duration: 3000 });
                  this.saveState = 'published';

                  // Upload photos if any
                  if (this.selectedFiles.length > 0) {
                    this.locationsApiService.uploadPhotos(savedRentalId, this.selectedFiles)
                      .subscribe({
                        next: (photoResponse: any) => {
                          console.log('Photos uploaded successfully:', photoResponse);
                          this.snackBar.open('Photos uploaded!', 'Dismiss', { duration: 3000 });
                          this.router.navigate(['/']);
                        },
                        error: (photoErr: any) => {
                          console.error('Error uploading photos:', photoErr);
                          this.snackBar.open('Error uploading photos.', 'Dismiss', { duration: 3000 });
                          // Stay on page on error
                          this.saveState = 'error';
                        }
                      });
                  } else {
                    this.router.navigate(['/']);
                  }
                },
                error: (publishErr: any) => {
                  console.error('Error publishing rental:', publishErr);
                  this.snackBar.open('Error publishing rental.', 'Dismiss', { duration: 3000 });
                  this.saveState = 'error';
                }
              });
          },
          error: (err: any) => {
            console.error('Error saving rental:', err);
            this.snackBar.open('Error saving rental.', 'Dismiss', { duration: 3000 });
            this.saveState = 'error';
          }
        });

    } else {
      console.error('Form is invalid');
      this.snackBar.open('Please fill in all required fields.', 'Dismiss', { duration: 3000 });
      this.rentalForm.markAllAsTouched();
      this.saveState = 'error';
    }
  }
}
