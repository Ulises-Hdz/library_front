import { Component, inject, signal } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { BookItem } from '../../../../../books/models/book.model';
import { InventoryService } from '../../../../../admin/services/inventory.service';
import { AuthService } from '../../../../../auth/services/auth.service';
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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  stock = signal<PhysicalStock | null>(null);
  hasDigital = signal<boolean>(false);

  constructor() {
    this.inventoryService.getStock(this.book._id).subscribe((stock) => this.stock.set(stock));
    this.inventoryService.hasDigital(this.book._id).subscribe((has) => this.hasDigital.set(has));
  }

  close() {
    this.dialogRef.close();
  }

  readPDF() {
    this.dialogRef.close();
    this.router.navigate(['/read', this.book._id]);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}
