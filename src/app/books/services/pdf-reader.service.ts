import { inject, Injectable } from '@angular/core';
import { InventoryService } from '../../admin/services/inventory.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfReaderService {
  private readonly inventoryService = inject(InventoryService);

  getPDFUrl(bookId: string): Observable<Blob> {
    return this.inventoryService.getPDFDigital(bookId);
  }
}
