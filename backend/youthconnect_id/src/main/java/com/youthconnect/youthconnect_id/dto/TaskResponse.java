package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDateTime;

import com.youthconnect.youthconnect_id.enums.TaskStatus;
import com.youthconnect.youthconnect_id.enums.Tasking;

public class TaskResponse {
    private int taskId;
    private int adminId;
    private Tasking tasking;
    private String taskDescription;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private String hyperlink;

    public int getTaskId() {
        return taskId; 
    }
    public void setTaskId(int taskId) {
        this.taskId = taskId; 
    }
    public int getAdminId() {
        return adminId; 
    }
    public void setAdminId(int adminId) {
        this.adminId = adminId; 
    }
    public Tasking getTasking() {
        return tasking; 
    }
    public void setTasking(Tasking tasking) {
        this.tasking = tasking; 
    }
    public String getTaskDescription() {
        return taskDescription; 
    }
    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription; 
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
    public String getHyperlink() {
        return hyperlink; 
    }
    public void setHyperlink(String hyperlink) {
        this.hyperlink = hyperlink; 
    }
}