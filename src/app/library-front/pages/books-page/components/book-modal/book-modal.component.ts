import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BookItem } from '../../../../../books/models/book.model';


@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
  host: {
    class: 'block overflow-hidden rounded-2xl bg-base-100 text-base-content shadow-2xl',
    role: 'dialog',
    'aria-modal': 'true',
  },
})
export class BookModalComponent {
  readonly book = inject<BookItem>(DIALOG_DATA);
  private readonly dialogRef = inject<DialogRef<void>>(DialogRef);

  close() {
    this.dialogRef.close();
  }
}
