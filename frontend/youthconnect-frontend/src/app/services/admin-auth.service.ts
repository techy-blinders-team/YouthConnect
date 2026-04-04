import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

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

export interface AdminInfo {
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

@Injectable({
  providedIn: 'root'
})
export class AdminInfoService {
  private adminInfoSubject = new BehaviorSubject<AdminInfo>({
    token: undefined,
    administratorId: undefined,
    email: undefined,
    username: undefined
  });
  adminInfo$ = this.adminInfoSubject.asObservable();

  setAdminInfo(info: AdminInfo): void {
    this.adminInfoSubject.next(info);
  }

  clearAdminInfo(): void {
    this.adminInfoSubject.next({
      token: undefined,
      administratorId: undefined,
      email: undefined,
      username: undefined
    });
  }
}
