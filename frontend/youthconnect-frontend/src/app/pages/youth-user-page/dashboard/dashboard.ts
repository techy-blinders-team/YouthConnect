import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  userName = 'John Doe';
  userEmail = 'johndoe@gmail.com';

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

  constructor(private router: Router) { }

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
