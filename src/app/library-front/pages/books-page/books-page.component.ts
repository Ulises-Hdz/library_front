import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from '../../../books/components/book-card/book-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  imports: [BookCardComponent, SearchBarComponent],
})
export class BooksPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
