import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  message: string;
  color: 'red' | 'blue' | 'yellow';
  isRead: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class NotificationPage {
  activeFilter: 'all' | 'unread' = 'all';

  notifications: Notification[] = [
    {
      id: 1,
      title: 'The official replied to you concern',
      message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      color: 'red',
      isRead: false,
      timestamp: new Date()
    },
    {
      id: 2,
      title: 'The official replied to you concern',
      message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      color: 'blue',
      isRead: true,
      timestamp: new Date()
    },
    {
      id: 3,
      title: 'The official replied to you concern',
      message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      color: 'yellow',
      isRead: false,
      timestamp: new Date()
    }
  ];

  get filteredNotifications(): Notification[] {
    if (this.activeFilter === 'unread') {
      return this.notifications.filter(n => !n.isRead);
    }
    return this.notifications;
  }

  setFilter(filter: 'all' | 'unread') {
    this.activeFilter = filter;
  }

  markAsRead(notification: Notification) {
    notification.isRead = true;
    console.log('Notification marked as read:', notification);
    // TODO: Call API to mark notification as read
  }
}
