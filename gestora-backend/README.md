# 🎯 GESTORA Backend - Setup Completo

## 📂 Estrutura Criada

```
d:\gestoraPro SEM BACK\gestora-backend/
├── pom.xml                                      (Maven config)
├── src/
│   ├── main/
│   │   ├── java/com/gestora/
│   │   │   ├── GestorProApplication.java       (Main class)
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java         (Spring Security)
│   │   │   │   └── JwtTokenProvider.java       (JWT tokens)
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java         (Login/Register)
│   │   │   │   ├── TaskController.java         (CRUD Tasks)
│   │   │   │   ├── CommentController.java      (Comments)
│   │   │   │   └── UserController.java         (Users - Admin)
│   │   │   ├── model/
│   │   │   │   ├── User.java                   (Entity)
│   │   │   │   ├── Task.java                   (Entity)
│   │   │   │   └── Comment.java                (Entity)
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java         (JPA)
│   │   │   │   ├── TaskRepository.java         (JPA)
│   │   │   │   └── CommentRepository.java      (JPA)
│   │   │   ├── service/
│   │   │   │   ├── UserService.java            (Business logic)
│   │   │   │   ├── TaskService.java            (Business logic)
│   │   │   │   └── CommentService.java         (Business logic)
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── LoginResponse.java
│   │   │   │   ├── UserDTO.java
│   │   │   │   ├── TaskDTO.java
│   │   │   │   └── CommentDTO.java
│   │   │   └── security/
│   │   │       ├── CustomUserDetailsService.java
│   │   │       ├── JwtAuthenticationFilter.java
│   │   │       └── UserPrincipal.java
│   │   └── resources/
│   │       └── application.yml                 (Config)
│   └── test/
└── README.md
```

## ✅ Arquivos Criados (21 arquivos Java + XML + YML)

### Configuração
- ✅ pom.xml
- ✅ application.yml

### Entities (Models)
- ✅ User.java
- ✅ Task.java
- ✅ Comment.java

### Repositories (JPA)
- ✅ UserRepository.java
- ✅ TaskRepository.java
- ✅ CommentRepository.java

### Services (Lógica de Negócio)
- ✅ UserService.java
- ✅ TaskService.java
- ✅ CommentService.java

### Controllers (REST API)
- ✅ AuthController.java (Login/Register)
- ✅ TaskController.java (CRUD Tasks)
- ✅ CommentController.java (Comments)
- ✅ UserController.java (Users - Admin only)

### DTOs (Data Transfer)
- ✅ LoginRequest.java
- ✅ LoginResponse.java
- ✅ UserDTO.java
- ✅ TaskDTO.java
- ✅ CommentDTO.java

### Security
- ✅ SecurityConfig.java (Spring Security setup)
- ✅ JwtTokenProvider.java (Token generation)
- ✅ CustomUserDetailsService.java (User details)
- ✅ JwtAuthenticationFilter.java (JWT filter)
- ✅ UserPrincipal.java (Principal implementation)

### Main
- ✅ GestorProApplication.java (Spring Boot main)

---

## 🚀 Como Usar

### Passo 1: Instalar Dependências
```bash
cd "d:\gestoraPro SEM BACK\gestora-backend"
mvn clean install
```

### Passo 2: Criar Banco de Dados
```bash
# Execute o script SQL na pasta do frontend:
mysql -u root -p < "d:\gestoraPro SEM BACK\gestoraPro\gestora_db.sql"
```

### Passo 3: Configurar application.yml
```bash
# Abra o arquivo e configure:
# d:\gestoraPro SEM BACK\gestora-backend\src\main\resources\application.yml

# Trocar:
# - spring.datasource.username (seu usuário MySQL)
# - spring.datasource.password (sua senha MySQL)
# - jwt.secret (trocar por algo único)
```

### Passo 4: Executar Backend
```bash
mvn spring-boot:run
```

Ou execute via IDE (IntelliJ/Eclipse):
```
Right-click GestorProApplication.java → Run
```

**Resultado:** Backend rodando em http://localhost:8080/api ✅

---

## 📊 Endpoints Disponíveis

### Autenticação
```
POST   /api/auth/login              - Fazer login
POST   /api/auth/register           - Registrar usuário
GET    /api/auth/me                 - Usuário atual
```

### Tarefas
```
GET    /api/tasks                   - Listar todas
POST   /api/tasks                   - Criar tarefa
GET    /api/tasks/{id}              - Obter tarefa
PUT    /api/tasks/{id}              - Atualizar tarefa
PATCH  /api/tasks/{id}/status       - Mudar status
DELETE /api/tasks/{id}              - Deletar tarefa
```

### Comentários
```
GET    /api/tasks/{taskId}/comments        - Listar
POST   /api/tasks/{taskId}/comments        - Criar
DELETE /api/tasks/{taskId}/comments/{id}   - Deletar
```

### Usuários (Admin Only)
```
GET    /api/users                   - Listar usuários
GET    /api/users/{id}              - Obter usuário
PUT    /api/users/{id}              - Atualizar
DELETE /api/users/{id}              - Deletar
```

---

## 🔑 Credenciais de Teste

| Email | Senha | Rol |
|-------|-------|-----|
| admin@gestora.com | senha123 | ADMIN |
| gerente@gestora.com | senha123 | MANAGER |
| usuario@gestora.com | senha123 | EMPLOYEE |

---

## 🧪 Testar API

### Via cURL (Windows PowerShell)
```powershell
# Login
$headers = @{ "Content-Type" = "application/json" }
$body = @{ email = "admin@gestora.com"; password = "senha123" } | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST -Headers $headers -Body $body
```

### Via Postman
1. Abrir Postman
2. Importar collection de QUICK_START.md
3. Testar endpoints

---

## ⚙️ Configurações Importantes

### application.yml
```yaml
# Database
spring.datasource.url: jdbc:mysql://localhost:3306/gestora_db
spring.datasource.username: root
spring.datasource.password: sua_senha_aqui

# JWT
jwt.secret: sua_chave_secreta_muito_segura_aqui
jwt.expiration: 86400000  # 24 horas

# Server
server.port: 8080
server.servlet.context-path: /api
```

---

## 📁 Localização

**Backend criado em:**
```
d:\gestoraPro SEM BACK\gestora-backend\
```

**Abrir em IDE:**
- IntelliJ: File → Open → Selecionar pasta `gestora-backend`
- Eclipse: File → Open Projects from File System

---

## 🔧 Troubleshooting

### Maven não reconhece Java
```bash
# Verificar versão Java
java -version

# Deve ser Java 11 ou superior
# Se não tiver: instale de https://www.oracle.com/java/technologies/
```

### Erro de Conexão MySQL
```bash
# Verificar se MySQL está rodando
mysql -u root -p

# Se não conectar:
# 1. Iniciar MySQL Service
# 2. Trocar credenciais em application.yml
```

### Porta 8080 em uso
```bash
# Mudar porta em application.yml:
server:
  port: 8081
```

---

## ✅ Próximos Passos

1. ✅ Estrutura criada (pronto!)
2. ⏭️ Executar `mvn clean install`
3. ⏭️ Configurar `application.yml`
4. ⏭️ Executar `mvn spring-boot:run`
5. ⏭️ Testar endpoints

---

## 📞 Referência

- Frontend: `d:\gestoraPro SEM BACK\gestoraPro`
- Backend: `d:\gestoraPro SEM BACK\gestora-backend`
- Database Script: `d:\gestoraPro SEM BACK\gestoraPro\gestora_db.sql`
- Documentação: Veja arquivos *.md na pasta frontend

---

**Status:** ✅ Estrutura completa criada  
**Data:** 2026-02-03  
**Pronto para:** Build com Maven  
