import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { AdminStats } from '../models/admin.models';
import { InventoryService } from './inventory.service';
import { LoansService } from './loans.service';

// No hay endpoint de estadísticas: se calculan a partir de préstamos e inventario.
@Injectable({ providedIn: 'root' })
export class StatsService {
  private loansService = inject(LoansService);
  private inventoryService = inject(InventoryService);

  getStats(): Observable<AdminStats> {
    return forkJoin({
      loans: this.loansService.getLoans(),
      inventory: this.inventoryService.getInventory(),
    }).pipe(
      map(({ loans, inventory }) => ({
        overdueStudents: new Set(loans.filter((l) => l.status === 'OVERDUE').map((l) => l.user_id)).size,
        activeLoans: loans.filter((l) => l.status !== 'RETURNED').length,
        totalPhysicalCopies: inventory.reduce((sum, b) => sum + b.stock.total, 0),
        totalPdfs: inventory.filter((b) => b.digital).length,
      }))
    );
  }
}
