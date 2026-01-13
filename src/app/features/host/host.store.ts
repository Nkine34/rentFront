import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Host } from './host.model';

@Injectable({ providedIn: 'root' })
export class HostStore {
  private readonly _host = signal<Host | null>(null);
  readonly host = this._host.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {}

  loadCurrentHost(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Host>('/api/hosts/me').subscribe({
      next: host => {
        this._host.set(host);
        this._loading.set(false);
      },
      error: err => {
        // 404/204 => pas host, les autres erreurs => erreur réelle
        if (err.status === 404 || err.status === 204) {
          this._host.set(null);
          this._loading.set(false);
        } else {
          this._error.set('Impossible de charger le profil hôte.');
          this._loading.set(false);
        }
      }
    });
  }

  becomeHost(payload?: { displayName?: string; photoUrl?: string }): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.post<Host>('/api/hosts', payload ?? {}).subscribe({
      next: host => {
        this._host.set(host);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Impossible de devenir hôte.');
        this._loading.set(false);
      }
    });
  }

  updateHostProfile(update: { name?: string; photo?: string | null }): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.patch<Host>('/api/hosts/me', update).subscribe({
      next: host => {
        this._host.set(host);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Impossible de mettre à jour le profil hôte.');
        this._loading.set(false);
      }
    });
  }
}
