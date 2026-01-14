// src/app/app.config.ts → VERSION COMPLÈTE
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, APP_INITIALIZER, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { KeycloakService } from 'keycloak-angular';
import { authInterceptor } from './features/auth/auth.interceptor';
import { AuthService } from './features/auth/auth.service';
import { importProvidersFrom } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { GoogleMapsModule } from '@angular/google-maps';

export function initializeApp(authService: AuthService) {
  return (): Promise<any> => authService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    // ✅ CARTES GLOBALES (dispo partout !)
    importProvidersFrom(LeafletModule, GoogleMapsModule),

    KeycloakService,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService],
    },
  ]
};
