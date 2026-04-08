import { HttpClient } from '@angular/common/http';
import { Component, HostListener, inject } from '@angular/core';

interface SystemControlStatusResponse {
  databaseConnected: boolean;
  apiServerRunning: boolean;
  lastBackupAt: string | null;
}

@Component({
  selector: 'app-system-control',
  imports: [],
  templateUrl: './system-control.html',
  styleUrl: './system-control.scss',
})
export class SystemControl {
  private http = inject(HttpClient);

  databaseConnected = false;
  apiServerRunning = false;
  frontendRunning = typeof navigator !== 'undefined' ? navigator.onLine : true;
  lastBackupAt: string | null = null;

  constructor() {
    this.loadSystemStatus();
  }

  get databaseStatusLabel(): string {
    return this.databaseConnected ? 'Connected' : 'Disconnected';
  }

  get apiStatusLabel(): string {
    return this.apiServerRunning ? 'Running' : 'Stopped';
  }

  get frontendStatusLabel(): string {
    return this.frontendRunning ? 'Running' : 'Stopped';
  }

  @HostListener('window:online')
  onBrowserOnline(): void {
    this.frontendRunning = true;
  }

  @HostListener('window:offline')
  onBrowserOffline(): void {
    this.frontendRunning = false;
  }

  get lastBackupLabel(): string {
    if (!this.lastBackupAt) {
      return 'No backup yet';
    }

    const parsedDate = new Date(this.lastBackupAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'No backup yet';
    }

    return parsedDate.toLocaleString('en-US');
  }

  private loadSystemStatus(): void {
    this.http.get<SystemControlStatusResponse>('/api/administrator/system-control/status').subscribe({
      next: (response) => {
        this.databaseConnected = !!response.databaseConnected;
        this.apiServerRunning = !!response.apiServerRunning;
        this.lastBackupAt = response.lastBackupAt;
      },
      error: () => {
        this.databaseConnected = false;
        this.apiServerRunning = false;
        this.lastBackupAt = null;
      }
    });
  }

}
