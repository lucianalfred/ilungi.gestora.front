#!/bin/bash
# GESTORA - Quick Setup Script

echo "🚀 GESTORA - Setup Rápido"
echo "========================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale de https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"
echo "✅ npm $(npm -v) encontrado"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar .env se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando .env.local..."
    cp .env.example .env.local
    echo "⚠️  Edite .env.local com suas credenciais Gemini"
fi

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Próximos passos:"
echo "1. npm run dev      - Executar em desenvolvimento"
echo "2. npm run build    - Build para produção"
echo "3. npm run preview  - Preview da build"
echo ""
echo "📚 Ver INTEGRATION_GUIDE.md para detalhes de integração com API"
echo ""
