import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MyLoan } from '../../../admin/models/admin.models';
import { LoansService } from '../../../admin/services/loans.service';

@Component({
  selector: 'app-loans-page',
  templateUrl: './loans-page.component.html',
  imports: [DatePipe],
})
export class LoansPageComponent {
  private loansService = inject(LoansService);

  loans = signal<MyLoan[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor() {
    this.loansService.getMyLoans().subscribe({
      next: (loans) => { this.loans.set(loans); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  statusLabel(status: MyLoan['status']) {
    return { ACTIVE: 'Activo', OVERDUE: 'Vencido', RETURNED: 'Devuelto' }[status];
  }

  statusClasses(status: MyLoan['status']) {
    return {
      ACTIVE: 'bg-blue-100 text-blue-800 border-blue-200',
      OVERDUE: 'bg-red-100 text-red-700 border-red-200',
      RETURNED: 'bg-green-100 text-green-700 border-green-200',
    }[status];
  }
}
