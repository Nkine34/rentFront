import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatSnackBar } from '@angular/material/snack-bar';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { LLocationPhoto } from '../../models/rental.models';
import { RentalApiService } from '../../services/rental-api'; // Import RentalApiService

@Component({
  selector: 'app-photos-highlights-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './photos-highlights-form.html',
  styleUrls: ['./photos-highlights-form.css']
})
export class PhotosHighlightsFormComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() rentalId: string | null = null; // Input to receive the rental ID
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() photoDeleted = new EventEmitter<string>(); // Emits ID of deleted photo

  selectedFiles: File[] = [];
  previews: string[] = [];

  existingPhotos: LLocationPhoto[] = [];

  readonly MAX_FILES = 10;
  readonly MAX_FILE_SIZE_MB = 5;
  readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private rentalApiService: RentalApiService) {} // Inject RentalApiService

  ngOnInit(): void {
    const photosControl = this.formGroup.get('photos');
    if (photosControl && photosControl.value) {
      this.existingPhotos = photosControl.value;
    }
  }

  get highlights(): FormArray {
    return this.formGroup.get('highlights') as FormArray;
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

  onFileSelect(event: Event | DragEvent): void {
    let files: FileList | null = null;

    if (event instanceof DragEvent && event.dataTransfer) {
      files = event.dataTransfer.files;
    } else if (event instanceof Event && event.target instanceof HTMLInputElement) {
      files = event.target.files;
    }

    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    let validationError = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
        this.snackBar.open(`Invalid file type: ${file.name}. Only JPG, PNG, GIF are allowed.`, 'Dismiss', { duration: 5000 });
        validationError = true;
        continue;
      }

      if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
        this.snackBar.open(`File too large: ${file.name}. Max size is ${this.MAX_FILE_SIZE_MB}MB.`, 'Dismiss', { duration: 5000 });
        validationError = true;
        continue;
      }

      newFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        newPreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    if (this.selectedFiles.length + newFiles.length + this.existingPhotos.length > this.MAX_FILES) {
      this.snackBar.open(`Too many files. You can upload a maximum of ${this.MAX_FILES} photos.`, 'Dismiss', { duration: 5000 });
      validationError = true;
      return;
    }

    if (!validationError) {
      this.selectedFiles.push(...newFiles);
      this.previews.push(...newPreviews);
      this.filesSelected.emit(this.selectedFiles);
    }
  }

  removeNewFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previews.splice(index, 1);
    this.filesSelected.emit(this.selectedFiles);
  }

  removeExistingPhoto(photoId: string, index: number): void {
    if (!this.rentalId) {
      this.snackBar.open('Cannot delete photo: Rental ID is missing.', 'Dismiss', { duration: 3000 });
      return;
    }

    this.rentalApiService.deletePhoto(this.rentalId, photoId).subscribe({
      next: () => {
        this.existingPhotos.splice(index, 1);
        this.snackBar.open('Photo deleted successfully!', 'Dismiss', { duration: 3000 });
        this.photoDeleted.emit(photoId); // Notify parent
      },
      error: (err: any) => {
        console.error('Error deleting photo:', err);
        this.snackBar.open('Failed to delete photo.', 'Dismiss', { duration: 3000 });
      }
    });
  }
}

