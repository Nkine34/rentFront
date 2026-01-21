
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SimpleSearchComponent } from '../../../features/rentals/search/components/simple-search/simple-search.component';
import { AuthService } from '../../../features/auth/auth.service';
import { LocationStore } from '../../../features/rentals/state/location.store';
import { SearchCriteria } from '../../../features/rentals/models';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        SimpleSearchComponent
    ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    authService = inject(AuthService);
    private readonly store = inject(LocationStore);
    private readonly router = inject(Router);

    @Output() menuClick = new EventEmitter<void>();

    onMenuClick() {
        this.menuClick.emit();
    }

    handleSearch(criteria: SearchCriteria) {
        this.store.searchLocations(criteria);
        if (this.router.url !== '/search') {
            this.router.navigate(['/search']);
        }
    }
}
