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
  isQuietZone?: boolean;
  amenities?: string[];
  priceRuleType?: 'SEASONAL' | 'EARLY_BIRD' | 'long_term';
}