import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav-bar.html',
  styleUrl: './side-nav-bar.scss'
})
export class SideNavBar {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}