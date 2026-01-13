import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './features/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Si l'utilisateur est connecté, on le laisse passer.
    return true;
  } else {
    // Si l'utilisateur n'est pas connecté, on le redirige vers notre page de login.
    // On sauvegarde l'URL qu'il voulait visiter pour l'y rediriger après la connexion.
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};


