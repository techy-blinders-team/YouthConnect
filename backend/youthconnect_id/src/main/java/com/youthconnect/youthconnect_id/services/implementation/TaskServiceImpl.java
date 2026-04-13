package com.youthconnect.youthconnect_id.services.implementation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.youthconnect.youthconnect_id.dto.TaskEditRequest;
import com.youthconnect.youthconnect_id.dto.TaskHyperlinkRequest;
import com.youthconnect.youthconnect_id.dto.TaskRequest;
import com.youthconnect.youthconnect_id.dto.TaskResponse;
import com.youthconnect.youthconnect_id.enums.TaskStatus;
import com.youthconnect.youthconnect_id.models.Task;
import com.youthconnect.youthconnect_id.repositories.TaskRepo;
import com.youthconnect.youthconnect_id.services.TaskService;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepo taskRepo;

    // ── Helper ────────────────────────────────────────────
    private TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setTaskId(task.getTaskId());
        response.setAdminId(task.getAdminId());
        response.setTasking(task.getTasking());
        response.setTaskDescription(task.getTaskDescription());
        response.setSkIncharge(task.getSkIncharge());
        response.setHyperlink(task.getHyperlink());
        response.setStatus(task.getStatus());
        response.setDueDate(task.getDueDate());
        response.setCreatedAt(task.getCreatedAt());
        return response;
    }

    // ── SK Official ───────────────────────────────────────
    @Override
    public TaskResponse createTask(TaskRequest request) {
        Task task = new Task();
        task.setAdminId(request.getAdminId());
        task.setTasking(request.getTasking());
        task.setTaskDescription(request.getTaskDescription());
        task.setSkIncharge(request.getSkIncharge());
        task.setHyperlink(request.getHyperlink());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());
        return toResponse(taskRepo.save(task));
    }

    @Override
    @Transactional
    public TaskResponse editTask(int taskId, TaskEditRequest request) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTasking(request.getTasking());
        task.setTaskDescription(request.getTaskDescription());
        task.setSkIncharge(request.getSkIncharge());
        task.setHyperlink(request.getHyperlink());
        task.setDueDate(request.getDueDate());
        return toResponse(taskRepo.save(task));
    }

    @Override
    public void deleteTask(int taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepo.delete(task);
    }

    @Override
    public List<TaskResponse> getAllTasks() {
        return taskRepo.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse updateTaskStatus(int taskId, TaskStatus status) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return toResponse(taskRepo.save(task));
    }

    @Override
    @Transactional
    public TaskResponse addHyperlink(int taskId, TaskHyperlinkRequest request) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setHyperlink(request.getHyperlink());
        return toResponse(taskRepo.save(task));
    }
}