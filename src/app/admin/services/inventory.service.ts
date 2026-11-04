import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiBook } from '../../books/models/book.model';
import { InventoryRow, PhysicalItem, PhysicalStock } from '../models/admin.models';

// Ejemplares físicos y archivos digitales de cada libro.
@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private api = environment.baseUrl;

  getStock(bookId: string): Observable<PhysicalStock> {
    return this.http
      .get<PhysicalStock>(`${this.api}/physical-items/book/${bookId}`)
      .pipe(catchError(() => of({ total: 0, available: 0 })));
  }

  // Endpoint pendiente en el backend: ejemplares AVAILABLE de un libro.
  getAvailableItems(bookId: string) {
    return this.http.get<PhysicalItem[]>(`${this.api}/physical-items/book/${bookId}/available`);
  }

  addPhysicalCopies(book: ApiBook, copies: number) {
    const stamp = Date.now().toString(36);
    return forkJoin(
      Array.from({ length: copies }, (_, i) =>
        this.http.post(`${this.api}/physical-items`, {
          book_id: book._id,
          barcode: `${book.isbn}-${stamp}-${i + 1}`,
        })
      )
    );
  }

  // El archivo digital solo se consulta por cabeceras (HEAD) para saber si existe.
  hasDigital(bookId: string): Observable<boolean> {
    return this.http
      .head(`${this.api}/digital-resources/book/${bookId}`, { observe: 'response' })
      .pipe(map(() => true), catchError(() => of(false)));
  }

  uploadDigital(bookId: string, file: File) {
    const form = new FormData();
    form.append('file', file);
    form.append('book_id', bookId);
    return this.http.post(`${this.api}/digital-resources`, form);
  }

  getInventory(): Observable<InventoryRow[]> {
    return this.http.get<InventoryRow[]>(`${this.api}/books/inventory`);
  }
}
