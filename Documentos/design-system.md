# Design System — Geekfy (Landing Page)

Este documento é a **fonte da verdade visual** do projeto. Deve ser anexado
junto com o PRD e o `schema.prisma` no primeiro prompt da IA. Regra geral a
incluir no prompt: **"Use exclusivamente os tokens abaixo. Não crie cores,
espaçamentos ou componentes que não estejam listados aqui."**

---

## 1. Paleta de Cores

Extraída do Figma. Uso proporcional segue a regra 60-30-10 (ver seção 1.2).

| Token         | Hex       | Nome           | Papel na UI |
|---------------|-----------|----------------|-------------|
| `--color-base`      | `#FFFFFF` | White         | Fundo principal, cards, áreas neutras |
| `--color-accent-1`  | `#8EF8D5` | Aquamarine    | Destaques secundários, tags, ícones ativos |
| `--color-accent-2`  | `#FFBFEA` | Blush Pop     | Header/nav, banners, elementos de destaque |
| `--color-accent-3`  | `#D3BCFF` | Mauve         | Botões primários, hover, CTA |
| `--color-neutral`   | `#8786A8` | Lavender Grey | Textos secundários, ícones inativos, bordas |

### 1.1 CSS Variables (colar direto no globals.css)

```css
:root {
  --color-base: #FFFFFF;
  --color-accent-1: #8EF8D5; /* Aquamarine */
  --color-accent-2: #FFBFEA; /* Blush Pop */
  --color-accent-3: #D3BCFF; /* Mauve */
  --color-neutral: #8786A8;  /* Lavender Grey */

  --color-text-primary: #1A1A2E;
  --color-text-secondary: var(--color-neutral);
}
```

### 1.2 Proporção de uso (60-30-10)

- **60% — White (`#FFFFFF`)**: fundo geral da página, cards de produto, área de conteúdo.
- **30% — Aquamarine / Blush Pop / Mauve** (distribuídos entre si): header, nav bar, banners, botões, hover states, badges.
- **10% — Lavender Grey (`#8786A8`)**: textos secundários, ícones inativos, divisores, elementos de apoio.

> Instrução para a IA: nunca deixar uma tela "colorida demais". O branco domina
> visualmente; as cores de destaque aparecem em blocos pontuais (header, banner,
> botões), nunca preenchendo grandes áreas de texto ou fundo geral.

### 1.3 Tailwind config (se o projeto usar Tailwind)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        base: "#FFFFFF",
        aquamarine: "#8EF8D5",
        blushpop: "#FFBFEA",
        mauve: "#D3BCFF",
        lavendergrey: "#8786A8",
      },
    },
  },
};
```

---

## 2. Tipografia

> Preencher com a fonte definida no Figma (nome exato + pesos usados).
> Se ainda não decidido, sugestão: uma fonte arredondada/geométrica para
> títulos (reforça o tom "geek/pop") e uma sans-serif neutra para corpo de texto.

| Uso | Tamanho aproximado | Peso |
|---|---|---|
| Título de banner/hero | 32–40px | Bold |
| Título de seção | 20–24px | Semibold |
| Corpo de texto | 14–16px | Regular |
| Texto auxiliar/legenda | 12–13px | Regular |

---

## 3. Inventário de Componentes (extraído do print do Figma)

A IA deve gerar **exatamente estes componentes**, nesta ordem, na landing page:

1. **Header**
   - Logo circular à esquerda (mascote/marca)
   - Barra de busca central: placeholder `"Pesquise por tema ou loja"`
   - Ícones à direita: favoritos (coração), carrinho (sacola), perfil (usuário)
   - Fundo em `--color-accent-2` (Blush Pop)

2. **Barra de navegação por categoria**
   - Fundo em `--color-accent-1` (Aquamarine)
   - Itens de texto: ex. "Acessórios", "Quadrinho/Mangás", "Camisas", "Artistas", "Parceiros"

3. **Banner hero (carrossel)**
   - Imagem/destaque de campanha em largura total
   - Indicadores de slide (dots) na parte inferior

4. **Carrossel de lojas parceiras**
   - Avatares circulares em linha horizontal, com nome/logo de cada loja
   - Deve ser dinâmico (puxar da tabela `Store` via API/Prisma), não hardcoded

5. **Grid de produtos/destaques**
   - Cards retangulares em grid (3 colunas no desktop)
   - Cada card representa um produto ou destaque de loja

---

## 4. Instrução-modelo para o primeiro prompt (Gemini CLI)

Sugestão de bloco a incluir no prompt inicial, junto do PRD e do `schema.prisma`:

```
Anexo: design-system.md, PRD.docx, schema.prisma, print da landing page (Figma).

Construa a landing page seguindo ESTRITAMENTE:
1. Os tokens de cor e proporção 60-30-10 definidos em design-system.md.
2. O inventário de componentes na ordem exata listada na seção 3.
3. O layout estrutural do print anexado (posição de header, banner, carrossel
   de lojas, grid de produtos).

Não introduza cores, fontes ou componentes fora do que está documentado.
Se algo não estiver especificado (ex: fonte exata), use uma opção neutra
e sinalize isso no final da resposta como pendência de decisão.
```

---

## 5. Pendências a resolver antes do prompt final

- [ ] Nome e pesos exatos da fonte usada no Figma
- [ ] Raio de borda padrão dos cards/botões (ex: 8px, 12px, full-rounded?)
- [ ] Espaçamento padrão entre seções (ex: 24px, 32px, 48px?)
- [ ] Exportar ícones do Figma (coração, sacola, usuário, lupa) como SVG para reuso exato
