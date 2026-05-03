import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface PendingUser {
    userId: number;
    youthId: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    status: string;
    createdAt: string;
}

export interface ApprovalResponse {
    success: boolean;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserApprovalService {
    private http = inject(HttpClient);
    private readonly apiUrl = '/api/admin/users';

    getPendingUsers(): Observable<PendingUser[]> {
        return this.http.get<PendingUser[]>(`${this.apiUrl}/pending`);
    }

    approveUser(userId: number, adminId?: number): Observable<ApprovalResponse> {
        const body = adminId ? { adminId } : {};
        return this.http.post<ApprovalResponse>(`${this.apiUrl}/${userId}/approve`, body);
    }

    rejectUser(userId: number, reason: string): Observable<ApprovalResponse> {
        return this.http.post<ApprovalResponse>(`${this.apiUrl}/${userId}/reject`, { reason });
    }
}
