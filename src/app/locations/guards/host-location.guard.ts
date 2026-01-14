import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service'; // Assuming AuthService exists

export const HostLocationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // TODO: Implement actual host check (e.g., check user roles)
  // For now, just check if logged in
  if (authService.isLoggedIn()) {
    // In a real app, you'd check if the user has a 'host' role
    // For demonstration, we'll assume any logged-in user can be a host for now.
    return true;
  } else {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }
};