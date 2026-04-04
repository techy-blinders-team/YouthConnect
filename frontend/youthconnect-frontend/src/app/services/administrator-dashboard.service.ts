import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface CountResponse {
  count: number;
}

interface StatusItem {
  status?: string | null;
}

export interface DashboardStatSummary {
  total: number;
  open: number;
  completed: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdministratorDashboardService {
  constructor(private http: HttpClient) {}

  private countByStatus(items: StatusItem[], completedStatuses: string[]): DashboardStatSummary {
    const normalizedCompletedStatuses = completedStatuses.map((value) => value.toUpperCase());
    const total = Array.isArray(items) ? items.length : 0;
    const completed = Array.isArray(items)
      ? items.filter((item) => normalizedCompletedStatuses.includes((item?.status ?? '').toUpperCase())).length
      : 0;

    return {
      total,
      completed,
      open: total - completed
    };
  }

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

  getEventStatistics(): Observable<DashboardStatSummary> {
    return this.http
      .get<StatusItem[]>('/api/administrator/events')
      .pipe(map((items) => this.countByStatus(items, ['Completed'])));
  }

  getConcernStatistics(): Observable<DashboardStatSummary> {
    return this.http
      .get<StatusItem[]>('/api/administrator/concerns')
      .pipe(map((items) => this.countByStatus(items, ['RESOLVED'])));
  }

  getTaskStatistics(): Observable<DashboardStatSummary> {
    return this.http
      .get<StatusItem[]>('/api/administrator/tasks')
      .pipe(map((items) => this.countByStatus(items, ['COMPLETED'])));
  }
}
