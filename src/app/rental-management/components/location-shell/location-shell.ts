import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

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
import { MatChipsModule } from '@angular/material/chips'; // Import MatChipsModule

// Feature Components
import { RentalForm } from '../rental-form/rental-form';
import { RentalApiService } from '../../services/rental-api';
import { LLocation } from '../../models/rental.models';

type SaveState = 'draft' | 'published' | 'unsaved' | 'error';

@Component({
  selector: 'app-location-shell',
  standalone: true,
  imports: [
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
    RentalForm
],
  templateUrl: './location-shell.html',
  styleUrls: ['./location-shell.css']
})
export class LocationShellComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;

  isEditMode = false;
  rentalId: string | null = null;
  formTitle = 'Create New Rental';
  rentalForm!: FormGroup;
  selectedFiles: File[] = [];
  loading = false;
  saveState: SaveState = 'unsaved'; // Initial save state

  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';
  private breakpointSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private rentalApiService: RentalApiService,
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
  }

  ngOnInit(): void {
    this.rentalId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.rentalId;
    if (this.isEditMode) {
      this.formTitle = 'Edit Rental';
    }
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }

  onRentalFormReady(form: FormGroup): void {
    this.rentalForm = form;

    // Subscribe to form changes to update save state
    this.rentalForm.valueChanges.subscribe(() => {
      if (this.saveState !== 'published') { // Don't change from published unless explicitly saved again
        this.saveState = 'unsaved';
      }
    });

    if (this.isEditMode && this.rentalId) {
      this.loading = true;
      this.rentalApiService.getRental(this.rentalId)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (rentalData: LLocation) => {
            this.rentalForm.patchValue(rentalData);
            this.saveState = 'published'; // Assuming fetched data is published or last saved state

            const highlights = this.rentalForm.get('highlights') as FormArray;
            highlights.clear();
            rentalData.highlights.forEach(highlight => {
              highlights.push(this.fb.group(highlight));
            });

            const availability = this.rentalForm.get('availability') as FormArray;
            availability.clear();
            rentalData.availability.forEach(period => {
              availability.push(this.fb.group(period));
            });
          },
          error: (err: any) => {
            console.error('Error fetching rental:', err);
            this.snackBar.open('Error loading rental data.', 'Dismiss', { duration: 3000 });
            this.saveState = 'error';
          }
        });
    }
  }

  onFilesSelected(files: File[]): void {
    this.selectedFiles = files;
    if (this.saveState !== 'published') {
      this.saveState = 'unsaved';
    }
  }

  onPhotoDeleted(photoId: string): void {
    // When a photo is deleted, mark the form as unsaved
    if (this.saveState !== 'published') {
      this.saveState = 'unsaved';
    }
    // Optionally, you might want to trigger a saveDraft here or update the form's photos array
    // For now, the PhotosHighlightsFormComponent handles the actual deletion from backend.
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

    this.loading = true;
    const payload: LLocation = this.rentalForm.value;
    let rentalObservable: Observable<LLocation>;

    if (this.isEditMode && this.rentalId) {
      rentalObservable = this.rentalApiService.updateRental(this.rentalId, payload);
    } else {
      // For a new draft, create the rental first
      rentalObservable = this.rentalApiService.createRental(payload);
    }

    rentalObservable
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response: LLocation) => {
          console.log('Draft saved!', response);
          this.snackBar.open('Draft saved successfully!', 'Dismiss', { duration: 3000 });
          this.saveState = 'draft';
          // If it was a new draft, update rentalId and switch to edit mode
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
    // TODO: Implement preview logic
  }

  publish(): void {
    if (this.rentalForm.valid) {
      this.loading = true;
      const payload: LLocation = this.rentalForm.value;
      let rentalObservable: Observable<LLocation>;

      if (this.isEditMode && this.rentalId) {
        rentalObservable = this.rentalApiService.updateRental(this.rentalId, payload);
      } else {
        rentalObservable = this.rentalApiService.createRental(payload);
      }

      rentalObservable
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (response: LLocation) => {
            console.log('Rental saved successfully:', response);
            const savedRentalId = response.id!;
            this.snackBar.open('Rental published successfully!', 'Dismiss', { duration: 3000 });
            this.saveState = 'published';

            if (this.selectedFiles.length > 0) {
              this.loading = true;
              this.rentalApiService.uploadPhotos(savedRentalId, this.selectedFiles)
                .pipe(finalize(() => this.loading = false))
                .subscribe({
                  next: (photoResponse: any) => {
                    console.log('Photos uploaded successfully:', photoResponse);
                    this.snackBar.open('Photos uploaded!', 'Dismiss', { duration: 3000 });
                    this.router.navigate(['/host/rentals', savedRentalId, 'edit']);
                  },
                  error: (photoErr: any) => {
                    console.error('Error uploading photos:', photoErr);
                    this.snackBar.open('Error uploading photos.', 'Dismiss', { duration: 3000 });
                    this.saveState = 'error';
                  }
                });
            } else {
              this.router.navigate(['/host/rentals', savedRentalId, 'edit']);
            }
          },
          error: (err: any) => {
            console.error('Error saving rental:', err);
            this.snackBar.open('Error publishing rental.', 'Dismiss', { duration: 3000 });
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

