package com.gestora.controller;

import com.gestora.dto.InviteResponse;
import com.gestora.dto.InviteUserRequest;
import com.gestora.dto.UserDTO;
import com.gestora.model.User;
import com.gestora.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminUserController {

    @Autowired
    private UserService userService;

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
            // Validate required fields
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body("Email é obrigatório");
            }
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body("Nome é obrigatório");
            }
            
            InviteResponse response = userService.inviteUser(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao criar usuário: " + e.getMessage());
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
            return ResponseEntity.ok(UserDTO.of(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().body("Usuário deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        try {
            String role = body.get("role");
            if (role == null || role.isBlank()) {
                return ResponseEntity.badRequest().body("Role é obrigatório");
            }
            User user = userService.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
            user.setRole(userRole);
            userService.updateUser(id, user);
            return ResponseEntity.ok(UserDTO.of(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao alterar role: " + e.getMessage());
        }
    }
}
