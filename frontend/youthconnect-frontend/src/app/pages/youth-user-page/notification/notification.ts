import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationResponse } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class NotificationPage implements OnInit {
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  activeFilter: 'all' | 'unread' = 'all';
  notifications: NotificationResponse[] = [];
  isLoading = false;
  errorMessage = '';
  youthId: number = 0;
  readNotifications: Set<number> = new Set();

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.youthId) {
      this.youthId = user.youthId;
      this.loadReadNotificationsFromStorage();
      this.loadNotifications();
    } else {
      this.errorMessage = 'Unable to load user information';
    }
  }

  loadReadNotificationsFromStorage(): void {
    const storageKey = `readNotifications_${this.youthId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const readIds = JSON.parse(stored);
        this.readNotifications = new Set(readIds);
      } catch (error) {
        console.error('Error loading read notifications from storage:', error);
      }
    }
  }

  saveReadNotificationsToStorage(): void {
    const storageKey = `readNotifications_${this.youthId}`;
    const readIds = Array.from(this.readNotifications);
    localStorage.setItem(storageKey, JSON.stringify(readIds));
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotificationsByYouthId(this.youthId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.errorMessage = 'Failed to load notifications';
        this.isLoading = false;
      }
    });
  }

  get filteredNotifications(): NotificationResponse[] {
    if (this.activeFilter === 'unread') {
      return this.notifications.filter(n => !this.isRead(n));
    }
    return this.notifications;
  }

  setFilter(filter: 'all' | 'unread') {
    this.activeFilter = filter;
  }

  isRead(notification: NotificationResponse): boolean {
    return this.readNotifications.has(notification.updateId);
  }

  markAsRead(notification: NotificationResponse) {
    if (!this.isRead(notification)) {
      this.readNotifications.add(notification.updateId);
      this.saveReadNotificationsToStorage();
    }
  }

  getNotificationColor(index: number): 'red' | 'blue' | 'yellow' {
    const colors: ('red' | 'blue' | 'yellow')[] = ['red', 'blue', 'yellow'];
    return colors[index % 3];
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
