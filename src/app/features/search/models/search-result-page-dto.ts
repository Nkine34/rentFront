import { SearchResultDTO } from './search-result-dto';

/**
 * Paginated search response DTO matching backend SearchResultPageDTO.
 * Contains results and pagination metadata.
 */
export interface SearchResultPageDTO {
    results: SearchResultDTO[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    numberOfElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
    isEmpty: boolean;
}
