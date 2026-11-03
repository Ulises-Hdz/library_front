import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Loan } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class LoansService {
  private http = inject(HttpClient);

  getLoans() {
    return this.http.get<Loan[]>(`${environment.baseUrl}/loans`);
  }

  createLoan(user_id: string, physical_item_id: string) {
    return this.http.post<Loan>(`${environment.baseUrl}/loans`, { user_id, physical_item_id });
  }

  returnLoan(id: string) {
    return this.http.delete(`${environment.baseUrl}/loans/${id}`);
  }
}
