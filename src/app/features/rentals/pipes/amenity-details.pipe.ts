import { Pipe, PipeTransform } from '@angular/core';
import { Amenities } from '../models';

const AMENITY_MAP: Partial<Record<keyof Amenities, { icon: string; label: string }>> = {
  wifi: { icon: 'wifi', label: 'Wifi' },
  tv: { icon: 'tv', label: 'Télévision' },
  kitchen: { icon: 'kitchen', label: 'Cuisine' },
  washingMachine: { icon: 'local_laundry_service', label: 'Lave-linge' },
  pool: { icon: 'pool', label: 'Piscine' },
  airConditioning: { icon: 'ac_unit', label: 'Climatisation' },
  // Ajoutez les autres ici
};

@Pipe({ name: 'amenityDetails', standalone: true })
export class AmenityDetailsPipe implements PipeTransform {
  transform(key: string): { icon: string; label: string } {
    // Assert that the incoming string key is a valid key of the Amenities interface for the lookup.
    return AMENITY_MAP[key as keyof Amenities] || { icon: 'help_outline', label: key };
  }
}