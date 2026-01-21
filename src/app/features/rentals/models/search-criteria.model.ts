export interface SearchCriteria {
  destination: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
  travelers: {
    adults: number;
    children: number;
    babies: number;
    pets: number;
  };
  // Advanced / Smart Filters
  minInternetSpeed?: number;
  minUploadSpeed?: number;
  isQuietZone?: boolean;
  minSoundproofingRating?: number;
  amenities?: string[];
  priceRuleType?: 'SEASONAL' | 'EARLY_BIRD' | 'long_term';
}