import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationResponse {
    updateId: number;
    concernId: number;
    concernTitle: string;
    updateText: string;
    updatedByAdminName: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/notifications';

    constructor(private http: HttpClient) { }

    getNotificationsByYouthId(youthId: number): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(`${this.apiUrl}/youth/${youthId}`);
    }
}
