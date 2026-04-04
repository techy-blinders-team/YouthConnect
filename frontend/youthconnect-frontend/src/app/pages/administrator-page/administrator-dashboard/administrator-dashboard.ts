import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SystemStatistics } from '../system-statistics/system-statistics';
import { AdministratorDashboardService } from '../../../services/administrator-dashboard.service';

@Component({
  selector: 'app-administrator-dashboard',
  standalone: true,
  imports: [SystemStatistics],
  templateUrl: './administrator-dashboard.html',
  styleUrl: './administrator-dashboard.scss',
})
export class AdministratorDashboard implements OnInit {
  administratorCount = 0;
  skOfficialCount = 0;
  youthMemberCount = 0;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private dashboardService: AdministratorDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
  }

  private loadDashboardCounts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      administrators: this.dashboardService.getAdministratorCount(),
      skOfficials: this.dashboardService.getSkOfficialCount(),
      youthMembers: this.dashboardService.getYouthMemberCount()
    }).subscribe({
      next: ({ administrators, skOfficials, youthMembers }) => {
        this.administratorCount = administrators;
        this.skOfficialCount = skOfficials;
        this.youthMemberCount = youthMembers;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load dashboard counts right now.';
        this.isLoading = false;
      }
    });
  }

}
