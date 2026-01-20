import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SearchBarComponent } from './rentals/search/search-bar.component';
import { LocationStore } from './rentals/state/location.store';
import { SearchCriteria } from './rentals/models';
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
    // Clear existing timer if any
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }

    // Toggle drawer
    drawer.toggle();

    // If drawer is now open, set auto-close timer for 5 seconds
    if (drawer.opened) {
      this.autoCloseTimer = setTimeout(() => {
        drawer.close();
        this.autoCloseTimer = null;
      }, 5000);
    }
  }
}
