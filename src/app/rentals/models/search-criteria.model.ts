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
}