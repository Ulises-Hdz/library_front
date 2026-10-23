import { Component, input } from '@angular/core';
import { BookItem } from '../../../library-front/pages/books-page/books-page.component';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
})
export class BookCardComponent {

  book = input.required<BookItem>();
  
}
