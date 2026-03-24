package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDateTime;

import com.youthconnect.youthconnect_id.enums.Tasking;

public class TaskEditRequest {
    private Tasking tasking;
    private String taskDescription;
    private LocalDateTime dueDate;

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
    public LocalDateTime getDueDate() {
        return dueDate; 
    }
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate; 
    }
}