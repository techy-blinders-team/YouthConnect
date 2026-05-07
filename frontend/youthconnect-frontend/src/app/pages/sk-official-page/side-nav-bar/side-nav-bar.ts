import { Component, inject, Output, EventEmitter } from '@angular/core';
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
  @Output() closeSidebar = new EventEmitter<void>();
  
  private authService = inject(AuthService);
  isLoggingOut = false;

  onLinkClick(): void {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth <= 768) {
      this.closeSidebar.emit();
    }
  }

  onCloseClick(): void {
    // Close sidebar when close button is clicked (only visible on mobile)
    this.closeSidebar.emit();
  }

  logout(): void {
    this.isLoggingOut = true;
    
    setTimeout(() => {
      this.authService.logout();
    }, 1000);
  }
}
