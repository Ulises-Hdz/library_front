import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookModalComponent } from '../../../library-front/pages/books-page/components/book-modal/book-modal.component';
import { BookItem } from '../../models/book.model';

@Component({
  selector: 'app-books-carousel',
  templateUrl: './books-carousel.component.html',
})
export class CarrouselBooksComponent implements OnInit {

  books = signal<BookItem[]>([]);
  private readonly bookService = inject(BookService);
  private readonly dialog = inject(Dialog);

  openDetails(book: BookItem) {
    this.dialog.open(BookModalComponent, {
      data: book,
      ariaLabel: `Detalles de ${book.title}`,
      maxWidth: '95vw',
      width: '600px',
      panelClass: ['bg-transparent', 'shadow-none'],
      backdropClass: ['bg-slate-900/70'],
    });
  }

  ngOnInit() {
    this.getBooks();
  }

  getBooks() {
    this.bookService.getBooks<BookItem[]>().subscribe({
      next: (books) => this.books.set(books),
      error: (error: unknown) => console.error('No se pudieron cargar los libros.', error),
    });
  }

}
