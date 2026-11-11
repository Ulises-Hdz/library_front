import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfReaderService } from '../../../books/services/pdf-reader.service';
import { BookService } from '../../../books/services/book.service';
import { BookItem } from '../../../books/models/book.model';
import { CommonModule } from '@angular/common';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-pdf-reader-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-reader-page.component.html',
  styleUrls: ['./pdf-reader-page.component.css'],
})
export class PdfReaderPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pdfReaderService = inject(PdfReaderService);
  private readonly bookService = inject(BookService);

  book = signal<BookItem | null>(null);
  pdfUrl = signal<string>('');
  pdfBlob = signal<Blob | null>(null);
  isLoading = signal(true);
  error = signal<string>('');

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');

    if (!bookId) {
      this.router.navigate(['/books']);
      return;
    }

    // Cargar información del libro
    this.bookService.getOneBook(bookId).pipe(
      catchError((err) => {
        console.error('Error al cargar el libro', err);
        this.error.set('No se pudo cargar la información del libro.');
        this.isLoading.set(false);
        return EMPTY;
      })
    ).subscribe((book) => {
      this.book.set(book);

      // Cargar PDF como Blob
      this.pdfReaderService.getPDFUrl(bookId).pipe(
        catchError((err) => {
          console.error('Error al cargar el PDF', err);
          this.error.set('No se pudo cargar el PDF. Por favor, intenta más tarde.');
          this.isLoading.set(false);
          return EMPTY;
        })
      ).subscribe((blob) => {
        if (blob && blob.size > 0) {
          this.pdfBlob.set(blob);
          // Crear URL desde el Blob
          const url = URL.createObjectURL(blob);
          this.pdfUrl.set(url);
        } else {
          this.error.set('No hay PDF disponible para este libro.');
        }
        this.isLoading.set(false);
      });
    });
  }

  goBack() {
    this.router.navigate(['/books']);
  }

  downloadPDF() {
    const blob = this.pdfBlob();
    if (blob && blob.size > 0) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.book()?.title || 'libro'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
