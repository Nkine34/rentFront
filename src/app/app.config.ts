import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, APP_INITIALIZER, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { KeycloakService } from 'keycloak-angular';
import { authInterceptor } from './features/auth/auth.interceptor';
import { AuthService } from './features/auth/auth.service';

// Fonction qui sera exécutée au démarrage de l'application
export function initializeApp(authService: AuthService) {
  return (): Promise<any> => {
    return authService.init();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    KeycloakService,
    AuthService, // On s'assure que le service est bien fourni
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService], // On injecte AuthService dans notre fonction
    },
  ]
};
