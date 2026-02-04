package com.gestora.repository;

import com.gestora.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    @Query("SELECT t FROM Task t WHERE t.assignedUser.id = :userId OR t.createdBy.id = :userId")
    List<Task> findUserTasks(Long userId);
    
    List<Task> findByCreatedById(Long userId);
    List<Task> findByAssignedUserId(Long userId);
}
