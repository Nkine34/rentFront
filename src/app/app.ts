import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SearchBarComponent } from './rentals/search/search-bar.component';
import { LocationStore } from './rentals/state/location.store';
import { SearchCriteria } from './rentals/models';
import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    SearchBarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly store = inject(LocationStore);
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);

  // ngOnInit est maintenant vide, l'initialisation est gérée par APP_INITIALIZER
  constructor() {}

  handleSearch(criteria: SearchCriteria): void {
    this.store.searchLocations(criteria);
    if (this.router.url !== '/search') {
      this.router.navigate(['/search']);
    }
  }
}
