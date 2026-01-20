import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ReservationService } from '../../../shared/services/reservation.service';
import { ReservationListDto } from '../../../shared/models/reservation.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-host-reservations',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        DatePipe,
        CurrencyPipe
    ],
    templateUrl: './host-reservations.component.html',
    styleUrls: ['./host-reservations.component.scss']
})
export class HostReservationsComponent implements OnInit {
    private readonly reservationService = inject(ReservationService);
    private readonly snackBar = inject(MatSnackBar);

    reservations = signal<ReservationListDto[]>([]);
    isLoading = signal(true);
    error = signal<string | null>(null);

    ngOnInit() {
        this.loadIncomingReservations();
    }

    loadIncomingReservations() {
        this.isLoading.set(true);
        this.reservationService.getIncomingReservations().subscribe({
            next: (data: ReservationListDto[]) => {
                this.reservations.set(data);
                this.isLoading.set(false);
            },
            error: (err: any) => {
                console.error('Error loading host reservations', err);
                this.error.set('Impossible de charger les réservations entrantes (Endpoint manquant ?)');
                this.isLoading.set(false);
            }
        });
    }

    updateStatus(id: string, status: 'CONFIRMED' | 'REJECTED') {
        this.reservationService.updateStatus(id, status).subscribe({
            next: () => {
                this.snackBar.open(`Réservation ${status === 'CONFIRMED' ? 'confirmée' : 'refusée'}.`, 'Fermer', { duration: 3000 });
                this.loadIncomingReservations();
            },
            error: () => {
                this.snackBar.open('Erreur lors de la mise à jour.', 'Fermer', { duration: 3000 });
            }
        });
    }

    get pendingReservations() {
        return this.reservations().filter(r => r.status === 'PENDING');
    }

    get upcomingReservations() {
        return this.reservations().filter(r => r.status === 'CONFIRMED');
    }

    get pastReservations() {
        return this.reservations().filter(r => r.status === 'CANCELLED' || r.status === 'REJECTED'); // Simplified logic
    }
}
