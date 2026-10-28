import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'

export interface UserItem {
  _id:	string,
  full_name: string,
  email: string,
  role: string,
  status: string
}

type AuthResponse = { token: string , user: UserItem}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserItem|null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  token = computed(this._token);
  user = computed(() => this._user());
  authStatus = computed(() => this._authStatus());

  constructor() {
    // Al iniciar el servicio, verificar si hay una sesión válida
    this.checkStatus().subscribe();
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/auth/login` , {
      email,
      password
    }).pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: unknown) => this.handleAuthError(error))
    )
  }

  register(email: string, password: string, full_name: string) {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/auth/register`, {
      email,
      password,
      full_name,
    }).pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: unknown) => this.handleAuthError(error))
    )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if(!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${environment.baseUrl}/auth/profile`).pipe(
        map((resp) => this.handleAuthSuccess({ ...resp, token: resp.token ?? token })),
        catchError((error: HttpErrorResponse) => {
          // Solo se cierra sesión si el token es inválido; errores de red/servidor la conservan.
          if (error.status === 401 || error.status === 403) {
            return this.handleAuthError(error);
          }
          // Error de red: mantener la sesión como estaba si hay token
          this._authStatus.set('authenticated');
          return of(false);
        })
    )
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  get isAuthenticated(): boolean {
    return this._authStatus() === 'authenticated';
  }

  private handleAuthSuccess({token , user}: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', token);
    return true;
  }

  private handleAuthError(_error: unknown) {
    this.logout();
    return of(false);
  }

}
