# Guia de Espaçamento e Estilos — Geekfy

> Documento para quem precisa ajustar espaçamentos, margens e paddings nas páginas do projeto. Não é preciso ser expert em CSS — explicamos tudo com exemplos reais do código do Geekfy.

---

## 1. A Regra de Ouro: JSX ≠ HTML

No React/Next.js, **não podemos usar `style` como no HTML puro**. A sintaxe é diferente e se você errar, a página quebra com erro.

### ❌ Errado (HTML puro — NÃO funciona no React)

```jsx
<p style="padding-top: 8px; margin-bottom: 16px;">
  Texto aqui
</p>
```

Se fizer isso, vai aparecer um erro vermelho no terminal dizendo:
> *"The `style` prop expects a mapping from style properties to values, not a string."*

### ✅ Correto (JSX — funciona no React)

```jsx
<p style={{ paddingTop: '8px', marginBottom: '16px' }}>
  Texto aqui
</p>
```

### As 4 diferenças pra decorar

| HTML puro | JSX (React) |
|---|---|
| Aspas simples: `style="..."` | Chaves duplas: `style={{ ... }}` |
| Propriedade com hífen: `padding-top` | camelCase: `paddingTop` |
| Separador: ponto-e-vírgula `;` | Separador: vírgula `,` |
| Valores direto: `8px` | Valores entre aspas: `'8px'` |

---

## 2. Quando Usar `style={{ }}` vs Classes Tailwind

O projeto usa **Tailwind CSS** para a maioria dos estilos (cores, fontes, bordas, tamanhos). Porém, para **espaçamentos finos** (margens e paddings entre elementos), o inline `style` pode ser mais confiável.

### Use `className` do Tailwind para:
- Cores: `className="bg-mauve text-text-primary"`
- Fontes: `className="font-display font-bold text-lg"`
- Bordas: `className="rounded-card border border-lavendergrey/10"`
- Layout: `className="flex gap-2 grid grid-cols-3"`
- Hover/transições: `className="hover:bg-blushpop transition-colors"`

### Use `style={{ }}` inline para:
- Espaçamento fino entre elementos (margens e paddings)
- Quando o Tailwind não aplica o espaçamento esperado
- Ajustes visuais rápidos que não justificam criar uma classe

### Pode misturar os dois no mesmo elemento:

```jsx
<h1
  className="font-display font-black text-3xl text-text-primary"
  style={{ marginBottom: '3px', paddingTop: '20px' }}
>
  Lojas Parceiras
</h1>
```

O `className` cuida da fonte e cor. O `style` cuida do espaçamento. Sem conflito.

---

## 3. Propriedades de Espaçamento Mais Usadas

### Margin (espaço **fora** do elemento — empurra os vizinhos)

| Propriedade JSX | O que faz | Exemplo |
|---|---|---|
| `marginTop` | Espaço acima | `style={{ marginTop: '12px' }}` |
| `marginBottom` | Espaço abaixo | `style={{ marginBottom: '8px' }}` |
| `marginLeft` | Espaço à esquerda | `style={{ marginLeft: '16px' }}` |
| `marginRight` | Espaço à direita | `style={{ marginRight: '16px' }}` |

### Padding (espaço **dentro** do elemento — empurra o conteúdo)

| Propriedade JSX | O que faz | Exemplo |
|---|---|---|
| `paddingTop` | Respiro interno acima | `style={{ paddingTop: '8px' }}` |
| `paddingBottom` | Respiro interno abaixo | `style={{ paddingBottom: '8px' }}` |
| `paddingLeft` | Respiro interno à esquerda | `style={{ paddingLeft: '16px' }}` |
| `paddingRight` | Respiro interno à direita | `style={{ paddingRight: '16px' }}` |

### Diferença visual entre margin e padding

```
┌─────────────────────────────────┐
│         MARGIN (fora)           │ ← Empurra outros elementos pra longe
│  ┌───────────────────────────┐  │
│  │      PADDING (dentro)     │  │ ← Dá respiro ao conteúdo interno
│  │  ┌─────────────────────┐  │  │
│  │  │    SEU CONTEÚDO     │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 4. Valores Recomendados para o Geekfy

Não existe regra absoluta, mas estes são os valores que funcionam bem no projeto:

| Situação | Valor sugerido | Exemplo real |
|---|---|---|
| Título → subtítulo (mesma seção) | `3px` a `4px` | `marginBottom: '3px'` |
| Subtítulo → próxima seção | `6px` a `8px` | `paddingBottom: '8px'` |
| Respiro em texto solto | `8px` | `paddingTop: '8px'` |
| Grupo de filtros → conteúdo | `10px` a `20px` | `marginBottom: '10px'` |
| Seção → seção | `20px` a `32px` | `marginTop: '24px'` |
| Topo da página (após barra de categorias) | `16px` a `24px` | `paddingTop: '20px'` |

**Dica:** comece com valores pequenos (4–8px) e vá aumentando até ficar bom visualmente. É mais fácil adicionar espaço do que tirar.

---

## 5. Exemplos Reais do Projeto

### Exemplo 1 — Página de Lojas (`app/lojas/page.tsx`)

Antes (tudo colado):
```jsx
<h1 className="font-display font-black text-3xl text-text-primary">
  Lojas Parceiras
</h1>
<p className="text-lavendergrey text-sm font-sans">
  1 loja encontrada
</p>
```

Depois (com respiro):
```jsx
<h1
  className="font-display font-black text-3xl text-text-primary"
  style={{ marginBottom: '3px', paddingTop: '20px' }}
>
  Lojas Parceiras
</h1>
<p
  className="text-lavendergrey text-sm font-sans"
  style={{ paddingTop: '8px', paddingBottom: '8px' }}
>
  1 loja encontrada
</p>
```

### Exemplo 2 — Linha de pílulas/filtros

Antes (colada no texto acima e no conteúdo abaixo):
```jsx
<div className="flex gap-2 overflow-x-auto">
```

Depois (com respiro acima e abaixo):
```jsx
<div
  className="flex gap-2 overflow-x-auto"
  style={{ marginTop: '6px', marginBottom: '10px', paddingBottom: '8px' }}
>
```

### Exemplo 3 — Card de login (`app/login/page.tsx`)

Para dar respiro dentro de um card, use `padding` no container:
```jsx
<div
  className="bg-white rounded-card shadow-xl max-w-md w-full"
  style={{ padding: '40px' }}
>
```

Ou se quiser mais controle vertical vs horizontal:
```jsx
<div
  className="bg-white rounded-card shadow-xl max-w-md w-full"
  style={{ paddingTop: '40px', paddingBottom: '40px', paddingLeft: '32px', paddingRight: '32px' }}
>
```

---

## 6. Múltiplas Propriedades no Mesmo `style`

Separe com **vírgula** (não ponto-e-vírgula):

```jsx
// ✅ Correto
style={{ marginTop: '12px', marginBottom: '8px', paddingLeft: '16px' }}

// ❌ Errado — vai dar erro de sintaxe
style={{ marginTop: '12px'; marginBottom: '8px' }}
```

---

## 7. Checklist Antes de Commitar Alterações de Espaçamento

- [ ] Salvei o arquivo e olhei no navegador (`npm run dev` rodando)?
- [ ] Testei em tela grande (desktop) E tela pequena (apertei F12 e ativei modo mobile)?
- [ ] Os textos não estão colados nos elementos acima/abaixo?
- [ ] O respiro não ficou grande demais (muito espaço vazio)?
- [ ] Se usei `style={{ }}`, conferi que está com chaves duplas e camelCase?
- [ ] Não quebrei nenhum outro componente da página?

---

## 8. Tabela de Conversão: Tailwind ↔ Inline Style

Se algum dia o Tailwind voltar a funcionar para espaçamentos, esta tabela ajuda a converter:

| Classe Tailwind | Equivalente Inline | Valor |
|---|---|---|
| `mt-1` | `marginTop: '4px'` | 4px |
| `mt-2` | `marginTop: '8px'` | 8px |
| `mt-4` | `marginTop: '16px'` | 16px |
| `mt-6` | `marginTop: '24px'` | 24px |
| `mt-8` | `marginTop: '32px'` | 32px |
| `mb-1` | `marginBottom: '4px'` | 4px |
| `mb-2` | `marginBottom: '8px'` | 8px |
| `mb-4` | `marginBottom: '16px'` | 16px |
| `mb-6` | `marginBottom: '24px'` | 24px |
| `py-2` | `paddingTop: '8px', paddingBottom: '8px'` | 8px |
| `py-4` | `paddingTop: '16px', paddingBottom: '16px'` | 16px |
| `px-4` | `paddingLeft: '16px', paddingRight: '16px'` | 16px |
| `p-4` | `padding: '16px'` | 16px em todos os lados |
| `p-8` | `padding: '32px'` | 32px em todos os lados |
| `gap-2` | `gap: '8px'` | 8px (só em flex/grid) |
| `gap-6` | `gap: '24px'` | 24px (só em flex/grid) |

> **Fórmula:** o número do Tailwind × 4 = pixels. Ex.: `mt-3` = 12px, `py-5` = 20px.

---

## 9. Erros Comuns e Como Resolver

### Erro: "The `style` prop expects a mapping from style properties to values"
**Causa:** Você usou `style="..."` (string HTML) em vez de `style={{ ... }}` (objeto JS).
**Solução:** Troque as aspas por chaves duplas e use camelCase.

### O espaçamento não aparece mesmo com `style={{ }}`
**Causa provável:** Outro elemento (pai ou filho) tem `overflow: hidden` ou `display` que esconde o espaçamento.
**Solução:** Tente usar `margin` em vez de `padding`, ou aplique o espaçamento no elemento pai.

### O Tailwind `py-2` não funciona mas `style={{ paddingTop: '8px' }}` funciona
**Causa provável:** Problema de cache do Turbopack (empacotador do Next.js).
**Solução:** Para espaçamentos, use `style={{ }}` inline. Para cores, fontes e layout, continue com Tailwind (essas classes funcionam normalmente).

---

*Última atualização: Julho 2026*
