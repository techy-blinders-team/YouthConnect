import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, EventResponse } from '../../../services/event.service';
import { TaskTrackerService } from '../../../services/task-tracker.service';
import { ConcernService, ConcernResponse } from '../../../services/concern.service';
import { YouthMemberManagementService } from '../../../services/youth-member-management.service';
import { TaskResponse } from '../../../models/task.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private eventService = inject(EventService);
  private taskService = inject(TaskTrackerService);
  private concernService = inject(ConcernService);
  private youthService = inject(YouthMemberManagementService);

  // Counts
  youthMembersCount = 0;
  eventsCount = 0;
  concernsCount = 0;
  tasksCount = 0;

  // Data lists
  events: EventResponse[] = [];
  tasks: TaskResponse[] = [];
  concerns: ConcernResponse[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadYouthMembers();
    this.loadEvents();
    this.loadConcerns();
    this.loadTasks();
  }

  loadYouthMembers(): void {
    this.youthService.getUsers().subscribe({
      next: (users) => {
        this.youthMembersCount = users.length;
      },
      error: (err) => {
        console.error('Error loading youth members:', err);
        this.youthMembersCount = 0;
      }
    });
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (eventsList) => {
        this.events = eventsList;
        this.eventsCount = eventsList.length;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.events = [];
        this.eventsCount = 0;
      }
    });
  }

  loadConcerns(): void {
    this.concernService.getAllConcernsForSkOfficial().subscribe({
      next: (concernsList) => {
        this.concerns = concernsList;
        this.concernsCount = concernsList.length;
      },
      error: (err) => {
        console.error('Error loading concerns:', err);
        this.concerns = [];
        this.concernsCount = 0;
      }
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasksList) => {
        this.tasks = tasksList;
        this.tasksCount = tasksList.length;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.tasks = [];
        this.tasksCount = 0;
      }
    });
  }

  getEventDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getTaskDueDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getNotificationColor(index: number): string {
    const colors = ['red', 'blue', 'yellow', 'gray', 'green'];
    return colors[index % colors.length];
  }
}
