import { Tasking, TaskStatus } from './enums';

export interface TaskRequest {
  adminId: number;
  tasking: Tasking;
  taskDescription?: string;
  dueDate?: string; 
}

export interface TaskEditRequest {
  tasking: Tasking;
  taskDescription?: string;
  dueDate?: string;
}

export interface TaskHyperlinkRequest {
  hyperlink: string;
}

export interface TaskResponse {
  taskId: number;
  adminId: number;
  tasking: Tasking;
  taskDescription?: string;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
  hyperlink?: string;
}