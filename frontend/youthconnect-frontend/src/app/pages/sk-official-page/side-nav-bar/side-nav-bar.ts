import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './side-nav-bar.html',
  styleUrl: './side-nav-bar.scss'
})
export class SideNavBar {
  private authService = inject(AuthService);
  isLoggingOut = false;

  logout(): void {
    this.isLoggingOut = true;
    
    setTimeout(() => {
      this.authService.logout();
    }, 1000);
  }
}