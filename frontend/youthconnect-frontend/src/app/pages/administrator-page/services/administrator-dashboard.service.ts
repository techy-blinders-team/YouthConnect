import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface CountResponse {
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdministratorDashboardService {
  constructor(private http: HttpClient) {}

  getAdministratorCount(): Observable<number> {
    return this.http
      .get<CountResponse>('/api/administrator/administrators/count')
      .pipe(map((response) => Number(response?.count ?? 0)));
  }

  getSkOfficialCount(): Observable<number> {
    return this.http
      .get<unknown[]>('/api/administrator/sk-officials')
      .pipe(map((items) => (Array.isArray(items) ? items.length : 0)));
  }

  getYouthMemberCount(): Observable<number> {
    return this.http
      .get<Array<{ roleId?: number }>>('/api/administrator/users')
      .pipe(
        map((items) => {
          if (!Array.isArray(items)) {
            return 0;
          }

          // roleId 1 is youth in the current backend role table.
          const youthMembers = items.filter((item) => item?.roleId === 1);
          return youthMembers.length;
        })
      );
  }
}