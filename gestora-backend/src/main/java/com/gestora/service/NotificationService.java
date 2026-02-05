package com.gestora.service;

import com.gestora.dto.UserDTO;
import com.gestora.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String adminEmail;

    // In-memory notification storage for real-time notifications
    private final ConcurrentLinkedQueue<SystemNotification> notifications = new ConcurrentLinkedQueue<>();

    public NotificationService(JavaMailSender mailSender,
                               @Value("${spring.mail.username:}") String fromAddress,
                               @Value("${app.admin.email:}") String adminEmail) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress == null ? "" : fromAddress.trim();
        this.adminEmail = adminEmail == null ? "" : adminEmail.trim();
    }

    /**
     * Send notification to admin via email
     */
    public void notifyAdmin(String subject, String message) {
        if (adminEmail.isEmpty()) {
            logger.warn("Admin email not configured. Notification: {} - {}", subject, message);
            addNotification("ADMIN", subject, message);
            return;
        }

        if (fromAddress.isEmpty()) {
            logger.warn("Email not configured. Admin notification: {} - {}", subject, message);
            addNotification("ADMIN", subject, message);
            return;
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromAddress);
            mailMessage.setTo(adminEmail);
            mailMessage.setSubject("[GESTORA] " + subject);
            mailMessage.setText(buildAdminNotificationEmail(subject, message));

            mailSender.send(mailMessage);
            logger.info("Admin notification sent: {}", subject);
            addNotification("ADMIN", subject, message);
        } catch (Exception e) {
            logger.error("Failed to send admin notification: {}", e.getMessage());
            addNotification("ADMIN", subject, message);
        }
    }

    /**
     * Notify admin about user creation
     */
    public void notifyUserCreated(UserDTO user, String createdBy) {
        String subject = "Novo usuário criado";
        String message = String.format(
            "O utilizador '%s' (%s) foi criado por %s com a função %s",
            user.getName(), user.getEmail(), createdBy, user.getRole()
        );
        notifyAdmin(subject, message);
    }

    /**
     * Notify admin about task status change
     */
    public void notifyTaskStatusChanged(String taskTitle, String oldStatus, String newStatus, String changedBy) {
        String subject = "Tarefa alterada";
        String message = String.format(
            "A tarefa '%s' mudou de '%s' para '%s' por %s",
            taskTitle, oldStatus, newStatus, changedBy
        );
        notifyAdmin(subject, message);
    }

    /**
     * Notify admin about task assignment
     */
    public void notifyTaskAssigned(String taskTitle, String assignee, String assignedBy) {
        String subject = "Tarefa atribuída";
        String message = String.format(
            "A tarefa '%s' foi atribuída a %s por %s",
            taskTitle, assignee, assignedBy
        );
        notifyAdmin(subject, message);
    }

    /**
     * Notify admin about user login
     */
    public void notifyUserLogin(String userEmail) {
        String subject = "Utilizador fez login";
        String message = String.format("O utilizador %s fez login no sistema", userEmail);
        notifyAdmin(subject, message);
    }

    /**
     * Add notification to in-memory store
     */
    public void addNotification(String type, String title, String message) {
        notifications.add(new SystemNotification(type, title, message, LocalDateTime.now()));
        // Keep only last 100 notifications
        while (notifications.size() > 100) {
            notifications.poll();
        }
    }

    /**
     * Get all notifications
     */
    public List<SystemNotification> getNotifications() {
        List<SystemNotification> list = new ArrayList<>();
        notifications.forEach(list::add);
        return list;
    }

    /**
     * Get unread notifications count
     */
    public int getUnreadCount() {
        return notifications.size();
    }

    private String buildAdminNotificationEmail(String subject, String message) {
        return String.format(
            "=== NOTIFICAÇÃO DO SISTEMA GESTORA ===\n\n" +
            "Assunto: %s\n" +
            "Data: %s\n\n" +
            "Mensagem:\n%s\n\n" +
            "---\n" +
            "Sistema GESTORA - Gestão de Tarefas",
            subject, LocalDateTime.now(), message
        );
    }

    /**
     * System notification model
     */
    public static class SystemNotification {
        private String type;
        private String title;
        private String message;
        private LocalDateTime timestamp;
        private boolean read = false;

        public SystemNotification(String type, String title, String message, LocalDateTime timestamp) {
            this.type = type;
            this.title = title;
            this.message = message;
            this.timestamp = timestamp;
        }

        // Getters
        public String getType() { return type; }
        public String getTitle() { return title; }
        public String getMessage() { return message; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public boolean isRead() { return read; }
        public void setRead(boolean read) { this.read = read; }
    }
}
