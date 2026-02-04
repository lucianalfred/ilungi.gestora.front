# Script de Setup Completo - Windows
# Execute como Administrator no PowerShell

Write-Host "🚀 GESTORA - Setup Completo" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Verificar se Java está instalado
Write-Host "`n📦 Verificando Java..." -ForegroundColor Yellow
$javaCheck = java -version 2>&1 | Select-String "version"
if ($javaCheck) {
    Write-Host "✅ Java instalado: $javaCheck" -ForegroundColor Green
} else {
    Write-Host "❌ Java não encontrado. Instale Java 11 ou superior." -ForegroundColor Red
    exit 1
}

# Verificar se Maven está instalado
Write-Host "`n📦 Verificando Maven..." -ForegroundColor Yellow
$mavenCheck = mvn -version 2>&1 | Select-String "Apache Maven"
if ($mavenCheck) {
    Write-Host "✅ Maven instalado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Maven não encontrado. Instale Maven ou use Maven Wrapper." -ForegroundColor Yellow
}

# Verificar se MySQL está rodando
Write-Host "`n📦 Verificando MySQL..." -ForegroundColor Yellow
try {
    $mysqlCheck = mysql -u root -e "SELECT 1" 2>&1
    Write-Host "✅ MySQL conectado" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MySQL não respondeu. Certifique-se que está rodando." -ForegroundColor Yellow
}

# Setup Frontend
Write-Host "`n🎨 Setup Frontend (React)" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

if (Test-Path "node_modules") {
    Write-Host "✅ node_modules já existe" -ForegroundColor Green
} else {
    Write-Host "📥 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

Write-Host "`n✅ Frontend pronto em: http://localhost:5173" -ForegroundColor Green

# Info Backend
Write-Host "`n☕ Setup Backend (Java Spring Boot)" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host @"
Passos para Backend:

1. Criar banco de dados MySQL:
   mysql -u root -p
   CREATE DATABASE gestora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;

2. Configurar application.yml:
   - Trocar username/password do MySQL
   - Trocar jwt.secret por algo seguro
   - URL do banco: jdbc:mysql://localhost:3306/gestora_db

3. Executar:
   mvn clean install
   mvn spring-boot:run

4. Acessar: http://localhost:8080/api

"@ -ForegroundColor Cyan

Write-Host "`n📋 Endpoints disponíveis:" -ForegroundColor Yellow
Write-Host @"
POST   /api/auth/login           - Fazer login
POST   /api/auth/register        - Registrar usuário
GET    /api/auth/me              - Usuário atual
GET    /api/tasks                - Listar tarefas
POST   /api/tasks                - Criar tarefa
PUT    /api/tasks/{id}           - Atualizar tarefa
PATCH  /api/tasks/{id}/status    - Mudar status
GET    /api/tasks/{id}/comments  - Comentários da tarefa
POST   /api/tasks/{id}/comments  - Adicionar comentário
"@ -ForegroundColor Green

Write-Host "`n🟢 SETUP COMPLETO!" -ForegroundColor Green
Write-Host "Para iniciar o frontend: npm run dev" -ForegroundColor Yellow
