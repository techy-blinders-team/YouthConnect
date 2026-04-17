import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConcernRequest {
    youthId: number;
    typeOfConcern: 'PROJECT_CONCERN' | 'COMMUNITY_CONCERN' | 'SYSTEM_CONCERN';
    title: string;
    description: string;
}

export interface ConcernUpdateRequest {
    typeOfConcern: 'PROJECT_CONCERN' | 'COMMUNITY_CONCERN' | 'SYSTEM_CONCERN';
    title: string;
    description: string;
}

export interface ConcernResponse {
    concernId: number;
    youthId: number;
    typeOfConcern: 'PROJECT_CONCERN' | 'COMMUNITY_CONCERN' | 'SYSTEM_CONCERN';
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    createdAt: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConcernService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/concerns';

    submitConcern(request: ConcernRequest): Observable<ConcernResponse> {
        return this.http.post<ConcernResponse>(this.apiUrl, request);
    }

    getOwnConcerns(youthId: number): Observable<ConcernResponse[]> {
        return this.http.get<ConcernResponse[]>(`${this.apiUrl}/youth/${youthId}`);
    }

    getConcernById(concernId: number): Observable<ConcernResponse> {
        return this.http.get<ConcernResponse>(`${this.apiUrl}/${concernId}`);
    }

    editConcern(concernId: number, request: ConcernUpdateRequest): Observable<ConcernResponse> {
        return this.http.put<ConcernResponse>(`${this.apiUrl}/${concernId}`, request);
    }

    deleteConcern(concernId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${concernId}`, { responseType: 'text' });
    }

    cancelConcern(concernId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${concernId}/cancel`, {}, { responseType: 'text' });
    }

    getAllConcernsForSkOfficial(): Observable<ConcernResponse[]> {
        return this.http.get<ConcernResponse[]>(`${this.apiUrl}`);
    }
}
