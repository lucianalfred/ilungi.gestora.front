package com.gestora.controller;

import com.gestora.dto.TaskDTO;
import com.gestora.model.Task;
import com.gestora.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(
            tasks.stream()
                .map(TaskDTO::of)
                .collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return taskService.findById(id)
            .map(task -> ResponseEntity.ok(TaskDTO.of(task)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Long userId = 1L; // Será obtido do authentication principal
            
            Task createdTask = taskService.createTask(task, userId);
            return ResponseEntity.ok(TaskDTO.of(createdTask));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar tarefa: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            return ResponseEntity.ok(TaskDTO.of(updatedTask));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(
        @PathVariable Long id,
        @RequestBody Task.TaskStatus status) {
        try {
            Task updatedTask = taskService.updateTaskStatus(id, status);
            return ResponseEntity.ok(TaskDTO.of(updatedTask));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok().body("Tarefa deletada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
