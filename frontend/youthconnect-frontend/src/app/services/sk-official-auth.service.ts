import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SkOfficialLoginRequest {
  email: string;
  password: string;
}

export interface SkOfficialLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  adminId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SkOfficialAuthService {
  
  private apiUrl = 'https://sk183pasay.site/api/admin/auth';

  constructor(private http: HttpClient) { }

  login(request: SkOfficialLoginRequest): Observable<SkOfficialLoginResponse> {
    return this.http.post<SkOfficialLoginResponse>(`${this.apiUrl}/sk-official/login`, request);
  }
}
