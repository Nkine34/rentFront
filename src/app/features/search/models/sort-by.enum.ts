/**
 * Sort options for location search results.
 * Must match backend SortBy enum.
 */
export enum SortBy {
  RELEVANCE = 'RELEVANCE',
  PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
  PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
  RATING = 'RATING',
  NEWEST = 'NEWEST'
}
