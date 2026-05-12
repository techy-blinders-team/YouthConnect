import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskRequest, TaskEditRequest, TaskResponse, TaskHyperlinkRequest } from '../models/task.model';
import { TaskStatus } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class TaskTrackerService {
  private http = inject(HttpClient);
  private apiUrl = 'https://sk183pasay.site/api/sk/tasks';

  // Create a new task
  createTask(request: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, request);
  }

  // Get all tasks for the current SK official
  getAllTasks(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(this.apiUrl);
  }

  // Edit an existing task
  editTask(taskId: number, request: TaskEditRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${taskId}`, request);
  }

  // Delete a task
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`, { responseType: 'text' });
  }

  // Update task status
  updateTaskStatus(taskId: number, status: TaskStatus): Observable<TaskResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<TaskResponse>(`${this.apiUrl}/${taskId}/status`, null, { params });
  }

  // Add hyperlink to a task
  addHyperlink(taskId: number, request: TaskHyperlinkRequest): Observable<TaskResponse> {
    return this.http.patch<TaskResponse>(`${this.apiUrl}/${taskId}/hyperlink`, request);
  }
}
