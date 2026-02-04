-- Script SQL para criar banco de dados GESTORA
-- Execute com: mysql -u root -p < gestora_db.sql

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS gestora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestora_db;

-- Tabela Users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role ENUM('ADMIN', 'EMPLOYEE', 'MANAGER') DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    status ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED') DEFAULT 'TODO',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    assigned_user_id BIGINT,
    created_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    due_date DATETIME,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_assigned_user (assigned_user_id),
    INDEX idx_created_by (created_by_id),
    FULLTEXT INDEX idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela Comments
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_task (task_id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela Task_Participants (muitos-para-muitos)
CREATE TABLE IF NOT EXISTS task_participants (
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela Activities (auditoria)
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message LONGTEXT,
    type ENUM('TASK_ASSIGNED', 'COMMENT_ADDED', 'STATUS_CHANGED', 'DEADLINE_NEAR', 'INFO') DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuários de teste
INSERT INTO users (email, password, name, role) VALUES
('admin@gestora.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeS86E36P4/tsO', 'Administrador', 'ADMIN'),
('gerente@gestora.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeS86E36P4/tsO', 'Gerente', 'MANAGER'),
('usuario@gestora.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeS86E36P4/tsO', 'Usuário', 'EMPLOYEE');

-- Inserir tarefas de teste
INSERT INTO tasks (title, description, status, priority, assigned_user_id, created_by_id) VALUES
('Implementar autenticação', 'Implementar sistema de login com JWT', 'COMPLETED', 'HIGH', 2, 1),
('Integração com API', 'Conectar frontend com backend', 'IN_PROGRESS', 'HIGH', 2, 1),
('Testes unitários', 'Escrever testes para todos os endpoints', 'TODO', 'MEDIUM', 3, 1),
('Documentação', 'Documentar API e endpoints', 'TODO', 'MEDIUM', 3, 1);

-- Inserir participantes nas tarefas
INSERT INTO task_participants (task_id, user_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2),
(3, 1), (3, 3),
(4, 1), (4, 2);

-- Inserir comentários de teste
INSERT INTO comments (task_id, user_id, content) VALUES
(1, 1, 'Ótimo trabalho! Autenticação implementada com sucesso.'),
(1, 2, 'Obrigado! Testei todas as funcionalidades.'),
(2, 2, 'Começando integração agora'),
(2, 1, 'Me mande um relatório quando terminar');

-- Inserir atividades de teste
INSERT INTO activities (user_id, action, entity_type, entity_id, description) VALUES
(1, 'CREATE_TASK', 'Task', 1, 'Criou tarefa de autenticação'),
(1, 'CREATE_TASK', 'Task', 2, 'Criou tarefa de integração'),
(2, 'UPDATE_STATUS', 'Task', 1, 'Mudou status para COMPLETED'),
(2, 'ADD_COMMENT', 'Comment', 1, 'Adicionou comentário na tarefa 1'),
(3, 'ASSIGN_TASK', 'Task', 3, 'Foi atribuído à tarefa 3');

-- Inserir notificações de teste
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(2, 'Nova tarefa atribuída', 'Você foi atribuído à tarefa: Implementar autenticação', 'TASK_ASSIGNED', TRUE),
(3, 'Novo comentário', 'Novo comentário na tarefa: Testes unitários', 'COMMENT_ADDED', FALSE),
(2, 'Status alterado', 'A tarefa Integração com API foi mudada para IN_PROGRESS', 'STATUS_CHANGED', TRUE);

-- Mostrar dados inseridos
SELECT 'Banco de dados criado com sucesso!' as Status;
SELECT CONCAT('Total de usuários: ', COUNT(*)) FROM users;
SELECT CONCAT('Total de tarefas: ', COUNT(*)) FROM tasks;
SELECT CONCAT('Total de comentários: ', COUNT(*)) FROM comments;

-- Fim do script
