import { Component, inject, OnInit, signal } from '@angular/core';
import { BookCardComponent } from '../../../books/components/book-card/book-card.component';
import { BookFilters, SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { BookQuery, BookService } from '../../../books/services/book.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookItem } from '../../../books/models/book.model';

interface PageRequest {
  filters: BookFilters;
  page: number;
}

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  imports: [BookCardComponent, SearchBarComponent, PaginationComponent],
})
export class BooksPageComponent implements OnInit {

  /** Libros visibles en la página actual */
  books = signal<BookItem[]>([]);

  /** Página actual (empieza en 1) */
  currentPage = signal(1);

  /** Indica si hay una página siguiente */
  hasNextPage = signal(false);

  /** Libros por página */
  readonly pageSize = 8;

  /** Subject que combina filtros + página para hacer una sola petición */
  private readonly pageRequest$ = new Subject<PageRequest>();

  /** Últimos filtros aplicados (para reutilizar al cambiar de página) */
  private lastFilters: BookFilters = { search: '', searchBy: 'title', category: '' };

  private readonly booksService = inject(BookService);

  constructor() {
    this.pageRequest$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) =>
          prev.page === curr.page
          && prev.filters.search === curr.filters.search
          && prev.filters.searchBy === curr.filters.searchBy
          && prev.filters.category === curr.filters.category,
        ),
        switchMap(({ filters, page }) => {
          const offset = (page - 1) * this.pageSize;
          const query: BookQuery = {
            ...this.toBookQuery(filters),
            limit: this.pageSize + 1, // Pedimos 1 extra para saber si hay siguiente
            offset,
          };
          return this.booksService.getBooks<BookItem[]>(query).pipe(
            catchError((error: unknown) => {
              console.error('No se pudieron cargar los libros.', error);
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((books) => {
        // Si recibimos más de pageSize, hay página siguiente
        this.hasNextPage.set(books.length > this.pageSize);
        // Mostrar solo los del pageSize (quitar el extra)
        this.books.set(books.slice(0, this.pageSize));
      });
  }

  ngOnInit() {
    this.emitRequest(this.lastFilters, 1);
  }

  updateFilters(filters: BookFilters) {
    this.lastFilters = filters;
    this.currentPage.set(1);
    this.emitRequest(filters, 1);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.emitRequest(this.lastFilters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private emitRequest(filters: BookFilters, page: number) {
    this.pageRequest$.next({ filters, page });
  }

  private toBookQuery(filters: BookFilters): BookQuery {
    const search = filters.search.trim();
    const query: BookQuery = {};

    if (search) query[filters.searchBy] = search;
    if (filters.category) query.category = filters.category;

    return query;
  }
}
