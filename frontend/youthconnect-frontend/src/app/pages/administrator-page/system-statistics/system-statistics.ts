import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdministratorDashboardService, DashboardStatSummary } from '../../../services/administrator-dashboard.service';

@Component({
  selector: 'app-system-statistics',
  standalone: true,
  imports: [],
  templateUrl: './system-statistics.html',
  styleUrl: './system-statistics.scss',
})
export class SystemStatistics implements OnInit {
  eventStatistics: DashboardStatSummary = { total: 0, open: 0, completed: 0 };
  concernStatistics: DashboardStatSummary = { total: 0, open: 0, completed: 0 };
  taskStatistics: DashboardStatSummary = { total: 0, open: 0, completed: 0 };
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private dashboardService: AdministratorDashboardService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      events: this.dashboardService.getEventStatistics(),
      concerns: this.dashboardService.getConcernStatistics(),
      tasks: this.dashboardService.getTaskStatistics()
    }).subscribe({
      next: ({ events, concerns, tasks }) => {
        this.eventStatistics = events;
        this.concernStatistics = concerns;
        this.taskStatistics = tasks;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load system statistics right now.';
        this.isLoading = false;
      }
    });
  }

}
