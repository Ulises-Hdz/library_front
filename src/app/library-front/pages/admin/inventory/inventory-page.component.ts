import { Component, computed, inject, signal } from '@angular/core';
import { InventoryRow } from '../../../../admin/models/admin.models';
import { InventoryService } from '../../../../admin/services/inventory.service';
import { BookService } from '../../../../books/services/book.service';
import { NewBookModalComponent } from './new-book-modal/new-book-modal.component';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  imports: [NewBookModalComponent],
})
export class InventoryPageComponent {
  private inventoryService = inject(InventoryService);
  private bookService = inject(BookService);

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
    if (!confirm(`¿Dar de baja "${book.title}"?`)) return;
    this.bookService.deleteBook(book._id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo dar de baja el libro.'),
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
    this.modalOpen.set(false);
    this.load();
  }
}
