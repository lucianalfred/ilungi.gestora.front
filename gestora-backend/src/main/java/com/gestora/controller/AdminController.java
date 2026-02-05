package com.gestora.controller;

import com.gestora.dto.InviteResponse;
import com.gestora.dto.InviteUserRequest;
import com.gestora.dto.UserDTO;
import com.gestora.model.User;
import com.gestora.service.NotificationService;
import com.gestora.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(
            users.stream()
                .map(UserDTO::of)
                .collect(Collectors.toList())
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody InviteUserRequest request) {
        try {
            InviteResponse response = userService.inviteUser(request);
            
            // Notify admin about new user creation
            String createdBy = SecurityContextHolder.getContext().getAuthentication().getName();
            notificationService.notifyUserCreated(response.getUser(), createdBy);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(user -> ResponseEntity.ok(UserDTO.of(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            
            // Notify admin about user update
            String updatedBy = SecurityContextHolder.getContext().getAuthentication().getName();
            notificationService.notifyAdmin(
                "Utilizador atualizado",
                String.format("O utilizador %s (%s) foi atualizado por %s", 
                    updatedUser.getName(), updatedUser.getEmail(), updatedBy)
            );
            
            return ResponseEntity.ok(UserDTO.of(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User user = userService.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            String userEmail = user.getEmail();
            userService.deleteUser(id);
            
            // Notify admin about user deletion
            String deletedBy = SecurityContextHolder.getContext().getAuthentication().getName();
            notificationService.notifyAdmin(
                "Utilizador eliminado",
                String.format("O utilizador %s foi eliminado por %s", userEmail, deletedBy)
            );
            
            return ResponseEntity.ok().body("Usuário deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
