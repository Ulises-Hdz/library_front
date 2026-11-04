import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.token();
  const isAuthEndpoint = /\/auth\/(login|register)$/.test(req.url);

  const request = token
    ? req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      // Token vencido o usuario bloqueado: cerrar la sesión y volver al login.
      if (error instanceof HttpErrorResponse && error.status === 401 && token && !isAuthEndpoint) {
        authService.logout();
        router.navigateByUrl('/auth/login');
      }
      return throwError(() => error);
    })
  );
}
