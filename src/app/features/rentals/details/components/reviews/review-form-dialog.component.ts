import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../../../../shared/services/review.service';
import { CreateReviewDto } from '../../../../../shared/models/review.model';

@Component({
    selector: 'app-review-form-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './review-form-dialog.component.html',
    styleUrls: ['./review-form-dialog.component.scss']
})
export class ReviewFormDialogComponent {
    reviewForm: FormGroup;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private reviewService: ReviewService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<ReviewFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { reservationId: string, locationName: string }
    ) {
        this.reviewForm = this.fb.group({
            overallRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
            comment: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    setRating(rating: number): void {
        this.reviewForm.patchValue({ overallRating: rating });
    }

    onSubmit(): void {
        if (this.reviewForm.valid) {
            this.isSubmitting = true;
            const reviewDto: CreateReviewDto = this.reviewForm.value;

            this.reviewService.createReview(this.data.reservationId, reviewDto).subscribe({
                next: () => {
                    this.snackBar.open('Merci pour votre avis !', 'Fermer', { duration: 3000 });
                    this.dialogRef.close(true);
                },
                error: (err: any) => {
                    console.error('Error creating review', err);
                    this.snackBar.open('Erreur lors de l\'envoi de l\'avis', 'Fermer', { duration: 3000 });
                    this.isSubmitting = false;
                }
            });
        }
    }
}
