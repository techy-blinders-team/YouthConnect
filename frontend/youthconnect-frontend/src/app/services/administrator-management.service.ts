import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdministratorAccount {
  administratorId: number;
  username: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface AdministratorUpdatePayload {
  username: string;
  email: string;
  active: boolean;
  password?: string;
}

export interface CreateAdministratorPayload {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdministratorManagementService {
  constructor(private http: HttpClient) {}

  getAdministrators(): Observable<AdministratorAccount[]> {
    return this.http.get<AdministratorAccount[]>('/api/administrator/administrators');
  }

  createAdministrator(payload: CreateAdministratorPayload): Observable<AdministratorAccount> {
    return this.http.post<AdministratorAccount>('/api/administrator/administrators', payload);
  }

  updateAdministratorStatus(administratorId: number, active: boolean): Observable<AdministratorAccount> {
    return this.http.patch<AdministratorAccount>(
      `/api/administrator/administrators/${administratorId}/status`,
      { active }
    );
  }

  updateAdministrator(administratorId: number, payload: AdministratorUpdatePayload): Observable<AdministratorAccount> {
    return this.http.put<AdministratorAccount>(`/api/administrator/administrators/${administratorId}`, payload);
  }

  deleteAdministrator(administratorId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/administrator/administrators/${administratorId}`);
  }
}
