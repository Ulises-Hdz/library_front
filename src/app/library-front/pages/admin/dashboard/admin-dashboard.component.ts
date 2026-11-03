import { Component, inject, signal } from '@angular/core';
import { AdminStats } from '../../../../admin/models/admin.models';
import { StatsService } from '../../../../admin/services/stats.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private stats$ = inject(StatsService);

  stats = signal<AdminStats | null>(null);
  error = signal(false);

  constructor() {
    this.stats$.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => this.error.set(true),
    });
  }
}
