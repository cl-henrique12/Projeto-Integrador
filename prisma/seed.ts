import { PrismaClient, Role, StoreStatus, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco Geekfy...')

  // ── Categorias (sequencial para respeitar connection_limit=1) ──────────
  const categoriasData = [
    { name: 'Anime',        slug: 'anime' },
    { name: 'Mangá',        slug: 'manga' },
    { name: 'TCG',          slug: 'tcg' },
    { name: 'Board Games',  slug: 'board-games' },
    { name: 'Cosplay',      slug: 'cosplay' },
    { name: 'Colecionáveis',slug: 'colecionar' },
    { name: 'Camisas',      slug: 'camisas' },
    { name: 'Acessórios',   slug: 'acessorios' },
  ]
  const categorias = []
  for (const cat of categoriasData) {
    categorias.push(await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat }))
  }
  console.log(`✅ ${categorias.length} categorias criadas`)

  // ── Tags de fandom (sequencial) ────────────────────────────────────────
  const tagsData = [
    { name: 'One Piece',         slug: 'one-piece',        synonyms: ['luffy', 'piratas', 'manga pirata'] },
    { name: 'Naruto',            slug: 'naruto',           synonyms: ['shinobi', 'ninja', 'akatsuki', 'konoha'] },
    { name: 'Pokémon',           slug: 'pokemon',          synonyms: ['pikachu', 'ash', 'treinador'] },
    { name: 'D&D',               slug: 'dnd',              synonyms: ['dungeons and dragons', 'rpg de mesa', 'fantasia', 'dados'] },
    { name: 'Magic: The Gathering', slug: 'magic-gathering', synonyms: ['mtg', 'cartas magic', 'TCG'] },
    { name: 'Attack on Titan',   slug: 'attack-on-titan',  synonyms: ['shingeki no kyojin', 'titãs', 'eren'] },
    { name: 'Dragon Ball',       slug: 'dragon-ball',      synonyms: ['goku', 'saiyajin', 'dbz'] },
    { name: 'K-Pop',             slug: 'kpop',             synonyms: ['korea', 'idol', 'bts', 'blackpink'] },
  ]
  const tags = []
  for (const tag of tagsData) {
    tags.push(await prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag }))
  }
  console.log(`✅ ${tags.length} tags de fandom criadas`)

  // ── Usuário lojista 1 ───────────────────────────────────────────────────
  const user1 = await prisma.user.upsert({
    where: { email: 'coruja@geekfy.com' },
    update: {},
    create: {
      name: 'Carlos Coruja',
      email: 'coruja@geekfy.com',
      passwordHash: '$2b$10$placeholder_hash_nao_usar_em_producao',
      role: Role.LOJISTA,
    },
  })

  // ── Usuário lojista 2 ───────────────────────────────────────────────────
  const user2 = await prisma.user.upsert({
    where: { email: 'liry@geekfy.com' },
    update: {},
    create: {
      name: 'Liry Silva',
      email: 'liry@geekfy.com',
      passwordHash: '$2b$10$placeholder_hash_nao_usar_em_producao',
      role: Role.LOJISTA,
    },
  })

  // ── Usuário lojista 3 ───────────────────────────────────────────────────
  const user3 = await prisma.user.upsert({
    where: { email: 'animension@geekfy.com' },
    update: {},
    create: {
      name: 'Ana Mendes',
      email: 'animension@geekfy.com',
      passwordHash: '$2b$10$placeholder_hash_nao_usar_em_producao',
      role: Role.LOJISTA,
    },
  })

  // ── Admin ────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@geekfy.com' },
    update: {},
    create: {
      name: 'Admin Geekfy',
      email: 'admin@geekfy.com',
      passwordHash: '$2b$10$placeholder_hash_nao_usar_em_producao',
      role: Role.ADMIN,
    },
  })
  console.log(`✅ Usuários criados (${user1.name}, ${user2.name}, ${user3.name}, admin)`)

  // ── Loja 1: Coruja Geek (APPROVED) ──────────────────────────────────────
  const loja1 = await prisma.store.upsert({
    where: { slug: 'coruja-geek' },
    update: {},
    create: {
      slug: 'coruja-geek',
      name: 'Coruja Geek',
      description: 'A maior loja de produtos geek de Manaus! Anime, mangá, TCG, board games e muito mais. Estamos no coração da cidade para atender os geeks de plantão.',
      logoUrl: 'https://placehold.co/200x200/8EF8D5/1A1A2E?text=Coruja',
      coverUrl: 'https://placehold.co/1200x400/D3BCFF/1A1A2E?text=Coruja+Geek',
      whatsapp: '5592991234567',
      instagram: '@corujaGeekManus',
      neighborhood: 'Centro',
      city: 'Manaus',
      latitude: -3.1190,
      longitude: -60.0217,
      status: StoreStatus.APPROVED,
      ownerId: user1.id,
      categories: {
        create: [
          { categoryId: categorias[0].id }, // anime
          { categoryId: categorias[1].id }, // manga
          { categoryId: categorias[2].id }, // tcg
        ],
      },
    },
  })

  // ── Loja 2: Liry Closet (APPROVED) ─────────────────────────────────────
  const loja2 = await prisma.store.upsert({
    where: { slug: 'liry-closet' },
    update: {},
    create: {
      slug: 'liry-closet',
      name: 'Liry Closet',
      description: 'Roupas e acessórios temáticos para o geek estiloso. Camisetas exclusivas, pins, chaveiros e muito mais. Feito com amor em Manaus!',
      logoUrl: 'https://placehold.co/200x200/FFBFEA/1A1A2E?text=Liry',
      coverUrl: 'https://placehold.co/1200x400/FFBFEA/1A1A2E?text=Liry+Closet',
      whatsapp: '5592992345678',
      instagram: '@liryCloset',
      neighborhood: 'Adrianópolis',
      city: 'Manaus',
      latitude: -3.0921,
      longitude: -59.9856,
      status: StoreStatus.APPROVED,
      ownerId: user2.id,
      categories: {
        create: [
          { categoryId: categorias[6].id }, // camisas
          { categoryId: categorias[7].id }, // acessorios
          { categoryId: categorias[4].id }, // cosplay
        ],
      },
    },
  })

  // ── Loja 3: AnimEnsiom (PENDING) ────────────────────────────────────────
  const loja3 = await prisma.store.upsert({
    where: { slug: 'animension' },
    update: {},
    create: {
      slug: 'animension',
      name: 'AnimEnsiom',
      description: 'Especializada em figuras de colecionador, statues e merch exclusivo de anime importado. Novidades toda semana!',
      logoUrl: 'https://placehold.co/200x200/D3BCFF/1A1A2E?text=Anim',
      coverUrl: 'https://placehold.co/1200x400/8EF8D5/1A1A2E?text=AnimEnsiom',
      whatsapp: '5592993456789',
      instagram: '@animension_manus',
      neighborhood: 'Vieiralves',
      city: 'Manaus',
      latitude: -3.0754,
      longitude: -60.0112,
      status: StoreStatus.PENDING,
      ownerId: user3.id,
      categories: {
        create: [
          { categoryId: categorias[5].id }, // colecionar
          { categoryId: categorias[0].id }, // anime
        ],
      },
    },
  })
  console.log(`✅ Lojas criadas: ${loja1.name} (APPROVED), ${loja2.name} (APPROVED), ${loja3.name} (PENDING)`)

  // ── Produtos da Loja 1: Coruja Geek ─────────────────────────────────────
  const prod1 = await prisma.product.upsert({
    where: { id: 'seed-prod-001' },
    update: {},
    create: {
      id: 'seed-prod-001',
      name: 'Card One Piece OP-01 Booster Pack',
      description: 'Pack de 10 cartas aleatórias da coleção Romance Dawn do TCG One Piece. Pode conter raridades SR e SEC!',
      price: 45.90,
      status: ProductStatus.ACTIVE,
      storeId: loja1.id,
      images: {
        create: [
          { url: 'https://placehold.co/400x400/8EF8D5/1A1A2E?text=One+Piece+Card', order: 0 },
        ],
      },
      tags: {
        create: [
          { tagId: tags[0].id }, // One Piece
        ],
      },
    },
  })

  const prod2 = await prisma.product.upsert({
    where: { id: 'seed-prod-002' },
    update: {},
    create: {
      id: 'seed-prod-002',
      name: 'Deck Magic: The Gathering Commander Precon',
      description: 'Deck Commander pré-construído 100 cartas. Perfeito para começar a jogar! Tema: Natureza e Elfos.',
      price: 189.90,
      status: ProductStatus.ACTIVE,
      storeId: loja1.id,
      images: {
        create: [
          { url: 'https://placehold.co/400x400/D3BCFF/1A1A2E?text=Magic+Commander', order: 0 },
        ],
      },
      tags: {
        create: [
          { tagId: tags[4].id }, // Magic
        ],
      },
    },
  })

  const prod3 = await prisma.product.upsert({
    where: { id: 'seed-prod-003' },
    update: {},
    create: {
      id: 'seed-prod-003',
      name: 'Mangá Naruto Box Set Vol. 1-27',
      description: 'Box set completo do arco inicial de Naruto! 27 volumes em excelente estado, embalagem original.',
      price: 399.00,
      status: ProductStatus.ACTIVE,
      storeId: loja1.id,
      images: {
        create: [
          { url: 'https://placehold.co/400x400/FFBFEA/1A1A2E?text=Naruto+Box', order: 0 },
        ],
      },
      tags: {
        create: [
          { tagId: tags[1].id }, // Naruto
        ],
      },
    },
  })

  // ── Produtos da Loja 2: Liry Closet ─────────────────────────────────────
  const prod4 = await prisma.product.upsert({
    where: { id: 'seed-prod-004' },
    update: {},
    create: {
      id: 'seed-prod-004',
      name: 'Camiseta Dragon Ball Z — Vegeta Ultra Ego',
      description: 'Camiseta 100% algodão estampa exclusiva Vegeta Ultra Ego. Tamanhos P ao GG. Arte local de Manaus!',
      price: 69.90,
      status: ProductStatus.ACTIVE,
      storeId: loja2.id,
      images: {
        create: [
          { url: 'https://placehold.co/400x400/D3BCFF/1A1A2E?text=Camiseta+DBZ', order: 0 },
        ],
      },
      tags: {
        create: [
          { tagId: tags[6].id }, // Dragon Ball
        ],
      },
    },
  })

  const prod5 = await prisma.product.upsert({
    where: { id: 'seed-prod-005' },
    update: {},
    create: {
      id: 'seed-prod-005',
      name: 'Pin Esmaltado Attack on Titan — Scouting Legion',
      description: 'Pin metálico esmaltado com o brasão da Legião de Reconhecimento. Diâmetro 3,5 cm. Perfeito para mochilas e jaquetas!',
      price: 24.90,
      status: ProductStatus.ACTIVE,
      storeId: loja2.id,
      images: {
        create: [
          { url: 'https://placehold.co/400x400/8EF8D5/1A1A2E?text=Pin+AoT', order: 0 },
        ],
      },
      tags: {
        create: [
          { tagId: tags[5].id }, // Attack on Titan
        ],
      },
    },
  })

  // ── Produtos da Loja 3: AnimEnsiom ──────────────────────────────────────
  const prod6 = await prisma.product.upsert({
    where: { id: 'seed-prod-006' },
    update: {},
    create: {
      id: 'seed-prod-006',
      name: 'Figure Pokémon — Pikachu Battle Ready (30cm)',
      description: 'Figura de colecionador Pikachu pose de batalha, 30cm, edição limitada importada. Embalagem lacrada!',
      price: 320.00,
      status: ProductStatus.ACTIVE,
      storeId: loja3.id,
      images: {
        create: [
          { url: 'https://placehold.co/400x400/FFBFEA/1A1A2E?text=Pikachu+Figure', order: 0 },
        ],
      },
      tags: {
        create: [
          { tagId: tags[2].id }, // Pokemon
        ],
      },
    },
  })
  console.log(`✅ 6 produtos criados`)

  // ── Eventos (EXEMPLO — substituir por dados reais) ─────────────────────
  // Coordenadas aproximadas do centro de Manaus para demonstração.
  // Substituir pelos dados reais quando os eventos forem cadastrados.

  // Evento 1: futuro (já existia)
  const evento1 = await prisma.event.upsert({
    where: { id: 'seed-event-001' },
    update: {},
    create: {
      id: 'seed-event-001',
      name: 'GeekCon Manaus 2026',
      description: 'O maior evento geek de Manaus! Anime, games, cosplay, TCG e muito mais. Entrada gratuita!',
      date: new Date('2026-08-15T10:00:00-04:00'),
      address: 'Studio 5 Centro de Convenções, Av. Mário Ypiranga Monteiro, 1826',
      neighborhood: 'Adrianópolis',
      // EXEMPLO — coordenadas aproximadas de Manaus
      latitude: -3.0921,
      longitude: -59.9856,
      stores: {
        create: [
          { storeId: loja1.id, confirmed: true },
          { storeId: loja2.id, confirmed: true },
        ],
      },
    },
  })

  // Evento 2: futuro — EXEMPLO
  const evento2 = await prisma.event.upsert({
    where: { id: 'seed-event-002' },
    update: {},
    create: {
      id: 'seed-event-002',
      name: 'Feira Otaku Manaus',
      description: 'Feira de cultura japonesa com cosplay, mangás, comida e música. Traga a família!',
      date: new Date('2026-09-20T09:00:00-04:00'),
      address: 'Centro Cultural Povos da Amazônia, Av. Silves, 2222',
      neighborhood: 'Distrito Industrial',
      // EXEMPLO — coordenadas aproximadas (sul do centro de Manaus)
      latitude: -3.130,
      longitude: -60.023,
      stores: {
        create: [
          { storeId: loja1.id, confirmed: true },
        ],
      },
    },
  })

  // Evento 3: passado — EXEMPLO
  const evento3 = await prisma.event.upsert({
    where: { id: 'seed-event-003' },
    update: {},
    create: {
      id: 'seed-event-003',
      name: 'Encontro Gamer Centro',
      description: 'Encontro de gamers e entusiastas de board games no Centro Histórico. Jogos e torneios o dia todo!',
      date: new Date('2025-12-10T14:00:00-04:00'),
      address: 'Largo de São Sebastião, 2 — Teatro Amazonas',
      neighborhood: 'Centro',
      // EXEMPLO — coordenadas aproximadas (centro histórico de Manaus)
      latitude: -3.1302,
      longitude: -60.0233,
      stores: {
        create: [
          { storeId: loja2.id, confirmed: true },
        ],
      },
    },
  })
  console.log(`✅ 3 eventos criados: ${evento1.name}, ${evento2.name}, ${evento3.name}`)

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('   Lojas APPROVED: Coruja Geek, Liry Closet')
  console.log('   Lojas PENDING:  AnimEnsiom')
  console.log('   Produtos: 6 (3 + 2 + 1)')
  console.log('   Tags de fandom: 8')
  console.log('   Eventos: 3 (2 futuros + 1 passado)')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
