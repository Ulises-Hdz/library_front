import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiBook, BookItem, NewBook } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http = inject(HttpClient);

  getBooks<T = BookItem[]>(filters: BookQuery = {}) {
    let params = new HttpParams();

    if (filters.title)    params = params.set('title', filters.title);
    if (filters.author)   params = params.set('author', filters.author);
    if (filters.category) params = params.set('category', filters.category);

    if (filters.limit != null)  params = params.set('limit', filters.limit);
    if (filters.offset != null) params = params.set('offset', filters.offset);

    return this.http.get<T>(`${environment.baseUrl}/books`, { params });
  }

  createBook(book: NewBook) {
    return this.http.post<ApiBook>(`${environment.baseUrl}/books`, book);
  }

  updateBook(id: string, book: Partial<NewBook>) {
    return this.http.patch<ApiBook>(`${environment.baseUrl}/books/${id}`, book);
  }

  deleteBook(id: string) {
    return this.http.delete(`${environment.baseUrl}/books/${id}`);
  }

  getOneBook(id: string) {
    return this.http.get<BookItem>(`${environment.baseUrl}/books/${id}`)
  }

}

export interface BookQuery {
  title?: string;
  author?: string;
  category?: string;
  limit?: number;
  offset?: number;
}
