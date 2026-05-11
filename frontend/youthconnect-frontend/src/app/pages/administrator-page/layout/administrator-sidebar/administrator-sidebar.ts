import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { AdminInfoService } from '../../../../services/admin-auth.service';

@Component({
  selector: 'app-administrator-sidebar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './administrator-sidebar.html',
  styleUrl: './administrator-sidebar.scss',
})
export class AdministratorSidebar {
  @Output() navigate = new EventEmitter<void>();

  router = inject(Router);
  authService = inject(AuthService);
  adminInfoService = inject(AdminInfoService);
  
  adminInfo$ = this.adminInfoService.adminInfo$;

  isRouteActive(path: string): boolean {
    return this.router.url === path;
  }

  handleNavigation(): void {
    this.navigate.emit();
  }

  logout(): void {
    this.adminInfoService.clearAdminInfo();
    this.authService.logout();
  }
}
