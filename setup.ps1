# GESTORA - Setup Rápido (Windows PowerShell)

Write-Host "🚀 GESTORA - Setup Rápido" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale de https://nodejs.org" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ npm não encontrado." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# Criar .env se não existir
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Criando .env.local..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "⚠️  Edite .env.local com suas credenciais Gemini" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. npm run dev      - Executar em desenvolvimento"
Write-Host "2. npm run build    - Build para produção"
Write-Host "3. npm run preview  - Preview da build"
Write-Host ""
Write-Host "📚 Ver INTEGRATION_GUIDE.md para detalhes de integração com API" -ForegroundColor Cyan
Write-Host ""
