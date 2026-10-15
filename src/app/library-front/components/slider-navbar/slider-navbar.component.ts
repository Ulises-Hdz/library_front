import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-slider-navbar',
  templateUrl: './slider-navbar.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class SliderNavbarComponent {
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((open) => !open);
  }
}
