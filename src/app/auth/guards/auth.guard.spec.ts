import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard, notAuthenticatedGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('auth guards', () => {
  function run(guard: typeof authGuard, isAuthenticated: boolean) {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { isAuthenticated } }],
    });
    return TestBed.runInInjectionContext(() => guard({} as never, {} as never));
  }

  it('authGuard allows authenticated users', () => {
    expect(run(authGuard, true)).toBe(true);
  });

  it('authGuard redirects to login otherwise', () => {
    const result = run(authGuard, false) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/auth/login');
  });

  it('notAuthenticatedGuard redirects authenticated users to home', () => {
    const result = run(notAuthenticatedGuard, true) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/home');
  });

  it('notAuthenticatedGuard allows guests', () => {
    expect(run(notAuthenticatedGuard, false)).toBe(true);
  });
});
