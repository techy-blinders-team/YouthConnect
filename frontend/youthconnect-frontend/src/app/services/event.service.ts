import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RsvpRequest {
    eventId: number;
    userId: number;
}

export interface EventResponse {
    eventId: number;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    createdByAdminId: number;
    status: string;
    createdAt: string;
    updatedAt?: string;
}

export interface AttendanceResponse {
    attendanceId: number;
    eventId: number;
    userId: number;
    isAttended: boolean;
    registeredAt: string;
    attendedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/events';

    getAllEvents(): Observable<EventResponse[]> {
        return this.http.get<EventResponse[]>(this.apiUrl);
    }

    getEventById(eventId: number): Observable<EventResponse> {
        return this.http.get<EventResponse>(`${this.apiUrl}/${eventId}`);
    }

    rsvpEvent(request: RsvpRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/rsvp`, request, { responseType: 'text' });
    }

    cancelRsvp(eventId: number, userId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${eventId}/rsvp/${userId}`, { responseType: 'text' });
    }

    getOwnRsvps(userId: number): Observable<AttendanceResponse[]> {
        return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/rsvp/user/${userId}`);
    }
}
