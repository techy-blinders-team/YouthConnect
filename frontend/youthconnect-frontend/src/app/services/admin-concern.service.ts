import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Concern {
  concernId: number;
  youthId: number;
  youthFirstName?: string;
  youthLastName?: string;
  typeOfConcern: 'PROJECT_CONCERN' | 'COMMUNITY_CONCERN' | 'SYSTEM_CONCERN';
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt?: string;
}

export interface ConcernUpdate {
  updateId: number;
  concernId: number;
  updatedByAdminId?: number;
  updateText: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

export interface AdminConcernUpdateRequest {
  adminId: number;
  updateText: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

@Injectable({
  providedIn: 'root'
})
export class AdminConcernService {
  private apiUrl = 'http://localhost:8080/api/admin/concerns';

  constructor(private http: HttpClient) {}

  getAllConcerns(): Observable<Concern[]> {
    return this.http.get<Concern[]>(this.apiUrl);
  }

  updateConcernStatus(concernId: number, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${concernId}/status?status=${status}`, {});
  }

  addConcernUpdate(concernId: number, request: AdminConcernUpdateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${concernId}/updates`, request, { responseType: 'text' });
  }

  getConcernUpdates(concernId: number): Observable<ConcernUpdate[]> {
    return this.http.get<ConcernUpdate[]>(`${this.apiUrl}/${concernId}/updates`);
  }
}
