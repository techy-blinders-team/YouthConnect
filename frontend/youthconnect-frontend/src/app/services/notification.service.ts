import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface NotificationResponse {
    updateId: number;
    concernId?: number;
    concernTitle?: string;
    updateText: string;
    updatedByAdminName: string;
    createdAt: string;
    // Event notification fields
    eventId?: number;
    eventTitle?: string;
    eventDate?: string;
    eventLocation?: string;
    notificationType: 'concern' | 'event';
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/notifications';
    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient) { }

    getNotificationsByYouthId(youthId: number): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(`${this.apiUrl}/youth/${youthId}`);
    }

    getEventNotifications(): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(`${this.apiUrl}/events`);
    }

    getAllNotifications(youthId: number): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(`${this.apiUrl}/all/${youthId}`);
    }

    updateUnreadCount(count: number): void {
        this.unreadCountSubject.next(count);
    }

    getUnreadCount(): number {
        return this.unreadCountSubject.value;
    }
}
