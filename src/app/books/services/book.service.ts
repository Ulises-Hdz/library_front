import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BookItem } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http = inject(HttpClient);

  getBooks<T = BookItem[]>(filters: BookQuery = {}) {
    let params = new HttpParams();

    if (filters.title) params = params.set('title', filters.title);
    if (filters.author) params = params.set('author', filters.author);
    if (filters.category) params = params.set('category', filters.category);

    return this.http.get<T>(`${environment.baseUrl}/books`, { params });
  }

  getOneBook(id: string) {
    return this.http.get<BookItem>(`${environment.baseUrl}/book/${id}`)
  }
}

export interface BookQuery {
  title?: string;
  author?: string;
  category?: string;
}
