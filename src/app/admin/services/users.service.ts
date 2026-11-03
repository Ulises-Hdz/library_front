import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserItem } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<UserItem[]>(`${environment.baseUrl}/auth`);
  }

  setUserStatus(id: string, status: 'ACTIVE' | 'BLOCKED') {
    return this.http.patch(`${environment.baseUrl}/auth/${id}`, { status });
  }
}
