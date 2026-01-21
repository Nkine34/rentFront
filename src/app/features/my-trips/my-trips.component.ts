import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ReservationService } from '../../shared/services/reservation.service';
import { ReservationListDto } from '../../shared/models/reservation.model';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewFormDialogComponent } from '../rentals/details/components/reviews/review-form-dialog.component';

@Component({
    selector: 'app-my-trips',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        RouterModule,
        MatDialogModule
    ],
    templateUrl: './my-trips.component.html',
    styleUrls: ['./my-trips.component.scss']
})
export class MyTripsComponent implements OnInit {
    private readonly reservationService = inject(ReservationService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialog = inject(MatDialog);

    reservations = signal<ReservationListDto[]>([]);
    isLoading = signal(true);

    ngOnInit() {
        this.loadReservations();
    }

    loadReservations() {
        this.isLoading.set(true);
        this.reservationService.getMyReservations().subscribe({
            next: (data) => {
                this.reservations.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading trips', err);
                this.isLoading.set(false);
            }
        });
    }

    cancelReservation(id: string) {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce voyage ?')) return;

        this.reservationService.cancelReservation(id).subscribe({
            next: () => {
                this.snackBar.open('Voyage annulé.', 'Fermer', { duration: 3000 });
                this.loadReservations(); // Refresh list
            },
            error: (err) => {
                this.snackBar.open('Erreur lors de l\'annulation.', 'Fermer', { duration: 3000 });
            }
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'CONFIRMED': return 'accent';
            case 'PENDING': return 'primary'; // mapped to warn or primary depending on theme
            case 'CANCELLED': return 'warn';
            default: return 'primary';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'CONFIRMED': return 'Confirmé';
            case 'PENDING': return 'En attente';
            case 'CANCELLED': return 'Annulé';
            case 'REJECTED': return 'Refusé';
            default: return status;
        }
    }

    leaveReview(reservation: ReservationListDto) {
        this.dialog.open(ReviewFormDialogComponent, {
            width: '500px',
            data: {
                reservationId: reservation.id,
                locationName: reservation.locationTitle
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                this.loadReservations(); // Refresh if review was added
            }
        });
    }

    canReview(reservation: ReservationListDto): boolean {
        const today = new Date();
        const endDate = new Date(reservation.endDate);
        return reservation.status === 'CONFIRMED' && endDate < today;
    }
}
