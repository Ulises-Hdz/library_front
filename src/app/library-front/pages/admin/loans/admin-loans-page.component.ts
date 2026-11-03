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
  selectedUser = signal('');
  selectedBook = signal('');
  saving = signal(false);
  modalError = signal('');

  students = computed(() => this.users().filter((u) => u.role !== 'ADMIN' && u.status !== 'BLOCKED'));

  openLoans = computed(() => this.loans().filter((l) => l.status !== 'RETURNED'));

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
    this.selectedUser.set('');
    this.selectedBook.set('');
    this.modalError.set('');
    this.modalOpen.set(true);
  }

  saveManual() {
    const userId = this.selectedUser();
    this.saving.set(true);
    this.modalError.set('');
    this.inventoryService.getAvailableItems(this.selectedBook()).subscribe({
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
            this.message.set({ ok: true, text: `Préstamo registrado para ${this.userName(userId)}.` });
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
