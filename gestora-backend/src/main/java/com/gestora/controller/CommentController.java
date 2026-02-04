package com.gestora.controller;

import com.gestora.dto.CommentDTO;
import com.gestora.model.Comment;
import com.gestora.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getTaskComments(@PathVariable Long taskId) {
        List<Comment> comments = commentService.getTaskComments(taskId);
        return ResponseEntity.ok(
            comments.stream()
                .map(CommentDTO::of)
                .collect(Collectors.toList())
        );
    }

    @PostMapping
    public ResponseEntity<?> addComment(
        @PathVariable Long taskId,
        @RequestBody Map<String, String> payload) {
        try {
            String content = payload.get("content");
            Long userId = 1L; // Será obtido do authentication principal
            
            Comment comment = commentService.createComment(taskId, userId, content);
            return ResponseEntity.ok(CommentDTO.of(comment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao adicionar comentário: " + e.getMessage());
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
        @PathVariable Long taskId,
        @PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok().body("Comentário deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
