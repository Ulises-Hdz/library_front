import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protege las rutas privadas: sin sesión redirige al login.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated ? true : router.createUrlTree(['/auth/login']);
};

// Protege las rutas de auth: con sesión iniciada redirige al home.
export const notAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated ? router.createUrlTree(['/home']) : true;
};
