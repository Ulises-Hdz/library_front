import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="fixed bottom-5 right-5 left-5 sm:left-auto sm:w-80 z-[100] flex flex-col gap-2" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div role="alert" class="flex items-start justify-between gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white"
             [class.bg-green-600]="toast.type === 'success'" [class.bg-red-600]="toast.type === 'error'">
          <span>{{ toast.message }}</span>
          <button type="button" aria-label="Cerrar notificación" class="opacity-80 hover:opacity-100" (click)="toastService.dismiss(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
