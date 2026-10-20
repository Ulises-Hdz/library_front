import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-slider-navbar',
  templateUrl: './slider-navbar.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class SliderNavbarComponent {
  isMenuOpen = signal(false);

  authService = inject(AuthService);
  
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.isMenuOpen.set(false);
    this.router.navigateByUrl('/auth/login');
  }

  toggleMenu() {
    this.isMenuOpen.update((open) => !open);
  }
}
