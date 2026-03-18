package com.youthconnect.youthconnect_id.models;

import java.time.LocalDateTime;

import com.youthconnect.youthconnect_id.enums.TaskPriority;
import com.youthconnect.youthconnect_id.enums.TaskStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbl_task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private int taskId;

    @Column(name = "assigned_to_admin_id", nullable = false)
    private int assignedToAdminId;

    @Column(name = "task_title", nullable = false, length = 200)
    private String taskTitle;

    @Column(name = "task_description", columnDefinition = "TEXT")
    private String taskDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_priority", nullable = false)
    private TaskPriority taskPriority = TaskPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status = TaskStatus.PENDING;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "admin_id", nullable = false)
    private int adminId;

    public Task() {}

    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }

    public int getAssignedToAdminId() {
        return assignedToAdminId;
    }

    public void setAssignedToAdminId(int assignedToAdminId) {
        this.assignedToAdminId = assignedToAdminId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public TaskPriority getTaskPriority() {
        return taskPriority;
    }

    public void setTaskPriority(TaskPriority taskPriority) {
        this.taskPriority = taskPriority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getAdminId() {
        return adminId;
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId;
    }
}
