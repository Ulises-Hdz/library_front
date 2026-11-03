import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { InventoryRow } from '../../../../../admin/models/admin.models';
import { InventoryService } from '../../../../../admin/services/inventory.service';
import { BookService } from '../../../../../books/services/book.service';

@Component({
  selector: 'app-new-book-modal',
  templateUrl: './new-book-modal.component.html',
})
export class NewBookModalComponent implements OnInit {
  private bookService = inject(BookService);
  private inventoryService = inject(InventoryService);

  book = input<InventoryRow | null>(null);
  closed = output<void>();
  created = output<void>();

  step = signal<1 | 2>(1);
  isbn = signal('');
  title = signal('');
  author = signal('');
  publisher = signal('');
  categories = signal('');
  description = signal('');
  isDigital = signal(true);
  copies = signal(1);
  file = signal<File | null>(null);
  dragging = signal(false);
  saving = signal(false);
  error = signal('');

  ngOnInit() {
    const book = this.book();
    if (!book) return;
    this.isbn.set(book.isbn);
    this.title.set(book.title);
    this.author.set(book.author);
    this.publisher.set(book.publisher);
    this.categories.set((book.categories ?? []).join(', '));
    this.description.set(book.description ?? '');
  }

  step1Valid = computed(() => !!this.isbn().trim() && !!this.title().trim() && !!this.author().trim() && !!this.publisher().trim() && !!this.categories().trim());
  canSave = computed(() =>
    this.isDigital() ? !!this.file() : this.copies() >= 1
  );

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    this.setFile(event.dataTransfer?.files?.[0] ?? null);
  }

  onFileInput(event: Event) {
    this.setFile((event.target as HTMLInputElement).files?.[0] ?? null);
  }

  private setFile(file: File | null) {
    if (file && !/\.(pdf|epub)$/i.test(file.name)) {
      this.error.set('Solo se permiten archivos PDF o EPUB.');
      return;
    }
    this.error.set('');
    this.file.set(file);
  }

  private bookData() {
    return {
      isbn: this.isbn().trim(),
      title: this.title().trim(),
      author: this.author().trim(),
      publisher: this.publisher().trim(),
      categories: this.categories().split(',').map((c) => c.trim()).filter(Boolean),
      description: this.description().trim(),
    };
  }

  update() {
    const book = this.book();
    if (!book) return;
    this.saving.set(true);
    this.error.set('');
    this.bookService.updateBook(book._id, this.bookData()).subscribe({
      next: () => this.created.emit(),
      error: () => this.fail('No se pudo actualizar el libro (¿ISBN duplicado?).'),
    });
  }

  save() {
    this.saving.set(true);
    this.error.set('');
    const digital = this.isDigital();

    this.bookService.createBook(this.bookData()).subscribe({
      next: (book) => {
        const file = this.file();
        const done = { next: () => this.created.emit() };
        if (digital && file) {
          this.inventoryService.uploadDigital(book._id, file).subscribe({
            ...done,
            error: () => this.fail('El libro se registró, pero falló la subida del archivo.'),
          });
        } else {
          this.inventoryService.addPhysicalCopies(book, this.copies()).subscribe({
            ...done,
            error: () => this.fail('El libro se registró, pero falló el alta de ejemplares.'),
          });
        }
      },
      error: () => this.fail('No se pudo registrar el libro (¿ISBN duplicado?).'),
    });
  }

  private fail(message: string) {
    this.saving.set(false);
    this.error.set(message);
  }
}
