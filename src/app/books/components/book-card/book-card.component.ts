import { Component, inject, input } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { BookModalComponent } from '../../../library-front/pages/books-page/components/book-modal/book-modal.component';
import { BookItem } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
})
export class BookCardComponent {

  book = input.required<BookItem>();
  private readonly dialog = inject(Dialog);

  openDetails() {
    this.dialog.open(BookModalComponent, {
      data: this.book(),
      ariaLabel: `Detalles de ${this.book().title}`,
      maxWidth: '95vw',
      width: '600px',
      panelClass: ['bg-transparent', 'shadow-none'],
      backdropClass: ['bg-slate-900/70'],
    });
  }

}
