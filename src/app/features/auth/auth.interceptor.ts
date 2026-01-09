import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Liste des routes publiques de l'API
  const publicApiRoutes = ['/api/locations', '/api/users/register'];

  // Ne rien faire si ce n'est pas une requête API ou si c'est une route publique
  if (!req.url.startsWith('/api') || publicApiRoutes.some(route => req.url.includes(route))) {
    return next(req);
  }

  // Pour les routes API protégées, on ajoute le token
  return from(handle(req, next, authService));
};

const handle = async (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
) => {
  const token = await authService.getToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    return lastValueFrom(next(authReq));
  }

  // Si pas de token, on laisse passer la requête (le backend la rejettera si nécessaire)
  return lastValueFrom(next(req));
};
