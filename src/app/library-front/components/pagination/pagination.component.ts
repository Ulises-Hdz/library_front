import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {

  /** Página actual (empieza en 1) */
  currentPage = input.required<number>();

  /** Si hay una página siguiente disponible */
  hasNextPage = input.required<boolean>();

  /** Se emite cuando el usuario quiere cambiar de página */
  pageChange = output<number>();

  /** Páginas visibles para el template */
  visiblePages = computed<(number | '...')[]>(() => {
    const current = this.currentPage();

    // Sin página siguiente y estamos en la 1 → no mostrar nada
    if (current === 1 && !this.hasNextPage()) return [1];

    // Calcular la última página conocida.
    // Como no conocemos el total, mostramos hasta la actual + 1 si hay siguiente.
    const lastKnown = this.hasNextPage() ? current + 1 : current;

    if (lastKnown <= 7) {
      return Array.from({ length: lastKnown }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [1];

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(lastKnown, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < lastKnown) {
      pages.push('...');
      pages.push(lastKnown);
    }

    return pages;
  });

  goToPage(page: number | '...') {
    if (page === '...') return;
    if (page < 1) return;
    if (page > this.currentPage() && !this.hasNextPage()) return;
    this.pageChange.emit(page);
  }
}

