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
  year = signal('');
  categories = signal('');
  description = signal('');
  isDigital = signal(true);
  copies = signal(1);
  file = signal<File | null>(null);
  dragging = signal(false);
  saving = signal(false);
  error = signal('');

  // Signals para rastrear si los campos fueron tocados
  isbnTouched = signal(false);
  titleTouched = signal(false);
  authorTouched = signal(false);
  publisherTouched = signal(false);
  yearTouched = signal(false);
  categoriesTouched = signal(false);

  ngOnInit() {
    const book = this.book();
    if (!book) return;
    this.isbn.set(book.isbn);
    this.title.set(book.title);
    this.author.set(book.author);
    this.publisher.set(book.publisher);
    this.year.set(book.publicationYear?.toString() ?? '');
    this.categories.set((book.categories ?? []).join(', '));
    this.description.set(book.description ?? '');
  }

  isbnValid = computed(() => !!this.isbn().trim());
  titleValid = computed(() => !!this.title().trim());
  authorValid = computed(() => !!this.author().trim());
  publisherValid = computed(() => !!this.publisher().trim());
  yearValid = computed(() => {
    const y = this.year().trim();
    if (!y) return false;
    const num = parseInt(y, 10);
    const currentYear = new Date().getFullYear();
    return num >= 1000 && num <= currentYear;
  });
  categoriesValid = computed(() => !!this.categories().trim());

  // Computeds para mostrar error: touched Y inválido
  showIsbnError = computed(() => this.isbnTouched() && !this.isbnValid());
  showTitleError = computed(() => this.titleTouched() && !this.titleValid());
  showAuthorError = computed(() => this.authorTouched() && !this.authorValid());
  showPublisherError = computed(() => this.publisherTouched() && !this.publisherValid());
  showYearError = computed(() => this.yearTouched() && !this.yearValid());
  showCategoriesError = computed(() => this.categoriesTouched() && !this.categoriesValid());

  step1Valid = computed(() => this.isbnValid() && this.titleValid() && this.authorValid() && this.publisherValid() && this.yearValid() && this.categoriesValid());
  
  currentYear = new Date().getFullYear();
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

  onIsbnBlur() {
    this.isbnTouched.set(true);
  }

  onTitleBlur() {
    this.titleTouched.set(true);
  }

  onAuthorBlur() {
    this.authorTouched.set(true);
  }

  onPublisherBlur() {
    this.publisherTouched.set(true);
  }

  onYearBlur() {
    this.yearTouched.set(true);
  }

  onCategoriesBlur() {
    this.categoriesTouched.set(true);
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
    const yearNum = this.year().trim() ? parseInt(this.year().trim(), 10) : new Date().getFullYear();
    return {
      isbn: this.isbn().trim(),
      title: this.title().trim(),
      author: this.author().trim(),
      publisher: this.publisher().trim(),
      publicationYear: yearNum,
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
