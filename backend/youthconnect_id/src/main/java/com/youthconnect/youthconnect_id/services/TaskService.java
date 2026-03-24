package com.youthconnect.youthconnect_id.services;

import java.util.List;

import com.youthconnect.youthconnect_id.dto.TaskEditRequest;
import com.youthconnect.youthconnect_id.dto.TaskHyperlinkRequest;
import com.youthconnect.youthconnect_id.dto.TaskRequest;
import com.youthconnect.youthconnect_id.dto.TaskResponse;
import com.youthconnect.youthconnect_id.enums.TaskStatus;

public interface TaskService {
    TaskResponse createTask(TaskRequest request);
    TaskResponse editTask(int taskId, TaskEditRequest request);
    void deleteTask(int taskId);
    List<TaskResponse> getAllTasks();
    TaskResponse updateTaskStatus(int taskId, TaskStatus status);
    TaskResponse addHyperlink(int taskId, TaskHyperlinkRequest request);
}