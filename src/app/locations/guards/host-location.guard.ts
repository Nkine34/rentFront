import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

export const HostLocationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if user is a host
  const currentUser = authService.currentUser();
  if (currentUser && currentUser.isHost) {
    return true;
  }

  // User is logged in but not a host - redirect to become-host page
  router.navigate(['/host/become-host']);
  return false;
};