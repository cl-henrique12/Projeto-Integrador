# Guia de Onboarding — Geekfy

> Documento para quem está chegando agora ao projeto. Não é preciso ter experiência com Next.js, Prisma ou Supabase para entender o que está aqui — explicamos tudo em linguagem simples.

---

## 1. Visão Geral do Projeto

O **Geekfy** é uma vitrine digital voltada às lojas geek de Manaus. O objetivo é reunir em um só site todas as lojas que vendem produtos de anime, mangá, TCG (jogos de cartas), board games, cosplay e itens colecionáveis, permitindo que consumidores encontrem produtos e falem diretamente com as lojas pelo WhatsApp. Lojistas se cadastram na plataforma, e um administrador aprova ou rejeita cada loja antes que ela apareça na vitrine pública. A busca por produtos pode ser feita por nome, descrição ou por "fandom" (ex.: "Naruto", "Pokémon") — e há infraestrutura preparada para futuramente usar inteligência artificial (busca por similaridade semântica) quando uma chave de API da OpenAI for configurada.

---

## 2. Mapa de Pastas

```
Projeto-Integrador/
├── app/                        → Toda a interface e lógica de rotas do site
│   ├── page.tsx                → Página inicial (home) — vitrine pública
│   ├── layout.tsx              → Estrutura HTML base (aplica fontes e CSS globais)
│   ├── globals.css             → Estilos globais e tokens de design (cores, fontes)
│   ├── components/             → Componentes visuais reutilizáveis
│   │   ├── Header.tsx          → Cabeçalho com logo, busca e ícones
│   │   ├── CategoryNav.tsx     → Barra de navegação por categoria
│   │   ├── HeroBanner.tsx      → Carrossel de banners da home
│   │   ├── StoreCarousel.tsx   → Linha de avatares das lojas parceiras
│   │   └── ProductGrid.tsx     → Grade de cards de produtos em destaque
│   ├── lojas/                  → Páginas de lojas
│   │   ├── page.tsx            → Listagem de todas as lojas aprovadas
│   │   └── [slug]/page.tsx     → Página individual de cada loja
│   ├── produtos/
│   │   └── [id]/page.tsx       → Página individual de cada produto
│   ├── busca/
│   │   └── page.tsx            → Página de resultados de busca
│   ├── login/
│   │   └── page.tsx            → Formulário de login do lojista/admin
│   ├── cadastro/               → Fluxo de cadastro de novo lojista
│   │   ├── page.tsx            → Passo 1: criar conta (email + senha)
│   │   └── loja/page.tsx       → Passo 2: preencher dados da loja
│   ├── painel/                 → Área restrita do lojista (requer login)
│   │   ├── page.tsx            → Dashboard do lojista: métricas + lista de produtos
│   │   └── produtos/novo/      → Formulário para adicionar novo produto
│   ├── admin/
│   │   └── page.tsx            → Painel do administrador: aprovar/rejeitar lojas
│   └── api/                    → Rotas de API (recebem e devolvem dados em JSON)
│       ├── lojas/route.ts      → POST: criar nova loja
│       ├── produtos/route.ts   → POST: criar novo produto
│       ├── categorias/route.ts → GET: listar categorias disponíveis
│       ├── tags/route.ts       → GET: listar tags/fandoms disponíveis
│       ├── admin/lojas/[id]/   → PATCH: aprovar ou rejeitar uma loja
│       └── auth/logout/        → POST: encerrar sessão
│
├── lib/                        → Código de infraestrutura compartilhado
│   ├── prisma.ts               → Instância única de conexão com o banco de dados
│   └── supabase/               → Configuração do Supabase (autenticação)
│       ├── client.ts           → Cliente para uso no navegador
│       ├── server.ts           → Cliente para uso no servidor
│       └── middleware.ts       → Verifica sessão e protege rotas privadas
│
├── prisma/                     → Tudo relacionado ao banco de dados
│   ├── schema.prisma           → Definição das tabelas e relacionamentos
│   └── seed.ts                 → Script para popular o banco com dados de teste
│
├── Documentos/                 → Documentação do projeto (não é código)
│   ├── PRD.docx                → Documento de requisitos do produto
│   ├── design-system.md        → Guia visual: cores, tipografia, componentes
│   ├── geekfy_class_diagram.mermaid → Diagrama de classes do banco
│   └── geekfy_ux_flowchart.mermaid  → Fluxograma de navegação do usuário
│
├── public/                     → Imagens e arquivos estáticos servidos diretamente
├── proxy.ts                    → Middleware do Next.js 16 (protege /painel e /admin)
├── next.config.ts              → Configuração do Next.js (domínios de imagem permitidos)
├── tailwind.config.ts          → Tokens de design (cores, fontes, bordas, espaçamentos)
├── postcss.config.mjs          → Configuração de pós-processamento de CSS
├── tsconfig.json               → Configuração do TypeScript
└── package.json                → Lista de dependências e scripts do projeto
```

---

## 3. O Que Cada Arquivo/Módulo Importante Faz

| Caminho do arquivo | O que ele faz | Quando eu precisaria mexer nele |
|---|---|---|
| `app/page.tsx` | Página inicial: busca as lojas aprovadas e produtos ativos no banco, monta a home com Header, CategoryNav, HeroBanner, StoreCarousel e ProductGrid | Mudar quais lojas/produtos aparecem na home, alterar a ordem das seções ou o conteúdo do rodapé |
| `app/layout.tsx` | Define a estrutura HTML base que envolve todas as páginas; configura título, descrição e palavras-chave do site para SEO | Mudar o título global do site, a descrição que aparece no Google, ou importar uma nova fonte |
| `app/globals.css` | Define os tokens de design (cores, fontes, espaçamentos) como variáveis CSS, importa as fontes do Google e declara animações globais | Ajustar tokens de cor ou fonte que afetam todo o site; adicionar animações globais |
| `tailwind.config.ts` | Registra as mesmas cores e fontes do design system como classes utilitárias do Tailwind (ex.: bg-mauve, font-display) | Adicionar ou renomear uma cor/fonte do design system para que possa ser usada como classe Tailwind |
| `app/components/Header.tsx` | Cabeçalho fixo: logo "GKF", barra de busca com navegação para /busca, ícones de favoritos, carrinho e perfil/login | Mudar o logo, o placeholder da busca, ou adicionar um novo ícone ao cabeçalho |
| `app/components/CategoryNav.tsx` | Barra horizontal de navegação por categoria; a lista de categorias está **hardcoded** (fixada no código) neste arquivo | Adicionar, remover ou renomear categorias na barra de navegação |
| `app/components/HeroBanner.tsx` | Carrossel automático de banners; os slides (título, subtítulo, link do botão e cor de fundo) também estão **hardcoded** neste arquivo | Mudar os textos, links ou cores dos banners do carrossel da home |
| `app/components/StoreCarousel.tsx` | Exibe avatares circulares das lojas parceiras aprovadas; recebe os dados prontos via prop (passados pela app/page.tsx) | Mudar o visual dos avatares das lojas (tamanho, borda, hover) |
| `app/components/ProductGrid.tsx` | Grade de cards de produtos; formata preço em Real brasileiro; exibe "Sem imagem" quando não há foto | Mudar o layout do card de produto, o texto do badge "Ver produto", ou quantas colunas aparecem |
| `app/lojas/page.tsx` | Lista todas as lojas aprovadas; aceita filtro por categoria via parâmetro de URL (?categoria=manga) | Mudar o layout dos cards de loja, ou ajustar quais categorias aparecem como filtro |
| `app/lojas/[slug]/page.tsx` | Página de detalhe de uma loja: exibe cover, logo, descrição, botão de WhatsApp, Instagram e grid de produtos | Mudar o layout da página de loja, o texto do botão de WhatsApp, ou adicionar novas informações da loja |
| `app/produtos/[id]/page.tsx` | Página de detalhe de um produto: imagem, nome, preço, descrição, tags/fandoms e link para a loja | Mudar o visual da página de produto ou adicionar novas informações |
| `app/busca/page.tsx` | Página de busca: filtra produtos por nome, descrição e tags no banco; registra cada busca na tabela SearchQuery; exibe aviso de que busca semântica (IA) ainda não está ativa | Ajustar a lógica de busca, mudar o visual dos resultados ou as sugestões exibidas quando não há resultado |
| `app/login/page.tsx` | Formulário de login; autentica via Supabase; redireciona para /admin se for ADMIN, ou /painel se for LOJISTA | Mudar o visual do formulário de login ou o texto de erro |
| `app/cadastro/page.tsx` | Passo 1 do cadastro de lojista: cria conta no Supabase Auth com email e senha; após confirmação de email, redireciona para /cadastro/loja | Mudar campos do formulário de criação de conta |
| `app/cadastro/loja/page.tsx` | Passo 2: formulário completo de dados da loja (nome, WhatsApp, bairro, categorias, logo etc.); submete para POST /api/lojas | Mudar os campos do cadastro de loja, adicionar validações ou mensagens |
| `app/painel/page.tsx` | Dashboard do lojista: exibe status da loja (PENDING/APPROVED/REJECTED), métricas de views/produtos, lista de produtos e botões para adicionar produto ou editar loja | Mudar o layout do painel ou adicionar novas métricas |
| `app/painel/produtos/novo/page.tsx` | Formulário para o lojista adicionar um novo produto (nome, preço, descrição, URL de imagem, tags); submete para POST /api/produtos | Mudar o formulário de cadastro de produto |
| `app/admin/page.tsx` | Painel do administrador: lista lojas pendentes de aprovação com botões "Aprovar" e "Rejeitar"; exibe métricas gerais da plataforma | Mudar o visual do painel admin ou adicionar novas funcionalidades administrativas |
| `app/api/lojas/route.ts` | Endpoint POST /api/lojas: recebe dados do formulário de loja, cria o usuário no banco (se necessário) e cria a loja com status PENDING | Mudar os campos aceitos no cadastro de loja ou a lógica de criação |
| `app/api/produtos/route.ts` | Endpoint POST /api/produtos: recebe dados do formulário de produto e cria o produto vinculado à loja do lojista | Mudar os campos aceitos no cadastro de produto |
| `app/api/admin/lojas/[id]/` | Endpoint PATCH /api/admin/lojas/:id: atualiza o status de uma loja (APPROVED, REJECTED, SUSPENDED) | Mudar as ações possíveis do admin sobre as lojas |
| `app/api/auth/logout/route.ts` | Endpoint POST /api/auth/logout: chama signOut do Supabase e redireciona para a home | Mudar o destino do redirecionamento após logout |
| `lib/prisma.ts` | Cria e exporta a instância única do cliente Prisma (conexão com o banco); usa padrão singleton para não abrir múltiplas conexões | Raramente; só se for necessário mudar as configurações de log do banco |
| `lib/supabase/server.ts` | Cria o cliente Supabase para uso dentro do servidor (em Server Components e rotas de API) | Raramente; só se mudar a versão do Supabase ou configurações de cookie |
| `lib/supabase/middleware.ts` | Verifica se o usuário está logado em cada requisição; redireciona para /login caso tente acessar /painel ou /admin sem sessão | Adicionar ou remover rotas protegidas |
| `proxy.ts` | Arquivo de middleware do Next.js 16 (nome diferente do convencional middleware.ts); intercepta todas as requisições e chama updateSession | Mudar quais rotas são protegidas ou o comportamento do interceptor |
| `prisma/schema.prisma` | Define todas as tabelas do banco de dados, seus campos, tipos e relacionamentos — é o "mapa" do banco | Adicionar um campo novo, criar uma tabela nova ou mudar um relacionamento — **ZONA DE RISCO**, ver seção 6 |
| `prisma/seed.ts` | Script que popula o banco com dados fictícios para desenvolvimento e testes | Mudar os dados de exemplo usados em desenvolvimento |
| `next.config.ts` | Configuração do Next.js: define quais domínios externos de imagem são permitidos (placehold.co e *.supabase.co) | Quando for usar imagens de um novo domínio externo (ex.: CDN diferente) |

---

## 4. Como Editar o Visual Sem Quebrar Nada

### Onde ficam as cores, fontes e espaçamentos

O projeto tem **dois lugares** onde os tokens de design estão definidos — e eles precisam estar em sincronia:

1. **`app/globals.css`** — Define as variáveis CSS dentro do bloco `@theme { ... }`. São valores como `--color-aquamarine: #8EF8D5` ou `--font-display: 'Nunito', sans-serif`. Qualquer componente pode usar essas variáveis diretamente via CSS.

2. **`tailwind.config.ts`** — Registra as mesmas cores e fontes como **classes do Tailwind**. É o que permite escrever `className="bg-mauve"` em vez de escrever o código hexadecimal direto no estilo.

**Regra de ouro:** se você mudar uma cor em `globals.css`, mude também em `tailwind.config.ts` — e vice-versa. Do contrário, a cor pode funcionar em alguns componentes e não em outros.

### A paleta de cores do projeto

| Nome da classe Tailwind | Hex | Onde é usada no site |
|---|---|---|
| `bg-blushpop` | #FFBFEA (rosa claro) | Cabeçalho, banners, botões no painel |
| `bg-aquamarine` | #8EF8D5 (verde-água) | Barra de categorias, tags, badges |
| `bg-mauve` | #D3BCFF (lilás) | Botões primários, hover, painel admin |
| `text-lavendergrey` | #8786A8 (cinza-lilás) | Textos secundários, bordas, ícones inativos |
| `text-text-primary` | #1A1A2E (azul muito escuro) | Textos principais, títulos |
| `bg-base` | #FFFFFF (branco) | Fundo geral, cards |

### Como alterar a cor de um componente específico sem afetar o resto

Os estilos de cada componente estão **dentro do próprio arquivo do componente**, nas classes Tailwind do JSX. Não há um arquivo CSS separado por componente.

**Exemplo prático — mudar a cor do botão de login:**
- O botão "Entrar" na página de login (`app/login/page.tsx`, linha 81) usa a classe `bg-mauve`.
- Para mudar **só este botão**, substitua `bg-mauve` por outra cor neste arquivo, por exemplo `bg-blue-500`.
- ✅ **Edite:** `app/login/page.tsx`
- ❌ **Não edite:** `app/globals.css` ou `tailwind.config.ts` — isso mudaria a cor `mauve` em **todo o site**.

**Exemplo prático — mudar a cor do cabeçalho:**
- O fundo rosa do Header está em `app/components/Header.tsx`, na linha com `className="bg-blushpop ..."`.
- Para mudar a cor do cabeçalho, altere essa classe dentro de `Header.tsx` apenas.

### Arquivos que NÃO devem ser editados diretamente

- **`.next/`** (pasta gerada automaticamente pelo Next.js, ignorada pelo Git) — nunca edite nada aqui; é apagado e recriado a cada build.
- **`node_modules/`** — dependências externas instaladas automaticamente; nunca edite aqui.
- Não há arquivos de CSS gerados automaticamente por ferramentas externas neste projeto — todos os estilos em `globals.css` e `tailwind.config.ts` foram escritos à mão e podem ser editados com cuidado.

> **⚠️ Inconsistência encontrada no projeto:** o arquivo `Documentos/design-system.md` chama as cores de `--color-accent-1`, `--color-accent-2` etc. (nomes vindos do Figma), mas no código real (`globals.css` e `tailwind.config.ts`) os nomes registrados são diferentes: `aquamarine`, `blushpop`, `mauve`. **Use sempre os nomes do código**, não os do documento, ao escrever classes Tailwind.

---

## 5. Como Fazer Alterações Comuns com Segurança

### Tarefa 1: Trocar um texto da página inicial

**Exemplo A — mudar "Produtos em Destaque" para "Produtos da Semana":**

1. Abra `app/components/ProductGrid.tsx`
2. Procure o texto `Produtos em Destaque` (linha 43)
3. Substitua pelo novo texto e salve

**Exemplo B — mudar os textos dos banners do carrossel:**

1. Abra `app/components/HeroBanner.tsx`
2. Procure o array `SLIDES` no topo do arquivo (linhas 9 a 34)
3. Cada slide é um objeto com os campos:
   - `title` → título grande do banner
   - `subtitle` → texto menor abaixo do título
   - `cta.label` → texto do botão
   - `cta.href` → endereço para onde o botão leva
4. Edite os campos desejados e salve

---

### Tarefa 2: Adicionar ou renomear uma categoria na barra de navegação

A barra de categorias (`app/components/CategoryNav.tsx`) tem a lista **fixada diretamente no código**, não lida do banco de dados.

1. Abra `app/components/CategoryNav.tsx`
2. Procure o array `CATEGORIAS` (linhas 5 a 11)
3. Para adicionar uma nova categoria, copie uma linha existente e ajuste:
   - `label` → texto que aparece na barra
   - `href` → URL de destino (ex.: `/lojas?categoria=rpg`)
   - `slug` → identificador único interno (ex.: `rpg`)
4. Salve o arquivo

> **Atenção:** o filtro de lojas em `/lojas` é dinâmico e lê do banco de dados. Para que a nova categoria funcione como filtro real, ela também precisa existir na tabela `categories` do banco. A barra em `CategoryNav.tsx` é apenas um atalho visual — as duas coisas precisam estar alinhadas.

---

### Tarefa 3: Trocar ou adicionar uma imagem de loja ou produto

As imagens de lojas e produtos são **URLs** armazenadas no banco de dados (campos `logoUrl`, `coverUrl` e `images[].url`). Para trocá-las:

1. Hospede a nova imagem no Supabase Storage (ou use `placehold.co` para testes)
2. Copie a URL da nova imagem
3. Acesse o banco via Prisma Studio com o comando `npm run db:studio`
4. Encontre o registro da loja ou produto e atualize o campo de URL da imagem

> **Atenção:** o Next.js só permite carregar imagens de domínios autorizados. Se usar um serviço diferente de `placehold.co` ou `*.supabase.co`, adicione o novo domínio em `next.config.ts` dentro de `remotePatterns` — caso contrário, o site exibirá erro ao tentar mostrar a imagem.

Para imagens estáticas que fazem parte do layout do site (não do banco), coloque o arquivo na pasta `public/` e referencie como `src="/nome-do-arquivo.png"`.

---

### Tarefa 4: Ajustar o texto de um botão

**Exemplo — mudar "Criar minha conta" para "Cadastrar agora":**

1. Abra `app/cadastro/page.tsx`
2. Procure a linha 137 com o trecho `"Criar minha conta →"`
3. Substitua o texto pelo novo e salve

**Exemplo — mudar o texto do botão de login:**

1. Abra `app/login/page.tsx`
2. Procure a linha 83: o botão tem dois estados — texto normal e texto de carregamento
3. Mude os dois textos para manter a consistência

---

### Tarefa 5: Ajustar o tamanho (altura) da barra de categorias

A barra de navegação por categoria (`app/components/CategoryNav.tsx`) fica logo abaixo do cabeçalho. Sua altura é controlada por dois valores de `padding` — não há uma propriedade `height` fixa — então para torná-la mais compacta ou mais espaçosa, ajuste esses dois números:

**Onde mexer — dentro de `CategoryNavInner`, no elemento `<ul>`:**

| Propriedade | O que controla | Valor padrão | Mais compacto | Mais espaçoso |
|---|---|---|---|---|
| `paddingTop` | Espaço acima dos itens | `"0.25rem"` | `"0.125rem"` | `"0.75rem"` |
| `paddingBottom` | Espaço abaixo dos itens | `"0.25rem"` | `"0.125rem"` | `"0.75rem"` |

Além disso, o `padding` interno de cada link (o espaço dentro de cada botão arredondado) está na propriedade `padding` do `<Link>` dentro do `map`:

| Propriedade | Valor padrão | Mais compacto | Mais espaçoso |
|---|---|---|---|
| `padding` do link | `"0.375rem 1rem"` | `"0.25rem 0.75rem"` | `"0.625rem 1.5rem"` |

**Exemplo prático — tornar a barra ainda mais fina:**

1. Abra `app/components/CategoryNav.tsx`
2. No elemento `<ul>` (por volta da linha 48), altere:
   ```diff
   - paddingTop: "0.25rem",
   - paddingBottom: "0.25rem",
   + paddingTop: "0.125rem",
   + paddingBottom: "0.125rem",
   ```
3. No `<Link>` dentro do `.map()` (por volta da linha 64), altere:
   ```diff
   - padding: "0.375rem 1rem",
   + padding: "0.25rem 0.75rem",
   ```
4. Salve e veja a mudança instantânea no navegador

> **Dica:** 1rem = 16px. Então `0.25rem` = 4px e `0.5rem` = 8px. Pense nos valores como "pixels divididos por 16".

> **Atenção:** o `Suspense` no mesmo arquivo tem um `height: "36px"` no `fallback` (esqueleto de carregamento). Se mudar muito o padding, ajuste esse valor também para que não haja salto visual ao carregar a página.

---

## 6. Zonas de Risco

As áreas abaixo exigem cuidado redobrado. Uma edição errada pode derrubar o site ou causar perda de dados. **Peça ajuda antes de mexer nessas áreas sem ter certeza do que está fazendo.**

| Arquivo / Pasta | Por que é zona de risco | O que pode dar errado |
|---|---|---|
| `prisma/schema.prisma` | Define a estrutura do banco de dados inteiro | Mudar um campo, renomear uma tabela ou alterar um relacionamento sem gerar e aplicar a migração corretamente pode corromper o banco ou impedir que o site funcione |
| `lib/prisma.ts` | Gerencia a conexão com o banco | Mudar o padrão singleton pode abrir múltiplas conexões simultâneas e esgotar o limite do banco em produção |
| `lib/supabase/middleware.ts` e `proxy.ts` | Controlam quais páginas exigem login | Remover ou errar a lógica de proteção pode expor o painel administrativo para qualquer pessoa sem autenticação |
| `app/api/admin/lojas/[id]/` | Altera o status das lojas (aprova/rejeita) | Sem a verificação de papel (role ADMIN), qualquer usuário autenticado poderia aprovar lojas |
| `next.config.ts` | Configurações centrais do Next.js | Erros de sintaxe aqui impedem o projeto de compilar e o site fica completamente fora do ar |
| `tailwind.config.ts` e `app/globals.css` | Definem a identidade visual de todo o site | Mudar um token global (ex.: a cor `mauve`) afeta todos os botões, hovers e elementos que usam essa cor em qualquer parte do site |
| `.env.local` (variáveis de ambiente) | Contém credenciais do banco e do Supabase | Expor ou apagar variáveis de ambiente pode desconectar o banco, quebrar a autenticação ou expor dados sensíveis — **NUNCA commite este arquivo no Git** |
| `prisma/seed.ts` | Script de dados de teste | Rodar `npm run seed` em ambiente de produção pode popular o banco real com dados fictícios |

---

## 7. Como Rodar o Projeto Localmente

### Pré-requisitos

- Node.js versão 18 ou superior instalado
- Acesso às variáveis de ambiente do projeto (peça ao responsável pelo projeto)

### Passo a passo

**1. Clone o repositório e instale as dependências:**

```bash
git clone <URL-do-repositório>
cd Projeto-Integrador
npm install
```

**2. Configure as variáveis de ambiente:**

Crie um arquivo chamado `.env.local` na raiz do projeto (mesmo nível do `package.json`). O arquivo deve conter:

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

As URLs e chaves reais devem ser obtidas com o responsável pelo projeto ou diretamente no painel do Supabase em **Project Settings → API**.

**3. Gere o cliente do banco de dados:**

```bash
npm run db:generate
```

Este comando lê o `prisma/schema.prisma` e gera o código TypeScript necessário para consultar o banco.

**4. (Opcional) Aplique as migrações ao banco:**

```bash
npm run db:migrate
```

Necessário apenas se o banco ainda não tiver as tabelas criadas.

**5. (Opcional) Popule o banco com dados de teste:**

```bash
npm run seed
```

> ⚠️ **Nunca rode este comando em produção.** Use somente no banco de desenvolvimento.

**6. Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

Acesse **http://localhost:3000** no navegador. O site atualiza automaticamente quando você salva um arquivo.

**7. (Opcional) Abrir o visualizador do banco de dados:**

```bash
npm run db:studio
```

Abre uma interface visual no navegador para ver e editar os registros do banco diretamente — muito útil para testes.

---

## 8. Glossário Rápido

| Termo | Explicação simples |
|---|---|
| **Next.js** | O framework (conjunto de ferramentas) que estrutura o projeto. Ele decide como as páginas são criadas, como as rotas funcionam e cuida de otimizações como carregamento de imagens. |
| **Server Component** | Uma página ou componente que roda no servidor, não no navegador. Pode acessar o banco de dados diretamente sem expor credenciais. A maioria das páginas deste projeto são Server Components. |
| **Client Component** | Um componente que roda no navegador do usuário. Marcado com `"use client"` no topo do arquivo. Necessário para interatividade (formulários, botões com estado, carrossel). |
| **Prisma** | Ferramenta que faz a ponte entre o código TypeScript e o banco de dados PostgreSQL. Em vez de escrever SQL puro, escrevemos algo como `prisma.store.findMany(...)` e ele busca os dados. |
| **Schema (do banco)** | O "mapa" do banco de dados: define quais tabelas existem, quais campos cada uma tem e como elas se relacionam. No projeto fica em `prisma/schema.prisma`. |
| **Migração** | Quando o schema muda (ex.: adicionamos um campo novo), precisamos aplicar essa mudança ao banco real. Esse processo é chamado de "migração" e é feito com `npm run db:migrate`. |
| **Supabase** | Serviço na nuvem que fornece o banco de dados PostgreSQL e o sistema de autenticação (login/senha, tokens de sessão). É onde os dados reais do site ficam armazenados. |
| **Slug** | Uma versão "amigável para URL" do nome de algo. Por exemplo, a loja "Universo Geek" teria o slug `universo-geek` e seria acessada em `/lojas/universo-geek`. |
| **Embedding** | Representação numérica de um texto, gerada por IA. O projeto tem infraestrutura para guardar embeddings dos produtos (campo `embedding` na tabela `products`) para permitir busca por similaridade semântica. Esta funcionalidade ainda **não está ativa**, pois requer a variável `OPENAI_API_KEY` configurada. |
| **Status da loja** | Cada loja tem um estado: `PENDING` (cadastrada, aguardando aprovação), `APPROVED` (visível na vitrine), `REJECTED` (reprovada pelo admin) ou `SUSPENDED` (suspensa). Somente lojas `APPROVED` aparecem para os visitantes do site. |

---

## 9. Resolução de Problemas Comuns

### Problema: "Can't reach database server" ao rodar `npm run dev`

Erro completo que aparece no terminal:

```
PrismaClientInitializationError: Can't reach database server at
`db.bqownmtgukslunzvycuv.supabase.co:5432`
```

Esse erro significa que o código conseguiu ler as variáveis de ambiente corretamente, mas **não conseguiu abrir uma conexão TCP com o banco de dados**. As causas mais comuns são:

#### Causa 1 — Projeto Supabase pausado (mais comum)

O Supabase **pausa automaticamente projetos no plano gratuito** após aproximadamente 1 semana sem nenhuma requisição ao banco. Quando pausado, a porta `5432` fica completamente inacessível.

**Como resolver:**
1. Acesse o dashboard: https://supabase.com/dashboard/project/bqownmtgukslunzvycuv
2. Se aparecer a mensagem **"Your project is paused"**, clique em **"Restore project"**
3. Aguarde 1 a 3 minutos enquanto o Supabase reinicia o banco
4. Acesse `http://localhost:3000` novamente — o erro deve desaparecer

> **Dica:** Após restaurar, o Supabase fica ativo por mais 1 semana a cada vez que o banco recebe uma requisição. Durante o desenvolvimento, qualquer `npm run dev` com acesso ao banco já conta como uso.

#### Causa 2 — Porta 5432 bloqueada pela rede local

Algumas redes (especialmente redes de universidades ou empresas) bloqueiam conexões de saída na porta `5432`. O Supabase oferece um **pooler de conexões** na porta `6543` que é mais permissiva e recomendada para aplicações Next.js.

**Como resolver — atualizar o `.env`:**

```
# DATABASE_URL: via pooler Supabase (porta 6543) — recomendado para runtime
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.bqownmtgukslunzvycuv.supabase.co:6543/postgres?pgbouncer=true"

# DIRECT_URL: conexão direta (porta 5432) — usada APENAS pelo prisma migrate
DIRECT_URL="postgresql://postgres:SUA_SENHA@db.bqownmtgukslunzvycuv.supabase.co:5432/postgres"
```

> **Por que dois URLs?** O `DATABASE_URL` com `pgbouncer=true` é o que o Prisma usa para todas as queries do site (mais estável). O `DIRECT_URL` é o que o Prisma usa **somente** quando você roda `npm run db:migrate` — migrações precisam de uma conexão direta sem pooler.

As URLs e a senha exatas para o seu ambiente estão em **Supabase → Project Settings → Database → Connection string**. Selecione **"Transaction mode"** para obter a URL com pooler (porta 6543).

#### Causa 3 — Arquivo `.env` incorreto ou ausente

Verifique se o arquivo `.env` (na raiz do projeto, mesmo nível do `package.json`) existe e contém as quatro variáveis:

```
DATABASE_URL="..."
DIRECT_URL="..."
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

Se alguma estiver faltando, peça ao responsável pelo projeto. O Next.js lê o `.env` automaticamente — **não é necessário criar `.env.local`** neste projeto, pois o `.env` já está configurado.

---

### Problema: Imagens com erro `dangerouslyAllowSVG is disabled`

Erro que aparece no terminal durante desenvolvimento:

```
The requested resource "https://placehold.co/..." has type "image/svg+xml"
but dangerouslyAllowSVG is disabled.
```

Isso acontece porque o serviço `placehold.co` retorna imagens no formato SVG, e o componente `<Image>` do Next.js bloqueia SVGs externos por segurança.

**Como resolver — duas opções:**

**Opção A (mais simples):** Adicione `unoptimized` no componente `<Image>` específico que exibe a imagem:
```tsx
<Image src={logoUrl} alt={name} unoptimized />
```

**Opção B (global):** Habilite SVGs externos no `next.config.ts`:
```ts
images: {
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  remotePatterns: [ /* ... padrões existentes ... */ ],
}
```

> **Atenção:** a Opção B é global e afeta todas as imagens do site. Use com cuidado — SVGs externos podem conter scripts maliciosos. Para desenvolvimento com dados fictícios do `seed.ts`, a Opção A é mais segura.
