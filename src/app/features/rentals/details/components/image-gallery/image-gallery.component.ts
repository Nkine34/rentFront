
import { Component, EventEmitter, Input, Output, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocationPhoto } from '../../../models/location-photo.model';

@Component({
    selector: 'app-image-gallery',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './image-gallery.component.html',
    styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit, OnDestroy {
    @Input({ required: true }) photos: LocationPhoto[] = [];
    @Input() initialIndex: number = 0;
    @Output() close = new EventEmitter<void>();

    currentIndex: number = 0;

    ngOnInit(): void {
        this.currentIndex = this.initialIndex;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    ngOnDestroy(): void {
        document.body.style.overflow = ''; // Restore scrolling
    }

    get currentPhoto(): LocationPhoto | undefined {
        return this.photos[this.currentIndex];
    }

    next(): void {
        if (this.currentIndex < this.photos.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to start
        }
    }

    prev(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.photos.length - 1; // Loop to end
        }
    }

    onClose(): void {
        this.close.emit();
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'ArrowRight') {
            this.next();
        } else if (event.key === 'ArrowLeft') {
            this.prev();
        } else if (event.key === 'Escape') {
            this.onClose();
        }
    }
}
