import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = ('checking');
  private _user = null;
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  token = computed(() => this._token());

  login(email: string, password: string) {
    return this.http.post(`${environment.baseUrl}/auth/login` , {
      email,
      password
    }).pipe(
        map((resp: any) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
    )
  }

  register(email: string, password: string, full_name: string) {
    return this.http.post(`${environment.baseUrl}/auth/register`, {
      email,
      password,
      full_name,
    }).pipe(
        map((resp: any) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
    )
  }

  checkStatus() {
    const token = localStorage.getItem('token');
    if(!token) {
      this.logout()
      return of(false)
    }

    return this.http.get(`${environment.baseUrl}/auth/profile`, {
    }).pipe(
        map(resp => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
    )
  }

  logout() {
    this._user = null;
    this._token.set(null);
    this._authStatus = 'not-authenticated';
    
    localStorage.removeItem('token');
  }
  get isAuthenticated(): boolean {
    return !!this._token();
  }

  private handleAuthSuccess(resp: any) {
    this._user = resp.user;
    this._authStatus = 'authenticated';
    if (resp.token) {
      this._token.set(resp.token);
      localStorage.setItem('token', resp.token);
    }
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

}
