import { Component, Input, OnInit, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReviewDto } from '../../../../../shared/models/review.model';
import { ReviewService } from '../../../../../shared/services/review.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-review-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    templateUrl: './review-list.component.html',
    styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
    @Input() locationId!: number;
    reviews$: Observable<ReviewDto[]> | undefined;

    constructor(private reviewService: ReviewService) { }

    ngOnInit(): void {
        if (this.locationId) {
            this.reviews$ = this.reviewService.getReviewsForLocation(this.locationId);
        }
    }

    getStars(rating: number): number[] {
        return Array(5).fill(0).map((x, i) => i < rating ? 1 : 0);
    }
}

