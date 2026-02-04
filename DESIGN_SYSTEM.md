# 🎨 GestoraPro - Sistema de Design e Identidade Visual

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Componentes](#componentes)
5. [Layouts](#layouts)
6. [Espaçamento](#espaçamento)
7. [Animações](#animações)
8. [Responsividade](#responsividade)
9. [Estrutura de Código](#estrutura-de-código)

---

## 🎯 Visão Geral

**GestoraPro** é um sistema profissional de gestão de tarefas com identidade visual moderna, limpa e centrada em usabilidade corporativa.

### Princípios de Design
- ✅ **Simplicidade**: Interface intuitiva e sem ruído visual
- ✅ **Consistência**: Padrões visuais repetíveis em toda a aplicação
- ✅ **Acessibilidade**: Contraste adequado, tamanhos legíveis
- ✅ **Responsividade**: Funciona perfeitamente em todos os dispositivos
- ✅ **Eficiência**: Reduz fricção nas tarefas do usuário

---

## 🌈 Paleta de Cores

### Cores Primárias

```
┌─────────────────────────────────────────────────────────┐
│              VERDE ESMERALDA CORPORATIVO                │
│                                                         │
│  Cor Principal    #10b981  ████████████████████████  │
│  Primário Escuro  #059669  ████████████████████████  │
│  Primário Claro   #D1FAE5  ████████████████████████  │
│                                                         │
│  Uso: Botões CTA, Links, Headers, Destaques           │
└─────────────────────────────────────────────────────────┘
```

| Nome | Cor | Código HEX | RGB | Uso |
|------|-----|-----------|-----|-----|
| Primário | ![#10b981](https://via.placeholder.com/30/10b981/10b981) | `#10b981` | `16, 185, 129` | Botões, Links, Destaques |
| Primário Escuro | ![#059669](https://via.placeholder.com/30/059669/059669) | `#059669` | `5, 150, 105` | Hover, Estados Ativos |
| Primário Claro | ![#D1FAE5](https://via.placeholder.com/30/D1FAE5/D1FAE5) | `#D1FAE5` | `209, 250, 229` | Fundos de Destaque |

### Cores Neutras

| Nome | Cor | Código HEX | RGB | Uso |
|------|-----|-----------|-----|-----|
| Branco | ![#FFFFFF](https://via.placeholder.com/30/FFFFFF/FFFFFF?text=W) | `#FFFFFF` | `255, 255, 255` | Fundo Principal, Cards |
| Cinza Claro | ![#F3F4F6](https://via.placeholder.com/30/F3F4F6/F3F4F6) | `#F3F4F6` | `243, 244, 246` | Fundos Secundários |
| Cinza Médio | ![#E5E7EB](https://via.placeholder.com/30/E5E7EB/E5E7EB) | `#E5E7EB` | `229, 231, 235` | Bordas, Divisores |
| Cinza Escuro | ![#1F2937](https://via.placeholder.com/30/1F2937/1F2937) | `#1F2937` | `31, 41, 55` | Texto Principal |
| Cinza Leve | ![#6B7280](https://via.placeholder.com/30/6B7280/6B7280) | `#6B7280` | `107, 114, 128` | Texto Secundário |

### Cores de Status

| Status | Cor | Código HEX | RGB | Significado |
|--------|-----|-----------|-----|-------------|
| ✅ Aberto | ![#10b981](https://via.placeholder.com/30/10b981/10b981) | `#10b981` | `16, 185, 129` | Tarefas Abertas |
| 🔄 Em Progresso | ![#3b82f6](https://via.placeholder.com/30/3b82f6/3b82f6) | `#3b82f6` | `59, 130, 246` | Tarefas em Execução |
| 📋 Por Iniciar | ![#f59e0b](https://via.placeholder.com/30/f59e0b/f59e0b) | `#f59e0b` | `245, 158, 11` | Tarefas Pendentes |
| ✔️ Terminado | ![#6366f1](https://via.placeholder.com/30/6366f1/6366f1) | `#6366f1` | `99, 102, 241` | Tarefas Concluídas |
| ⏳ Atrasada | ![#f43f5e](https://via.placeholder.com/30/f43f5e/f43f5e) | `#f43f5e` | `244, 63, 94` | Tarefas Atrasadas |
| 🔒 Fechado | ![#0f172a](https://via.placeholder.com/30/0f172a/0f172a) | `#0f172a` | `15, 23, 42` | Tarefas Fechadas |

---

## 📝 Tipografia

### Escala Tipográfica (Valores Reais do Sistema)

| Nome | Tamanho | Peso | Classe Tailwind | Uso | Exemplos |
|------|---------|------|-----------------|-----|----------|
| **Display** | 28-48px | 900 (Black) | `text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black` | Landing page hero | "A gestão de atividades..." |
| **H1** | 24px | 900 (Black) | `text-2xl font-black` | Títulos principais | "GESTORA" |
| **H2** | 18px | 900 (Black) | `text-lg font-black` | Subseções, painéis | "Tarefas por Estado" |
| **H3** | 15px | 700 (Bold) | `text-base font-bold` | Subtítulos | Nomes de usuários |
| **Label** | 11px | 900 (Black) | `text-[11px] font-black uppercase tracking-widest` | Descrição de campo | "E-MAIL CORPORATIVO" |
| **Body** | 14px | 500/600 | `text-base font-medium` | Texto regular | Descrição de tarefa |
| **Small** | 12px | 500 | `text-sm font-medium` | Textos menores | Info, helper text |
| **Micro** | 10px | 700 | `text-[10px] font-bold` | Badges, labels | "SEGURANÇA ILUNGI" |
| **Micro Label** | 9px | 700 | `text-[9px] font-bold` | Subtítulo pequeno | "Professional Workflow" |
| **Button** | 14px | 700 (Bold) | `text-[14px] font-bold` | Botões padrão | "CRIAR TAREFA" |
| **Button CTA** | 16px | 700 (Bold) | `text-[16px] font-bold uppercase` | Botões de ação | "ENTRAR NO SISTEMA" |

### Font Stack (Implementado)

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Pesos de Fonte Utilizados

| Peso | Valor | Uso | Exemplo |
|------|-------|-----|---------|
| **Black** | 900 | Títulos, labels uppercase | `font-black` |
| **Bold** | 700 | Botões, subtítulos | `font-bold` |
| **Semibold** | 600 | Nomes, destaque | `font-semibold` |
| **Medium** | 500 | Texto padrão | `font-medium` |
| **Normal** | 400 | Placeholder, help text | (padrão) |

### Tracking (Espaçamento de Letras)

| Tipo | Valor | Uso |
|------|-------|-----|
| **Widest** | 0.3em / 0.35em | Labels, badges uppercase |
| **Wide** | 0.1em | Textos pequenos |
| **Tight** | -0.025em | Títulos |
| **Normal** | 0 | Padrão |

---

## 🧩 Componentes

### 1. Botões

**Botão Primário (CTA)**
```
┌────────────────────────────────────────────┐
│   ENVIAR AGORA           │  Tamanho: 14px
│                          │  Peso: Bold (700)
└────────────────────────────────────────────┘  Padding: 8px 32px (py-4 px-8)
                              Background: #10b981
                              Hover: #059669
                              Border-radius: 8px
                              Transição: 150ms
                              Tracking: normal
                              
   Em CTA (16px):            Tamanho: 16px
   ENTRAR NO SISTEMA         Uppercase
                              Tracking-widest
                              Padding: 16-20px (py-4 sm:py-5)
```

**Código Real:**
```tsx
// Button padrão
<button className="px-8 py-4 rounded-2xl font-bold text-[14px] transition-all">
  Enviar
</button>

// Button CTA
<button className="px-10 sm:px-14 py-4 sm:py-5 rounded-full text-[16px] font-bold uppercase tracking-widest">
  Entrar no Sistema
</button>
```

**Estados:**
- **Default**: `#10b981` | Peso 700
- **Hover**: `#059669` | Peso 700 | Transform -2px
- **Active**: `#047857`
- **Disabled**: `opacity-50` | Peso 700

#### Botão Secundário
```
Tamanho: 13px | Peso: Medium (500)
Padding: 8px 12px (px-3 py-2)
Background: Transparent
Border: 1px #E5E7EB
Hover: Background #F3F4F6
Border-radius: 8px
Text: #6B7280 → Hover: #1F2937
```

#### Botão Danger
```
Tamanho: 14px | Peso: Bold (700)
Padding: px-8 py-4
Background: #f43f5e
Hover: #e11d48 | Transform -2px
Border-radius: 8px
```

### 2. Cards

```
┌──────────────────────────────────────────────────────────┐
│                                     │
│  Título da Card                     │
│  ──────────────────────────────────  │
│                                     │
│  Conteúdo da card aqui              │
│  Com espaçamento consistente        │
│                                     │
│  [Botão 1]  [Botão 2]               │
│                                     │
└──────────────────────────────────────────────────────────┘

Background: #FFFFFF
Border: 1px #E5E7EB
Border-radius: 8px
Padding: 20px
Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
```

### 3. Inputs/Formulários

```
┌──────────────────────────────────────────────────────────┐
│ E-MAIL CORPORATIVO                      │  Label: 11px
├──────────────────────────────────────────────────────────┤  Font-weight: 900 (black)
│ [________________________________]       │  Tracking-widest
│                                         │  Input: 14px font-bold
│ Insira seu e-mail corporativo           │  Padding: pl-14 pr-6 py-5
└──────────────────────────────────────────────────────────┘

Código Real:
<label className="text-[11px] font-black uppercase text-emerald-400 tracking-widest">
  E-mail Corporativo
</label>
<input 
  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 
    focus:border-emerald-500 text-white rounded-2xl outline-none 
    transition-all font-bold" 
/>

Estados:
- Default: Border #E5E7EB | Padding py-5
- Focus: Border #10b981 | Shadow verde leve
- Error: Border #f43f5e
- Disabled: Background #F3F4F6 | Opacity 50%

Tamanho do Ícone: 20x20px (ícone à esquerda com pl-14)
Altura Total: ~48px (py-5 + border)
Border-radius: 16px (rounded-2xl)
```

### 4. Tabelas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Coluna 1        │ Coluna 2      │ Coluna 3  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Dado 1          │ Dado 2        │ Dado 3    │  ← Row (Hover: #F9FAFB)
├─────────────────────────────────────────────────────────────────────────────┤
│ Dado 1          │ Dado 2        │ Dado 3    │
├─────────────────────────────────────────────────────────────────────────────┤
│ Dado 1          │ Dado 2        │ Dado 3    │
└─────────────────────────────────────────────────────────────────────────────┘

Header: Background #F3F4F6, Bold, #1F2937
Rows: Alternadas #FFFFFF e #F9FAFB
Border: 1px #E5E7EB
Padding: 12px
```

### 5. Alertas/Toast

```
SUCESSO / ABERTO
┌─────────────────────────────────────────────────────────┐
│ ✅ Tarefa criada com sucesso!      │  Background: #D1FAE5
│                                    │  Border-left: 4px #10b981
│    Seu arquivo foi salvo            │  Text: #065F46
└─────────────────────────────────────────────────────────┘

AVISO / POR INICIAR
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Esta ação não pode ser desfeita  │  Background: #FEF3C7
│                                    │  Border-left: 4px #f59e0b
│    Tenha cuidado ao continuar       │  Text: #78350F
└─────────────────────────────────────────────────────────┘

ERRO / ATRASADO
┌─────────────────────────────────────────────────────────┐
│ ❌ Erro ao processar solicitação    │  Background: #FEE2E2
│                                    │  Border-left: 4px #f43f5e
│    Tente novamente mais tarde       │  Text: #7F1D1D
└─────────────────────────────────────────────────────────┘

INFO / EM PROGRESSO
┌─────────────────────────────────────────────────────────┐
│ ℹ️ Sua sessão expira em 5 minutos   │  Background: #DBEAFE
│                                    │  Border-left: 4px #3b82f6
│    Faça login novamente quando      │  Text: #1E40AF
└─────────────────────────────────────────────────────────┘
```

---

## 📐 Layouts

### Layout Principal (Dashboard)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  🏠 GESTORA Pro         🔍 Pesquisa  👤 ☀️ ⚙️        │  Header
├────────────────┬───────────────────────────────────────────────────────────┤
│              │                                      │
│ • Dashboard  │   DASHBOARD - PAINEL PRINCIPAL      │
│ • Tarefas    │   ───────────────────────────────────────────────────────  │
│ • Usuários   │                                      │
│ • Relatórios │   [Estatísticas]  [Gráficos]       │
│ • Logout     │                                      │
│              │   [Cards de Tarefas]                 │
│              │                                      │
└────────────────┴───────────────────────────────────────────────────────────┘

Estrutura:
- Header: Altura 64px, Background #0f172a (dark)
- Sidebar: Largura 200px, Background #F3F4F6
- Main: Flex 1, Background #FFFFFF
- Padding: 16px padrão
```

---

## 📏 Espaçamento

### Sistema de Espaçamento (8px Grid Base)

| Tamanho | Pixel | Classe Tailwind | Uso |
|---------|-------|-----------------|-----|
| **XS** | 4px | `gap-1` | Espaço mínimo entre elementos |
| **S** | 8px | `gap-2` / `p-2` | Espaçamento padrão |
| **M** | 16px | `gap-4` / `p-4` | Padding/Margin comum |
| **L** | 20px | - | Padding grande (custom) |
| **XL** | 24px | `gap-6` | Entre blocos/seções |
| **2XL** | 32px | `gap-8` | Espaço do container |
| **3XL** | 48px | `gap-12` | Entre grandes seções |

### Aplicação Prática no Sistema

| Elemento | Classe | Pixel | Descrição |
|----------|--------|-------|----------|
| **Button Horizontal** | `px-8 py-4` | H: 32px / V: 16px | Padding padrão |
| **Button CTA** | `px-10 sm:px-14 py-4 sm:py-5` | H: 40-56px / V: 16-20px | Botão destaque |
| **Button Pequeno** | `px-3 py-2` | H: 12px / V: 8px | Links, ações |
| **Card** | `p-4 sm:p-6` | 16-24px | Padding interno |
| **Input** | `px-6 py-5` | H: 24px / V: 20px | Form elements |
| **Form Label** | `ml-1` / `mt-1.5` | 4px / 6px | Espaço label-input |
| **Gap Vertical** | `gap-3` / `gap-4` | 12px / 16px | Entre itens linha |
| **Sidebar Padding** | `px-5 sm:px-8` | 20-32px | Espaço lateral |
| **Header Padding** | `px-5 sm:px-8` | 20-32px | Padding horizontal |
| **Container Margin** | `mx-auto max-w-6xl` | 100% com max | Centrado |

---

## ✨ Animações

### Transições Padrão

**Botão Hover:**
```css
button {
  transition: all 150ms ease;
  background-color: #10b981;
}
button:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16,185,129,0.3);
}
```

**Card Hover:**
```css
.card {
  transition: all 300ms ease-in-out;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(-4px);
}
```

### Durações de Transição

| Tipo | Duração | Easing | Uso |
|------|---------|--------|-----|
| Rápida | 150ms | ease | Hover de botões |
| Normal | 300ms | ease-in-out | Abrir/fechar modais |
| Lenta | 500ms | ease-in-out | Fade in/out de páginas |

---

## 📱 Responsividade

### Breakpoints

```typescript
const breakpoints = {
  xs: '320px',   // Mobile pequeno
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop pequeno
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Desktop grande
}
```

### Regras de Responsividade

| Tamanho | Teste em | Características |
|---------|----------|-----------------|
| **xs-sm** | 320-639px | Pilhas verticais, sem sidebar |
| **md** | 640-1023px | Sidebar recolhida, grid 2 colunas |
| **lg-2xl** | 1024px+ | Layout completo, grid 3+ colunas |

---

## � Guia de Tipografia Prático

### Variações de Tamanho (por contexto)

#### Landing Page (Hero)
```tsx
// Título principal
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-800">
  Título Principal
</h1>
// 32px (mobile) → 48px (desktop) | Weight: 900
// leading-[1.05] | tracking-tight

// Subtítulo
<p className="text-base sm:text-lg lg:text-[20px] text-slate-500 font-medium">
  Descrição do produto
</p>
// 16px (mobile) → 20px (desktop) | Weight: 500
// leading-relaxed
```

#### Dashboard
```tsx
// Seção título
<h2 className="text-lg font-black text-slate-900 leading-none capitalize tracking-tight">
  Tarefas por Estado
</h2>
// 18px | Weight: 900 | tracking-tight

// Estatística grande
<p className="text-2xl sm:text-3xl font-black text-slate-900">
  42
</p>
// 24-32px | Weight: 900
```

#### Formulário
```tsx
// Label de campo
<label className="text-[11px] font-black uppercase text-emerald-400 tracking-widest">
  E-MAIL CORPORATIVO
</label>
// 11px | Weight: 900 | UPPERCASE | tracking-widest

// Texto auxiliar
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
  Segurança ILUNGI
</span>
// 10px | Weight: 700 | UPPERCASE | tracking-widest
```

#### Elementos da UI
```tsx
// Nome de usuário
<p className="text-sm font-black text-slate-900">
  João Silva
</p>
// 14px | Weight: 900

// Cargo/Position
<p className="text-[10px] font-bold text-[#10b981] uppercase tracking-widest">
  GESTOR DE PROJETOS
</p>
// 10px | Weight: 700 | UPPERCASE | tracking-widest

// Link/Button secundário
<button className="text-sm font-bold text-slate-500 hover:text-slate-900">
  Clique aqui
</button>
// 14px | Weight: 700
```

### Padrão de Rastreamento (Tracking)

| Tipo | Valor | Usado em | Exemplo |
|------|-------|----------|---------|
| **tracking-widest** | 0.3em | Labels uppercase, badges | "E-MAIL CORPORATIVO" |
| **tracking-tighter** | -0.025em | Títulos densos | "GESTORA" no hero |
| **tracking-tight** | -0.015em | Títulos | "Tarefas por Estado" |
| **tracking-wide** | 0.05em | Texto pequeno | - |
| (normal) | 0 | Padrão | Descrições |

### Como Usar Cores

```typescript
// Tailwind (Recomendado)
<button className="bg-emerald-500 text-white hover:bg-emerald-600">
  Enviar
</button>

// CSS Inline
<div style={{ color: '#10b981', fontSize: '14px' }}>
  Texto em cor primária
</div>

// Estrutura atual do sistema
<Button variant="primary">Criar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="danger">Eliminar</Button>
```

### Estrutura de Pastas para Componentes

```
src/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Alert.tsx
│   └── Table.tsx
├── services/
│   ├── apiService.ts
│   ├── geminiService.ts
│   └── logger.ts
├── constants.ts      # Cores, textos, constantes
├── App.tsx
└── index.tsx
```

### Constantes de Cores (constants.ts)

```typescript
export const COLORS = {
  PRIMARY: '#10b981',
  PRIMARY_DARK: '#059669',
  PRIMARY_LIGHT: '#D1FAE5',
  
  NEUTRAL_WHITE: '#FFFFFF',
  NEUTRAL_LIGHT: '#F3F4F6',
  NEUTRAL_MEDIUM: '#E5E7EB',
  NEUTRAL_DARK: '#1F2937',
  NEUTRAL_GREY: '#6B7280',
  
  STATUS_OPEN: '#10b981',
  STATUS_PROGRESS: '#3b82f6',
  STATUS_PENDING: '#f59e0b',
  STATUS_CLOSED: '#6366f1',
  STATUS_OVERDUE: '#f43f5e',
  STATUS_ARCHIVED: '#0f172a',
  
  DANGER: '#f43f5e',
}

export const STATUS_COLORS = {
  OPEN: { bg: '#D1FAE5', text: '#065F46' },
  PROGRESS: { bg: '#DBEAFE', text: '#1E40AF' },
  PENDING: { bg: '#FEF3C7', text: '#78350F' },
  CLOSED: { bg: '#EDE9FE', text: '#4F46E5' },
  OVERDUE: { bg: '#FEE2E2', text: '#7F1D1D' },
  ARCHIVED: { bg: '#F3F4F6', text: '#1F2937' },
}
```

---

## ✅ Checklist de Consistência Visual

Ao criar novos componentes, verificar:

### Cores
- [ ] Primária: #10b981 (Emerald-500)
- [ ] Primária Escura: #059669 (Emerald-600) para hover
- [ ] Danger: #f43f5e (Rose-500)
- [ ] Info: #3b82f6 (Blue-500)
- [ ] Texto: #1F2937 (Gray-800)
- [ ] Neutros: #FFFFFF, #F3F4F6, #E5E7EB, #6B7280

### Tipografia
- [ ] Títulos principais: font-black (900) text-2xl→5xl
- [ ] Títulos secundários: font-black (900) text-lg→2xl
- [ ] Subtítulos: font-bold (700) text-base
- [ ] Labels: font-black (900) text-[11px] UPPERCASE tracking-widest
- [ ] Corpo: font-medium (500) text-base
- [ ] Botões: font-bold (700) text-[14px] ou text-[16px] CTA
- [ ] Texto pequeno: font-bold (700) text-[10px]

### Espaçamento
- [ ] Buttons padrão: px-8 py-4 (32px × 16px)
- [ ] Buttons CTA: px-10 sm:px-14 py-4 sm:py-5
- [ ] Inputs: pl-14 pr-6 py-5 (40px × 20px)
- [ ] Cards: p-4 sm:p-6 (16-24px)
- [ ] Gaps: gap-2 (8px), gap-3 (12px), gap-4 (16px), gap-6 (24px)
- [ ] Margins: mx-auto, mt-12, mb-6

### Componentes
- [ ] Componentes têm state visual (hover, active, disabled)
- [ ] Sombras: shadow-sm, shadow-2xl (não heavy)
- [ ] Border-radius: rounded-2xl (16px) ou rounded-lg (8px)
- [ ] Transições: transition-all 150ms (hover), 300ms (geral)
- [ ] Ícones: 20x20px, 22x22px ou 24x24px

### Acessibilidade & Responsividade
- [ ] Contraste de cor > 4.5:1 para texto
- [ ] Responsividade: sm:, md:, lg:, xl: breakpoints
- [ ] Mobile-first: padrão é mobile, depois expand
- [ ] Placeholder text: text-slate-500
- [ ] Focus states: border-emerald-500 com transição

### Tracking (Espaçamento de Letras)
- [ ] Labels UPPERCASE: tracking-widest (0.3em)
- [ ] Títulos: tracking-tight (-0.015em) ou tracking-tighter (-0.025em)
- [ ] Padrão: tracking-tight ou normal

---

## 🎭 Comparação com Design Systems Populares

| Aspecto | GestoraPro | Material Design | Bootstrap |
|--------|-----------|-----------------|-----------|
| Cor Primária | Verde #10b981 | Azul Material | Azul Bootstrap |
| Cor Secundária | Cinza/Slate | Múltiplas | Cinza |
| Espaçamento | Grid 8px | Grid 4px | Grid 15px |
| Tipografia | Segoe UI | Roboto | System Font |
| Componentes | Personalizados | Extensivos | Clássicos |
| Foco | Corporativo Moderno | Material | Genérico |

---

## 📞 Dúvidas e Suporte

Para dúvidas sobre o design system, consulte:
- **Cores**: Secção "Paleta de Cores"
- **Componentes**: Secção "Componentes"
- **Responsividade**: Secção "Responsividade"
- **Animações**: Secção "Animações"

Última atualização: **2024** | Versão: **2.1.0**
