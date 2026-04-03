import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  administratorId?: number;
  email?: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<AdminLoginResponse> {
    const request: AdminLoginRequest = {
      email: email,
      password: password
    };
    return this.http.post<AdminLoginResponse>('/api/admin/auth/administrator/login', request);
  }
}
