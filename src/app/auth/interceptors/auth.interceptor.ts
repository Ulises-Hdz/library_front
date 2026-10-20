import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const token = inject(AuthService).token();

  if (!token) {
    return next(req);
  }

  const newReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + token),
  });
  return next(newReq);
}
