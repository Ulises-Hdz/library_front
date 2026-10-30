import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

// Protege las rutas privadas: sin sesión redirige al login.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado, dejar pasar inmediatamente
  if (authService.authStatus() === 'authenticated') {
    return true;
  }

  // Si todavía está verificando (ej. recarga de página), esperar a que checkStatus resuelva
  if (authService.authStatus() === 'checking') {
    return authService.checkStatus().pipe(
      map((isValid) => isValid ? true : router.createUrlTree(['/auth/login']))
    );
  }

  // No autenticado → redirigir a login
  return router.createUrlTree(['/auth/login']);
};

// Protege las rutas de auth: con sesión iniciada redirige al home.
export const notAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado, redirigir al home
  if (authService.authStatus() === 'authenticated') {
    return router.createUrlTree(['/home']);
  }

  // Si todavía está verificando, esperar
  if (authService.authStatus() === 'checking') {
    return authService.checkStatus().pipe(
      map((isValid) => isValid ? router.createUrlTree(['/home']) : true)
    );
  }

  // No autenticado → dejar ver login/register
  return true;
};
