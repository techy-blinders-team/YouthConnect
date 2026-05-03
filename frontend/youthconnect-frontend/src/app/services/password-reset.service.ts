import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PasswordResetService {
    private baseUrl = 'http://localhost:8080/api/password-reset';

    constructor(private http: HttpClient) { }

    // Youth User Methods
    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/forgot-password`, { email });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
    }

    validateToken(token: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/validate-token?token=${token}`);
    }

    // SK Official Methods
    skOfficialForgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/sk-official/forgot-password`, { email });
    }

    skOfficialResetPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/sk-official/reset-password`, { token, newPassword });
    }

    skOfficialValidateToken(token: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/sk-official/validate-token?token=${token}`);
    }
}
