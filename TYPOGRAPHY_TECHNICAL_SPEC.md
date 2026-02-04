# 📋 Resumo Técnico: Tipografia, Espaçamento e Pesos

## 🔤 Tipografia - Valores Reais do Sistema

### Tamanhos de Fonte Usados
```
11px   - Labels uppercase (text-[11px])
12px   - Texto pequeno (via body 14px sm)
13px   - Links/botões pequenos (text-[13px])
14px   - Botões padrão, corpo (text-base, text-[14px])
15px   - Logotipo (text-[15px])
16px   - Botões CTA (text-[16px]), subtítulo
18px   - Subtítulos (text-lg)
20px   - Parágrafo grande (text-[20px])
24px   - Estatísticas (text-2xl)
28px   - Subtítulos grandes (text-3xl)
32px   - Títulos principais (text-2xl mobile → text-5xl desktop)
48px   - Hero title desktop (lg:text-5xl)
```

### Pesos de Fonte em Uso
```
400   - Padrão, placeholder (não explícito)
500   - Texto corpo (font-medium)
600   - Semibold (font-semibold) - raro
700   - Bold (font-bold) - botões, subtítulos
900   - Black (font-black) - títulos, labels UPPERCASE
```

### Relação com Tailwind CSS
| Tailwind | Peso | Usado para |
|----------|------|-----------|
| `font-medium` | 500 | Parágrafo, descrição |
| `font-semibold` | 600 | Raro, alguns títulos |
| `font-bold` | 700 | Botões, labels, subtítulos |
| `font-black` | 900 | Títulos principais, H1-H3, labels |

---

## 📏 Espaçamento - Padrões Reais

### Padding (Interno)
```
px-1 py-1     = 4px (mínimo)
px-2 py-2     = 8px (gap-2)
px-3 py-2     = 12px × 8px (botão pequeno)
px-4 py-2     = 16px × 8px
px-5 py-5     = 20px (inputs)
px-6 py-5     = 24px × 20px (form)
px-8 py-4     = 32px × 16px (botão padrão)
px-10 py-4    = 40px × 16px (botão CTA mobile)
px-14 py-5    = 56px × 20px (botão CTA desktop)
pl-14         = 56px esquerda (input com ícone)
pr-6          = 24px direita (input)
```

### Margin/Gap (Externo)
```
gap-1   = 4px
gap-2   = 8px
gap-3   = 12px
gap-4   = 16px
gap-6   = 24px
gap-8   = 32px
gap-12  = 48px

mt-1    = 4px
mt-1.5  = 6px
mb-2    = 8px
mb-6    = 24px
mt-12   = 48px
```

### Padrão Grid Base
- Base: 8px × 8px
- Múltiplos: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px
- **Nunca**: usar valores random como 13px, 18px (a menos que seja text-[13px])

---

## 🎯 Tracking (Espaçamento de Letras)

### Valores Tailwind Usados
```
tracking-tighter  = -0.025em  (títulos densos)
tracking-tight    = -0.015em  (títulos)
(normal)          = 0         (padrão)
tracking-wide     = 0.05em    (raro)
tracking-widest   = 0.3em     (labels UPPERCASE)
```

### Padrão de Uso
- **UPPERCASE labels**: tracking-widest obrigatório
- **Títulos (h1-h3)**: tracking-tight ou tracking-tighter
- **Parágrafo**: normal (sem tracking)
- **Small text**: normal

---

## 🔗 Combinações Comuns (Copy-Paste)

### Título Principal (H1)
```tsx
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 leading-[1.05] tracking-tight"
```

### Subtítulo (H2)
```tsx
className="text-lg font-black text-slate-900 leading-none capitalize tracking-tight"
```

### Label de Form
```tsx
className="text-[11px] font-black uppercase text-emerald-400 tracking-widest"
```

### Botão Padrão
```tsx
className="px-8 py-4 rounded-2xl font-bold text-[14px] transition-all"
```

### Botão CTA
```tsx
className="px-10 sm:px-14 py-4 sm:py-5 rounded-full text-[16px] font-bold uppercase tracking-widest"
```

### Input
```tsx
className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 focus:border-emerald-500 text-white rounded-2xl font-bold"
```

### Parágrafo
```tsx
className="text-base sm:text-lg lg:text-[20px] text-slate-500 font-medium leading-relaxed"
```

### Small Text
```tsx
className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
```

---

## 📊 Comparação com Documentação

| Aspecto | DESIGN_SYSTEM.md | App.tsx Real | Status |
|---------|-----------------|-------------|--------|
| Cores primárias | ✅ #10b981 | ✅ #10b981 | **SINCRONIZADO** |
| Pesos de fonte | ✅ 900, 700, 500 | ✅ 900, 700, 500 | **SINCRONIZADO** |
| Tamanhos texto | ✅ 11px-5xl | ✅ 11px-5xl | **SINCRONIZADO** |
| Espaçamento | ✅ 8px grid | ✅ 8px grid | **SINCRONIZADO** |
| Tracking | ✅ widest, tight | ✅ widest, tight | **SINCRONIZADO** |
| Border-radius | ✅ 4px, 8px, 16px | ✅ rounded-lg, rounded-2xl | **SINCRONIZADO** |
| Transições | ✅ 150ms, 300ms | ✅ transition-all | **SINCRONIZADO** |

---

## 🚀 Próximos Passos

1. ✅ **Tipografia, espaçamento e pesos já estão documentados**
2. ✅ **Valores reais do código estão mapeados**
3. ✅ **DESIGN_SYSTEM.md atualizado com exactidão**
4. ⏳ **Expandir componentes específicos (tabelas, modais, etc)**
5. ⏳ **Criar Storybook para componentes**

---

**Última atualização**: 4 de Fevereiro de 2026
**Versão**: 2.1.1
**Mantido por**: GestoraPro Design System
