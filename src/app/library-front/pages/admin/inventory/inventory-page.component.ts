import { Component, computed, inject, signal } from '@angular/core';
import { InventoryRow } from '../../../../admin/models/admin.models';
import { InventoryService } from '../../../../admin/services/inventory.service';
import { BookService } from '../../../../books/services/book.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog/confirm-dialog.service';
import { NewBookModalComponent } from './new-book-modal/new-book-modal.component';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  imports: [NewBookModalComponent],
})
export class InventoryPageComponent {
  private inventoryService = inject(InventoryService);
  private bookService = inject(BookService);
  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);

  books = signal<InventoryRow[]>([]);
  search = signal('');
  modalOpen = signal(false);
  editing = signal<InventoryRow | null>(null);
  loading = signal(false);

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.books();
    return this.books().filter((b) => [b.isbn, b.title, b.author].some((v) => (v ?? '').toLowerCase().includes(term)));
  });

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.inventoryService.getInventory().subscribe({
      next: (books) => { this.books.set(books); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  remove(book: InventoryRow) {
    this.confirmDialog
      .confirm({
        title: 'Dar de baja',
        message: `¿Dar de baja "${book.title}"?`,
        confirmText: 'Dar de baja',
        danger: true,
      })
      .subscribe((ok) => {
        if (!ok) return;
        this.bookService.deleteBook(book._id).subscribe({
          next: () => { this.toast.success('Libro dado de baja.'); this.load(); },
          error: () => this.toast.error('No se pudo dar de baja el libro (¿tiene préstamos activos?).'),
        });
      });
  }

  openCreate() {
    this.editing.set(null);
    this.modalOpen.set(true);
  }

  openEdit(book: InventoryRow) {
    this.editing.set(book);
    this.modalOpen.set(true);
  }

  onCreated() {
    this.toast.success(this.editing() ? 'Libro actualizado.' : 'Libro registrado.');
    this.modalOpen.set(false);
    this.load();
  }
}
