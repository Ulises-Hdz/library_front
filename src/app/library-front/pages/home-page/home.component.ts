import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { CarrouselBooksComponent } from '../../../books/components/book-carousel/books-carousel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CarrouselBooksComponent],
})
export class HomePageComponent {
  authService = inject(AuthService);
}
