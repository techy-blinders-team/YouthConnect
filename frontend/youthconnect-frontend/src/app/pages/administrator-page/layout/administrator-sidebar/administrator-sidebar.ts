import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { AdminInfoService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-administrator-sidebar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './administrator-sidebar.html',
  styleUrl: './administrator-sidebar.scss',
})
export class AdministratorSidebar {
  authService = inject(AuthService);
  adminInfoService = inject(AdminInfoService);
  
  adminInfo$ = this.adminInfoService.adminInfo$;

  logout(): void {
    this.adminInfoService.clearAdminInfo();
    this.authService.logout();
  }
}
