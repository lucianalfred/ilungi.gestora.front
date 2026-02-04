package com.gestora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.gestora.model.Task;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private Long assignedUserId;
    private String assignedUserName;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer commentCount;

    public static TaskDTO of(Task task) {
        return TaskDTO.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus().name())
            .priority(task.getPriority().name())
            .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null)
            .assignedUserName(task.getAssignedUser() != null ? task.getAssignedUser().getName() : null)
            .dueDate(task.getDueDate())
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .commentCount(task.getComments() != null ? task.getComments().size() : 0)
            .build();
    }
}
