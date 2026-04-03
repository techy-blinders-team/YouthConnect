import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-administrator-sidebar',
  imports: [RouterLink],
  templateUrl: './administrator-sidebar.html',
  styleUrl: './administrator-sidebar.scss',
})
export class AdministratorSidebar {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
