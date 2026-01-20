import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SearchBarComponent } from './features/rentals/search/search-bar.component';
import { LocationStore } from './features/rentals/state/location.store';
import { SearchCriteria } from './features/rentals/models';
import { AuthService } from './features/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatSidenavModule,
    SearchBarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly store = inject(LocationStore);
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);

  // Dark mode state
  isDarkMode = false;
  private autoCloseTimer: any;

  constructor() { }

  handleSearch(criteria: SearchCriteria): void {
    this.store.searchLocations(criteria);
    if (this.router.url !== '/search') {
      this.router.navigate(['/search']);
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    // TODO: Implement dark mode theme switching
    console.log('Dark mode:', this.isDarkMode);
  }

  toggleDrawer(drawer: any): void {
    // If closing, clear timer
    if (drawer.opened) {
      this.clearTimer();
      drawer.close();
      return;
    }

    // Opening
    drawer.open();
    this.startTimer(drawer);
  }

  startTimer(drawer: any): void {
    this.clearTimer();
    this.autoCloseTimer = setTimeout(() => {
      drawer.close();
    }, 5000);
  }

  clearTimer(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  onDrawerMouseEnter(): void {
    this.clearTimer();
  }

  onDrawerMouseLeave(drawer: any): void {
    // Only restart timer if drawer is open
    if (drawer.opened) {
      this.startTimer(drawer);
    }
  }
}
