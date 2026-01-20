import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceDisplay',
  standalone: true, // Recommandé pour les versions modernes d'Angular
})
export class PriceDisplayPipe implements PipeTransform {
  transform(pricePerNight: number | undefined, numberOfNights?: number | null): string {
    if (typeof pricePerNight !== 'number') {
      return '';
    }

    // Formateur de devise pour un affichage propre (ex: 150 €)
    const currencyFormatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    // Cas 1: Affichage du prix total pour plusieurs nuits
    if (typeof numberOfNights === 'number' && numberOfNights > 1) {
      const totalPrice = pricePerNight * numberOfNights;
      return `${currencyFormatter.format(totalPrice)} pour ${numberOfNights} nuits`;
    }

    // Cas 2: Affichage du prix par nuit
    return `${currencyFormatter.format(pricePerNight)} / nuit`;
  }
}