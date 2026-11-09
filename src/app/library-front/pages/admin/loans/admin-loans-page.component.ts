import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiBook } from '../../../../books/models/book.model';
import { BookService } from '../../../../books/services/book.service';
import { Loan } from '../../../../admin/models/admin.models';
import { InventoryService } from '../../../../admin/services/inventory.service';
import { LoansService } from '../../../../admin/services/loans.service';
import { UsersService } from '../../../../admin/services/users.service';
import { UserItem } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-admin-loans-page',
  templateUrl: './admin-loans-page.component.html',
  imports: [DatePipe],
})
export class AdminLoansPageComponent {
  private loansService = inject(LoansService);
  private usersService = inject(UsersService);
  private bookService = inject(BookService);
  private inventoryService = inject(InventoryService);

  loans = signal<Loan[]>([]);
  users = signal<UserItem[]>([]);
  message = signal<{ ok: boolean; text: string } | null>(null);
  books = signal<ApiBook[]>([]);
  modalOpen = signal(false);
  selectedUser = signal<UserItem | null>(null);
  selectedBook = signal<ApiBook | null>(null);
  saving = signal(false);
  modalError = signal('');
  
  // Búsqueda y filtrado
  userSearchQuery = signal('');
  bookSearchQuery = signal('');
  showUserDropdown = signal(false);
  showBookDropdown = signal(false);
  availableStock = signal(0);

  students = computed(() => this.users().filter((u) => u.role !== 'ADMIN' && u.status !== 'BLOCKED'));

  openLoans = computed(() => this.loans().filter((l) => l.status !== 'RETURNED'));

  // Filtrados de búsqueda (solo si hay 2+ caracteres)
  filteredStudents = computed(() => {
    const query = this.userSearchQuery().toLowerCase().trim();
    if (query.length < 2) return [];
    return this.students().filter(u => 
      u.full_name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
  });

  filteredBooks = computed(() => {
    const query = this.bookSearchQuery().toLowerCase().trim();
    if (query.length < 2) return [];
    return this.books().filter(b => 
      b.title.toLowerCase().includes(query) || 
      b.author.toLowerCase().includes(query) ||
      b.isbn.toLowerCase().includes(query)
    );
  });

  // Fecha de devolución (14 días)
  dueDate = computed(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
  });

  // Validación del formulario
  isFormValid = computed(() => !!this.selectedUser() && !!this.selectedBook() && this.availableStock() > 0);

  // Contar préstamos activos del usuario
  userActiveLoans = computed(() => {
    const userId = this.selectedUser()?._id;
    if (!userId) return 0;
    return this.loans().filter(l => l.user_id === userId && l.status !== 'RETURNED').length;
  });

  // Estado del usuario
  userStatus = computed(() => {
    const user = this.selectedUser();
    if (!user) return null;
    return {
      active: user.status === 'ACTIVE',
      name: user.full_name,
      loans: this.userActiveLoans()
    };
  });

  constructor() {
    this.load();
    this.usersService.getUsers().subscribe((u) => this.users.set(u));
    this.bookService.getBooks<ApiBook[]>({ limit: 1000 }).subscribe((b) => this.books.set(b));
  }

  load() {
    this.loansService.getLoans().subscribe((l) => this.loans.set(l));
  }

  userName(id: string) {
    return this.users().find((u) => u._id === id)?.full_name ?? id;
  }

  initials(id: string) {
    return this.userName(id).split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }

  openModal() {
    this.selectedUser.set(null);
    this.selectedBook.set(null);
    this.userSearchQuery.set('');
    this.bookSearchQuery.set('');
    this.availableStock.set(0);
    this.modalError.set('');
    this.showUserDropdown.set(false);
    this.showBookDropdown.set(false);
    this.modalOpen.set(true);
  }

  selectUser(user: UserItem) {
    this.selectedUser.set(user);
    this.userSearchQuery.set(user.full_name);
    this.showUserDropdown.set(false);
  }

  selectBook(book: ApiBook) {
    this.selectedBook.set(book);
    this.bookSearchQuery.set(book.title);
    this.showBookDropdown.set(false);
    // Cargar stock disponible
    this.inventoryService.getAvailableItems(book._id).subscribe({
      next: (items) => this.availableStock.set(items.length),
      error: () => this.availableStock.set(0)
    });
  }

  onUserBlur() {
    setTimeout(() => this.showUserDropdown.set(false), 150);
  }

  onBookBlur() {
    setTimeout(() => this.showBookDropdown.set(false), 150);
  }

  saveManual() {
    const userId = this.selectedUser()?._id;
    const bookId = this.selectedBook()?._id;
    
    if (!userId || !bookId) {
      this.modalError.set('Selecciona un alumno y un libro.');
      return;
    }

    this.saving.set(true);
    this.modalError.set('');
    this.inventoryService.getAvailableItems(bookId).subscribe({
      next: (items) => {
        if (!items.length) {
          this.saving.set(false);
          this.modalError.set('No hay ejemplares disponibles de este libro.');
          return;
        }
        this.loansService.createLoan(userId, items[0]._id).subscribe({
          next: () => {
            this.saving.set(false);
            this.modalOpen.set(false);
            this.message.set({ ok: true, text: `Préstamo registrado para ${this.selectedUser()?.full_name}.` });
            this.load();
          },
          error: (e) => this.failModal(e.error?.message ?? 'No se pudo registrar el préstamo.'),
        });
      },
      error: () => this.failModal('No se pudieron consultar los ejemplares disponibles.'),
    });
  }

  private failModal(text: string) {
    this.saving.set(false);
    this.modalError.set(text);
  }

  registerReturn(loan: Loan) {
    this.loansService.returnLoan(loan._id).subscribe({
      next: () => this.load(),
      error: (e) => this.message.set({ ok: false, text: e.error?.message ?? 'No se pudo registrar la devolución.' }),
    });
  }
}
