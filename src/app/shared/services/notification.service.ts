import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  show(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000, // La notification disparaît après 3 secondes
    });
  }
}