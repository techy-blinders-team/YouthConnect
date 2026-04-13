import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskTrackerService } from '../../../services/task-tracker.service';
import { TaskResponse, TaskRequest, TaskEditRequest } from '../../../models/task.model';
import { Tasking, TaskStatus } from '../../../models/enums';

@Component({
  selector: 'app-task-tracker',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-tracker.html',
  styleUrl: './task-tracker.scss',
})
export class TaskTracker implements OnInit {
  private taskService = inject(TaskTrackerService);

  // State
  isModalOpen = false;
  isLoading = false;
  isEditing = false;
  currentEditingTaskId: number | null = null;
  successMessage = '';
  errorMessage = '';
  searchTerm = '';

  // Tasks data
  tasks: TaskResponse[] = [];
  filteredTasks: TaskResponse[] = [];

  // Form data
  formState = {
    taskingType: '',
    taskDescription: '',
    status: '',
    hyperlink: '',
  };

  // Admin info - get from localStorage or use default
  currentAdminId: number;
  currentSkOfficialName = 'SK Official';

  // Enums for template
  TaskStatus = TaskStatus;
  Tasking = Tasking;
  taskingOptions = Object.values(Tasking);
  taskStatusOptions = Object.values(TaskStatus);

  // Mock SK Official data (in production, fetch from backend)
  skOfficials: { [key: number]: string } = {
    1: 'John Doe',
    3: 'Michael Mosquito',
    4: 'Kirby Consultado'
  };

  constructor() {
    // Get adminId from localStorage (set during login) or default to 1
    const storedAdminId = localStorage.getItem('adminId');
    this.currentAdminId = storedAdminId ? parseInt(storedAdminId, 10) : 1;
    this.currentSkOfficialName = this.getSkOfficialName(this.currentAdminId);
  }

  ngOnInit() {
    this.loadTasks();
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
      status: task.status,
      hyperlink: task.hyperlink || '',
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
    this.isEditing = false;
    this.currentEditingTaskId = null;
  }

  resetForm() {
    this.formState = {
      taskingType: '',
      taskDescription: '',
      status: '',
      hyperlink: '',
    };
  }

  createTask() {
    if (!this.formState.taskingType || !this.formState.taskDescription || !this.formState.status) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    const request: TaskRequest = {
      adminId: this.currentAdminId,
      tasking: this.formState.taskingType as Tasking,
      taskDescription: this.formState.taskDescription,
      dueDate: undefined,
    };

    this.taskService.createTask(request).subscribe({
      next: (response) => {
        // If hyperlink provided, add it
        if (this.formState.hyperlink) {
          this.taskService.addHyperlink(response.taskId, { hyperlink: this.formState.hyperlink }).subscribe({
            next: (updatedTask) => {
              // Update task status if user selected something other than PENDING
              if (this.formState.status && this.formState.status !== TaskStatus.PENDING) {
                this.taskService.updateTaskStatus(updatedTask.taskId, this.formState.status as TaskStatus).subscribe({
                  next: (finalTask) => {
                    this.tasks.push(finalTask);
                    this.filteredTasks = this.tasks;
                    this.successMessage = 'Task created successfully';
                    setTimeout(() => this.successMessage = '', 3000);
                    this.closeModal();
                    this.loadTasks();
                  }
                });
              } else {
                this.tasks.push(updatedTask);
                this.filteredTasks = this.tasks;
                this.successMessage = 'Task created successfully';
                setTimeout(() => this.successMessage = '', 3000);
                this.closeModal();
                this.loadTasks();
              }
            },
            error: (error) => {
              console.error('Error adding hyperlink:', error);
              this.errorMessage = 'Task created but failed to add hyperlink';
            }
          });
        } else {
          // Update task status if user selected something other than PENDING
          if (this.formState.status && this.formState.status !== TaskStatus.PENDING) {
            this.taskService.updateTaskStatus(response.taskId, this.formState.status as TaskStatus).subscribe({
              next: (finalTask) => {
                this.tasks.push(finalTask);
                this.filteredTasks = this.tasks;
                this.successMessage = 'Task created successfully';
                setTimeout(() => this.successMessage = '', 3000);
                this.closeModal();
                this.loadTasks();
              }
            });
          } else {
            this.tasks.push(response);
            this.filteredTasks = this.tasks;
            this.successMessage = 'Task created successfully';
            setTimeout(() => this.successMessage = '', 3000);
            this.closeModal();
            this.loadTasks();
          }
        }
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.errorMessage = 'Failed to create task';
      }
    });
  }

  editTask() {
    if (!this.currentEditingTaskId) {
      this.errorMessage = 'Task ID not found';
      return;
    }

    if (!this.formState.taskingType || !this.formState.taskDescription) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    const taskId = this.currentEditingTaskId;
    const currentTask = this.tasks.find(t => t.taskId === taskId);
    const statusChanged = currentTask && (currentTask.status !== this.formState.status);
    const request: TaskEditRequest = {
      tasking: this.formState.taskingType as Tasking,
      taskDescription: this.formState.taskDescription,
      dueDate: undefined,
    };

    this.taskService.editTask(taskId, request).subscribe({
      next: (response) => {
        // If hyperlink provided, update it
        if (this.formState.hyperlink) {
          this.taskService.addHyperlink(taskId, { hyperlink: this.formState.hyperlink }).subscribe({
            next: (updatedTask) => {
              // Update status if it changed
              if (statusChanged && this.formState.status) {
                this.taskService.updateTaskStatus(taskId, this.formState.status as TaskStatus).subscribe({
                  next: (finalTask) => {
                    const index = this.tasks.findIndex(t => t.taskId === taskId);
                    if (index !== -1) {
                      this.tasks[index] = finalTask;
                      this.filteredTasks = this.tasks;
                    }
                    this.successMessage = 'Task updated successfully';
                    setTimeout(() => this.successMessage = '', 3000);
                    this.closeModal();
                  }
                });
              } else {
                const index = this.tasks.findIndex(t => t.taskId === taskId);
                if (index !== -1) {
                  this.tasks[index] = updatedTask;
                  this.filteredTasks = this.tasks;
                }
                this.successMessage = 'Task updated successfully';
                setTimeout(() => this.successMessage = '', 3000);
                this.closeModal();
              }
            },
            error: (error) => {
              console.error('Error adding hyperlink:', error);
              this.errorMessage = 'Task updated but failed to add hyperlink';
            }
          });
        } else {
          // Update status if it changed
          if (statusChanged && this.formState.status) {
            this.taskService.updateTaskStatus(taskId, this.formState.status as TaskStatus).subscribe({
              next: (finalTask) => {
                const index = this.tasks.findIndex(t => t.taskId === taskId);
                if (index !== -1) {
                  this.tasks[index] = finalTask;
                  this.filteredTasks = this.tasks;
                }
                this.successMessage = 'Task updated successfully';
                setTimeout(() => this.successMessage = '', 3000);
                this.closeModal();
              }
            });
          } else {
            const index = this.tasks.findIndex(t => t.taskId === taskId);
            if (index !== -1) {
              this.tasks[index] = response;
              this.filteredTasks = this.tasks;
            }
            this.successMessage = 'Task updated successfully';
            setTimeout(() => this.successMessage = '', 3000);
            this.closeModal();
          }
        }
      },
      error: (error) => {
        console.error('Error editing task:', error);
        this.errorMessage = 'Failed to update task';
      }
    });
  }

  saveTask() {
    if (this.isEditing) {
      this.editTask();
    } else {
      this.createTask();
    }
  }

  deleteTask(taskId: number) {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.taskId !== taskId);
        this.filteredTasks = this.tasks;
        this.successMessage = 'Task deleted successfully';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.errorMessage = 'Failed to delete task';
      }
    });
  }

  updateTaskStatus(taskId: number, newStatus: TaskStatus) {
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex(t => t.taskId === taskId);
        if (index !== -1) {
          this.tasks[index] = response;
          this.filteredTasks = this.tasks;
        }
        this.successMessage = `Task status updated to ${newStatus}`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.errorMessage = 'Failed to update task status';
      }
    });
  }

  getTaskingDisplayName(tasking: string): string {
    return tasking.replace(/_/g, ' ');
  }

  getSkOfficialName(adminId: number): string {
    return this.skOfficials[adminId] || 'Unknown SK Official';
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
