import { Component, inject, signal } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BookItem } from '../../../../../books/models/book.model';
import { InventoryService } from '../../../../../admin/services/inventory.service';
import { PhysicalStock } from '../../../../../admin/models/admin.models';


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
  private readonly inventoryService = inject(InventoryService);

  stock = signal<PhysicalStock | null>(null);

  constructor() {
    this.inventoryService.getStock(this.book._id).subscribe((stock) => this.stock.set(stock));
  }

  close() {
    this.dialogRef.close();
  }
}
