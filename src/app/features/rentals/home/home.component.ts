
import { Router } from '@angular/router';
import { LocationListComponent } from '../locations/location-list.component';
import { LocationStore } from '../state/location.store';
import { ChangeDetectionStrategy, Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LocationListComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule
  ]
})
export class HomeComponent implements OnInit {
  protected readonly store = inject(LocationStore);
  private readonly router = inject(Router);

  // Expose Object to template
  protected readonly Object = Object;

  // Computed signals for categorized listings
  protected readonly trendingLocations = computed(() => {
    const locations = this.store.entities();
    // Top 6 highest rated or most recent
    return [...locations]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  });

  protected readonly topStays = computed(() => {
    const locations = this.store.entities();
    // Top 6 by total reviews
    return [...locations]
      .sort((a, b) => b.totalReviews - a.totalReviews)
      .slice(0, 6);
  });

  // Feature data
  protected readonly features = [
    {
      icon: 'verified',
      title: 'Verified Quality',
      description: 'Every home is hand-picked and inspected to the highest standards of quality and comfort.'
    },
    {
      icon: 'support_agent',
      title: 'Seamless Experience',
      description: 'Automated check-ins and high-speed Wi-Fi integrated into every property for digital nomads.'
    },
    {
      icon: '24mp',
      title: '24/7 Concierge',
      description: 'Our dedicated local support team is available whenever you need us, for anything you need.'
    }
  ];

  ngOnInit(): void {
    this.store.loadLocations();
  }

  navigateToDetails(id: number): void {
    console.log(`HomeComponent: Navigation vers les détails de l'annonce ID: ${id}`);
    this.router.navigate(['/details', id]);
  }

  scrollLeft(container: HTMLElement): void {
    container.scrollBy({ left: -350, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement): void {
    container.scrollBy({ left: 350, behavior: 'smooth' });
  }
}
