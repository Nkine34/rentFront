import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { SearchBarComponent } from './rentals/search/search-bar.component';
import { LocationStore } from './rentals/state/location.store';
import { SearchCriteria } from './rentals/models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatIconModule, MatMenuModule, MatButtonModule, SearchBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('rant-room');
  private readonly store = inject(LocationStore);
  private readonly router = inject(Router);

  handleSearch(criteria: SearchCriteria): void {
    this.store.searchLocations(criteria);
    // Si on n'est pas déjà sur la page de recherche, on y va
    if (this.router.url !== '/search') {
      this.router.navigate(['/search']);
    }
  }
}
