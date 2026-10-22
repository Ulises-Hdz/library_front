import { Component, inject, OnInit, signal } from '@angular/core';
import { BookCardComponent } from '../../../books/components/book-card/book-card.component';
import { BookFilters, SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { BookQuery, BookService } from '../../../books/services/book.service';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface BookItem {
  _id: string,
  isbn: string,
  title:	string;
  author:	string
  publisher: string
  publicationYear: number
  categories: string,
  coverUrl: string,
  description: string,
}


@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  imports: [BookCardComponent, SearchBarComponent],
})
export class BooksPageComponent implements OnInit {

  books = signal<BookItem[]>([]);
  private readonly filters$ = new Subject<BookFilters>();
  private readonly booksService = inject(BookService);

  constructor() {
    this.filters$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((previous, current) =>
          previous.search === current.search
            && previous.searchBy === current.searchBy
            && previous.category === current.category,
        ),
        switchMap((filters) =>
          this.booksService.getBooks<BookItem[]>(this.toBookQuery(filters)).pipe(
            catchError((error: unknown) => {
              console.error('No se pudieron cargar los libros.', error);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((books) => this.books.set(books));
  }

  ngOnInit() {
    this.filters$.next({ search: '', searchBy: 'title', category: '' });
  }

  updateFilters(filters: BookFilters) {
    this.filters$.next(filters);
  }

  private toBookQuery(filters: BookFilters): BookQuery {
    const search = filters.search.trim();
    const query: BookQuery = {};

    if (search) query[filters.searchBy] = search;
    if (filters.category) query.category = filters.category;

    return query;
  }
}
