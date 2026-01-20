export interface Address {
  country: string;
  countryCode: string;
  buildingInfo?: string; // Optional: Bâtiment, étage, etc.
  buildingName?: string; // Optional: Nom de la résidence
  street: string; // Numéro et libellé de voie
  postalCode: string;
  city: string;
  latitude?: number;
  longitude?: number;
}
