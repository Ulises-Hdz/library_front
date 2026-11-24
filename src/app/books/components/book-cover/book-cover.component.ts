import { Component, effect, inject, input, signal } from '@angular/core';
import { InventoryService } from '../../../admin/services/inventory.service';

@Component({
  selector: 'app-book-cover',
  templateUrl: './book-cover.component.html',
  host: {
    class: 'block h-full w-full',
  },
})
export class BookCoverComponent {
  bookId = input.required<string>();
  alt = input('Portada del libro');
  fit = input<'cover' | 'contain'>('cover');
  imageClass = input('');

  coverUrl = signal<string | null>(null);
  status = signal<'loading' | 'loaded' | 'missing'>('loading');

  private readonly inventoryService = inject(InventoryService);

  constructor() {
    effect((onCleanup) => {
      const bookId = this.bookId();
      let objectUrl: string | null = null;

      this.coverUrl.set(null);
      this.status.set('loading');

      const subscription = this.inventoryService.getCoverImage(bookId).subscribe({
        next: (image) => {
          if (!image.size || typeof URL === 'undefined' || !URL.createObjectURL) {
            this.status.set('missing');
            return;
          }

          objectUrl = URL.createObjectURL(image);
          this.coverUrl.set(objectUrl);
          this.status.set('loaded');
        },
        error: () => this.status.set('missing'),
      });

      onCleanup(() => {
        subscription.unsubscribe();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      });
    });
  }
}
