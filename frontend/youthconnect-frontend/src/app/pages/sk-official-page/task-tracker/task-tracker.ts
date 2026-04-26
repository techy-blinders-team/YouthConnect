import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskTrackerService } from '../../../services/task-tracker.service';
import { TaskResponse, TaskRequest, TaskEditRequest } from '../../../models/task.model';
import { Tasking, TaskStatus } from '../../../models/enums';
import { SkOfficialManagementService } from '../../../services/sk-official-management.service';

@Component({
  selector: 'app-task-tracker',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-tracker.html',
  styleUrl: './task-tracker.scss',
})
export class TaskTracker implements OnInit {
  private taskService = inject(TaskTrackerService);
  private skOfficialService = inject(SkOfficialManagementService);

  // State
  isModalOpen = false;
  isDetailsModalOpen = false;
  isLoading = false;
  isEditing = false;
  currentEditingTaskId: number | null = null;
  successMessage = '';
  errorMessage = '';
  searchTerm = '';
  selectedTask: TaskResponse | null = null;

  // Tasks data
  tasks: TaskResponse[] = [];
  filteredTasks: TaskResponse[] = [];

  // Form data
  formState = {
    taskingType: '',
    taskDescription: '',
    skIncharge: '',
    hyperlink: '',
    status: '',
    dueDate: '',
    customStatus: '',
  };

  // Admin info - get from localStorage or use default
  currentAdminId: number;
  skOfficialName = 'SK Official';
  skOfficialEmail = '';
  skOfficialPosition = 'SK Official';
  skOfficialInitials = 'SK';

  // Enums for template
  TaskStatus = TaskStatus;
  Tasking = Tasking;
  taskingOptions = Object.values(Tasking);
  taskStatusOptions = Object.values(TaskStatus);

  // Toast notifications
  notifications: { id: number; message: string; type: 'success' | 'error' }[] = [];
  private notificationCounter = 0;
  isEditConfirmationModalOpen = false;
  pendingEditPayload: any = null;
  isDeleteConfirmationModalOpen = false;
  pendingDeleteTaskId: number | null = null;
  pendingDeleteTaskTitle: string = '';

  constructor() {
    const storedAdminId = localStorage.getItem('sk_official_id') || localStorage.getItem('adminId');
    this.currentAdminId = storedAdminId ? parseInt(storedAdminId, 10) : 0;
  }

  ngOnInit() {
    this.loadSkOfficialProfile();
    this.loadTasks();
  }

  loadSkOfficialProfile() {
    const fallbackName = localStorage.getItem('sk_official_name') || 'SK Official';
    const fallbackEmail = localStorage.getItem('sk_official_email') || '';
    const currentAdminId = Number(localStorage.getItem('sk_official_id') || localStorage.getItem('adminId'));

    this.skOfficialName = fallbackName;
    this.skOfficialEmail = fallbackEmail;
    this.skOfficialInitials = this.getInitials(fallbackName);

    this.skOfficialService.getSkOfficials().subscribe({
      next: (officials) => {
        const matched = officials.find((official) => official.adminId === currentAdminId)
          || officials.find((official) => official.email === fallbackEmail);

        if (!matched) {
          return;
        }

        this.currentAdminId = matched.adminId;
        this.skOfficialName = `${matched.firstName} ${matched.lastName}`.trim();
        this.skOfficialEmail = matched.email;
        this.skOfficialInitials = this.getInitials(this.skOfficialName);
        localStorage.setItem('adminId', matched.adminId.toString());
        localStorage.setItem('sk_official_id', matched.adminId.toString());
        localStorage.setItem('sk_official_name', this.skOfficialName);
        localStorage.setItem('sk_official_email', matched.email);
      },
      error: (error) => {
        console.error('Error loading SK Official profile:', error);
      }
    });
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.errorMessage = 'Failed to load tasks';
        this.isLoading = false;
      }
    });
  }

  searchTasks(term: string) {
    this.searchTerm = term;
    if (!term.trim()) {
      this.filteredTasks = this.tasks;
      return;
    }

    const lowerTerm = term.toLowerCase();
    this.filteredTasks = this.tasks.filter(task =>
      task.taskDescription?.toLowerCase().includes(lowerTerm) ||
      task.tasking?.toLowerCase().includes(lowerTerm) ||
      task.hyperlink?.toLowerCase().includes(lowerTerm)
    );
  }

  openModal() {
    this.isEditing = false;
    this.currentEditingTaskId = null;
    this.resetForm();
    this.isModalOpen = true;
  }

  openEditModal(task: TaskResponse) {
    this.isEditing = true;
    this.currentEditingTaskId = task.taskId;
    this.formState = {
      taskingType: task.tasking,
      taskDescription: task.taskDescription || '',
      skIncharge: task.skIncharge || '',
      hyperlink: task.hyperlink || '',
      status: task.status,
      dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
      customStatus: task.status === 'CUSTOM' ? task.status : '',
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
    this.isEditing = false;
    this.currentEditingTaskId = null;
  }

  openDetailsModal(task: TaskResponse) {
    this.selectedTask = task;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
    this.selectedTask = null;
  }

  resetForm() {
    this.formState = {
      taskingType: '',
      taskDescription: '',
      skIncharge: '',
      hyperlink: '',
      status: '',
      dueDate: '',
      customStatus: '',
    };
  }

  createTask() {
    if (!this.formState.taskingType || !this.formState.taskDescription || !this.formState.skIncharge || !this.formState.status) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    const request: TaskRequest = {
      adminId: this.currentAdminId,
      tasking: this.formState.taskingType as Tasking,
      taskDescription: this.formState.taskDescription,
      skIncharge: this.formState.skIncharge,
      hyperlink: this.formState.hyperlink || undefined,
      dueDate: this.formState.dueDate || undefined,
      status: this.formState.status as TaskStatus,
    };

    this.taskService.createTask(request).subscribe({
      next: (response) => {
        this.tasks.push(response);
        this.filteredTasks = [...this.tasks];
        this.showNotification('Task created successfully!');
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.errorMessage = 'Failed to create task';
      }
    });
  }

  closeEditConfirmationModal(): void {
    this.isEditConfirmationModalOpen = false;
    this.pendingEditPayload = null;
  }

  confirmEditSubmission(): void {
    if (!this.pendingEditPayload || !this.currentEditingTaskId) {
      return;
    }

    this.isLoading = true;

    const taskId = this.currentEditingTaskId;
    const request = this.pendingEditPayload as TaskEditRequest;

    this.taskService.editTask(taskId, request).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex(t => t.taskId === taskId);
        if (index !== -1) {
          this.tasks[index] = response;
          this.filteredTasks = [...this.tasks];
          
          // Update selected task if it's currently being viewed in details modal
          if (this.selectedTask && this.selectedTask.taskId === taskId) {
            this.selectedTask = response;
          }
        }
        this.showNotification('Task updated successfully!');
        this.isLoading = false;
        this.closeEditConfirmationModal();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.errorMessage = 'Failed to update task';
        this.isLoading = false;
      }
    });
  }

  closeDeleteConfirmationModal(): void {
    this.isDeleteConfirmationModalOpen = false;
    this.pendingDeleteTaskId = null;
    this.pendingDeleteTaskTitle = '';
  }

  confirmDeleteSubmission(): void {
    if (!this.pendingDeleteTaskId) {
      return;
    }

    this.isLoading = true;

    this.taskService.deleteTask(this.pendingDeleteTaskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.taskId !== this.pendingDeleteTaskId);
        this.filteredTasks = [...this.tasks];
        this.showNotification('Task deleted successfully!');
        this.isLoading = false;
        this.closeDeleteConfirmationModal();
        this.closeDetailsModal();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.errorMessage = 'Failed to delete task';
        this.isLoading = false;
      }
    });
  }

  saveTask() {
    if (this.isEditing) {
      // Show confirmation modal for edit
      if (!this.currentEditingTaskId) {
        this.errorMessage = 'Task ID not found';
        return;
      }

      if (!this.formState.taskingType || !this.formState.taskDescription || !this.formState.skIncharge || !this.formState.status) {
        this.errorMessage = 'Please fill in all required fields';
        return;
      }

      const request: TaskEditRequest = {
        tasking: this.formState.taskingType as Tasking,
        taskDescription: this.formState.taskDescription,
        skIncharge: this.formState.skIncharge,
        hyperlink: this.formState.hyperlink || undefined,
        dueDate: this.formState.dueDate || undefined,
        status: this.formState.status as TaskStatus,
      };

      this.pendingEditPayload = request;
      this.isEditConfirmationModalOpen = true;
    } else {
      this.createTask();
    }
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    const id = ++this.notificationCounter;
    this.notifications = [...this.notifications, { id, message, type }];

    setTimeout(() => {
      this.notifications = this.notifications.filter(notification => notification.id !== id);
    }, 3000);
  }

  deleteTask(taskId: number) {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (task) {
      this.pendingDeleteTaskId = taskId;
      this.pendingDeleteTaskTitle = this.getTaskingDisplayName(task.tasking);
      this.isDeleteConfirmationModalOpen = true;
    }
  }

  updateTaskStatus(taskId: number, newStatus: string) {
    this.taskService.updateTaskStatus(taskId, newStatus as TaskStatus).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex(t => t.taskId === taskId);
        if (index !== -1) {
          this.tasks[index] = response;
          this.filteredTasks = [...this.tasks];
          
          // Update selected task if it's currently being viewed in details modal
          if (this.selectedTask && this.selectedTask.taskId === taskId) {
            this.selectedTask = response;
          }
        }
        this.showNotification(`Task status updated to ${newStatus}`);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.errorMessage = 'Failed to update task status';
      }
    });
  }

  setAsInProgress(taskId: number) {
    this.updateTaskStatus(taskId, 'IN_PROGRESS');
  }

  getTaskingDisplayName(tasking: string): string {
    return tasking.replace(/_/g, ' ');
  }

  getSkOfficialName(adminId: number): string {
    if (adminId === this.currentAdminId) {
      return this.skOfficialName;
    }
    return `SK Official #${adminId}`;
  }

  getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) {
      return 'SK';
    }
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatDateForInput(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
