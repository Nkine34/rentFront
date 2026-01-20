export interface ReviewDto {
    id: number;
    authorName: string;
    overallRating: number;
    comment: string;
    createdAt: string;
}

export interface CreateReviewDto {
    overallRating: number;
    cleanlinessRating?: number;
    communicationRating?: number;
    valueRating?: number;
    comment: string;
}
