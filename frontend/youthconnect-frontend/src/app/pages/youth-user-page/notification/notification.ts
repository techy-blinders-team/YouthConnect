import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, NotificationResponse } from '../../../services/notification.service';
import { EventService, EventResponse } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class NotificationPage implements OnInit {
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private eventService = inject(EventService);
  private router = inject(Router);

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
    
    // Fetch both concern notifications and event notifications
    forkJoin({
      concernNotifications: this.notificationService.getNotificationsByYouthId(this.youthId),
      events: this.eventService.getAllEvents()
    }).subscribe({
      next: (result) => {
        // Combine concern notifications with event notifications
        const concernNotifs = result.concernNotifications;
        
        // Create event notifications for all new events
        const eventNotifs: NotificationResponse[] = result.events.map(event => ({
          updateId: event.eventId + 100000, // Offset to avoid ID collision
          eventId: event.eventId,
          eventTitle: event.title,
          eventDate: event.eventDate,
          eventLocation: event.location,
          updateText: `New event: ${event.title}`,
          updatedByAdminName: 'SK Official',
          createdAt: event.createdAt,
          notificationType: 'event' as const
        }));
        
        // Combine and sort by date (newest first)
        this.notifications = [...concernNotifs, ...eventNotifs].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        this.isLoading = false;
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.errorMessage = 'Failed to load notifications';
        this.isLoading = false;
      }
    });
  }

  updateUnreadCount(): void {
    const unreadCount = this.notifications.filter(n => !this.isRead(n)).length;
    this.notificationService.updateUnreadCount(unreadCount);
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
      this.updateUnreadCount();
    }
    
    // Navigate to event page if it's an event notification
    if (notification.notificationType === 'event' && notification.eventId) {
      // Store the event ID in session storage so the event page can highlight it
      sessionStorage.setItem('highlightEventId', notification.eventId.toString());
      this.router.navigate(['/youth/events']);
    }
  }

  getNotificationIcon(notification: NotificationResponse): string {
    if (notification.notificationType === 'event') {
      return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z';
    }
    return 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z';
  }

  getNotificationTitle(notification: NotificationResponse): string {
    if (notification.notificationType === 'event') {
      return `New Event: ${notification.eventTitle}`;
    }
    return `${notification.updatedByAdminName || 'SK Official'} replied to your concern`;
  }

  getNotificationSubtitle(notification: NotificationResponse): string {
    if (notification.notificationType === 'event') {
      const eventDate = new Date(notification.eventDate!);
      return `${eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${notification.eventLocation}`;
    }
    return `Re: ${notification.concernTitle}`;
  }

  getNotificationColor(notification: NotificationResponse): 'red' | 'blue' | 'yellow' {
    if (notification.notificationType === 'event') {
      return 'yellow';
    }
    const colors: ('red' | 'blue')[] = ['red', 'blue'];
    return colors[notification.updateId % 2];
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
