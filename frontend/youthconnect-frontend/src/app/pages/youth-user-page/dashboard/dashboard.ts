import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  userName = 'John Doe';
  userEmail = 'johndoe@gmail.com';

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.email) {
      this.userEmail = user.email;
      // Extract name from email (before @) as a fallback
      const emailName = user.email.split('@')[0];
      // Convert email name to readable format (e.g., john.doe -> John Doe)
      this.userName = emailName
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
  }

  stats = [
    { label: 'My Concern', value: 0 },
    { label: 'Up coming events', value: 0 },
    { label: 'Events Joined', value: 0 },
    { label: 'Resolved Concern', value: 0 }
  ];

  upcomingEvents = [
    { title: 'Sample Event' },
    { title: 'Sample Event' },
    { title: 'Sample Event' },
    { title: 'Sample Event' },
    { title: 'Sample Event' }
  ];

  notifications = [
    { message: 'Sample Notification' },
    { message: 'Sample Notification' },
    { message: 'Sample Notification' },
    { message: 'Sample Notification' },
    { message: 'Sample Notification' },
    { message: 'Sample Notification' }
  ];

  notificationFilter: 'all' | 'unread' = 'all';

  createConcern() {
    this.router.navigate(['/youth/create-concern']);
  }

  browseEvents() {
    this.router.navigate(['/youth/events']);
  }

  viewEvent(event: any) {
    console.log('View event:', event);
  }

  setNotificationFilter(filter: 'all' | 'unread') {
    this.notificationFilter = filter;
  }
}
