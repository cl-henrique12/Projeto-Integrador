import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import { SafeImage } from "@/app/components/SafeImage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Busca Inteligente | Geekfy",
  description: "Busque produtos geek por fandom, tema ou linguagem natural em Manaus.",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

async function buscarProdutosComIA(query: string) {
  const { prisma } = await import("@/lib/prisma");
  const { generateEmbedding, searchProductsByEmbedding } = await import("@/lib/embedding");

  const apiKeyConfigurada = Boolean(process.env.OPENAI_API_KEY);
  const qLower = query.toLowerCase();

  let idsPorEmbedding: string[] = [];

  // 1. Geração de embedding e busca vetorial via pgvector (<=> cosseno)
  if (apiKeyConfigurada) {
    try {
      const queryVector = await generateEmbedding(query);
      if (queryVector) {
        idsPorEmbedding = await searchProductsByEmbedding(queryVector, 30);
      }
    } catch (err) {
      console.warn("⚠️ Falha na geração/busca por embedding (caindo para fallback relacional):", err);
    }
  }

  // 2. Reforço com lista curada de sinônimos/fandoms (RF07)
  const tagsConhecidas = await prisma.tag.findMany({ select: { id: true, name: true, slug: true, synonyms: true } });
  const fandomsEncontrados = tagsConhecidas.filter(t =>
    qLower.includes(t.name.toLowerCase()) ||
    t.synonyms.some(s => qLower.includes(s.toLowerCase()))
  );

  // 3. Extração de limite de preço (ex: "até 50", "menos de 100")
  let maxPrice: number | null = null;
  const priceMatch = qLower.match(/(?:até|menos de|abaixo de|por|no máximo)?\s*(?:r\$)?\s*(\d+(?:[\.,]\d{1,2})?)/i);
  if (priceMatch && (qLower.includes("até") || qLower.includes("menos") || qLower.includes("barato") || qLower.includes("r$"))) {
    const parsed = parseFloat(priceMatch[1].replace(",", "."));
    if (!isNaN(parsed) && parsed > 0) {
      maxPrice = parsed;
    }
  }

  const tagIdsMatched = fandomsEncontrados.map(f => f.id);

  // 4. Buscar produtos combinando vector search, tags/sinônimos e texto
  const resultados = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      store: { status: "APPROVED" },
      ...(maxPrice ? { price: { lte: maxPrice } } : {}),
      OR: [
        ...(idsPorEmbedding.length > 0 ? [{ id: { in: idsPorEmbedding } }] : []),
        ...(tagIdsMatched.length > 0 ? [{ tags: { some: { tagId: { in: tagIdsMatched } } } }] : []),
        { name:        { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { some: { tag: { OR: [
          { name:     { contains: query, mode: "insensitive" } },
          { synonyms: { has: qLower } },
        ] } } } },
      ],
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      store: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    take: 30,
  });

  // Ordenar priorizando distância pgvector se disponível, ou por sinônimos
  if (idsPorEmbedding.length > 0) {
    const mapIndex = new Map(idsPorEmbedding.map((id, index) => [id, index]));
    resultados.sort((a, b) => {
      const idxA = mapIndex.has(a.id) ? mapIndex.get(a.id)! : 999;
      const idxB = mapIndex.has(b.id) ? mapIndex.get(b.id)! : 999;
      return idxA - idxB;
    });
  }

  // Registrar estatística de busca
  prisma.searchQuery.create({
    data: { query, resultsCount: resultados.length },
  }).catch(() => {});

  // Resumo para UI
  const partes: string[] = [];
  if (fandomsEncontrados.length > 0) {
    partes.push(`fandom **${fandomsEncontrados.map(f => f.name).join(", ")}**`);
  }
  if (maxPrice) {
    partes.push(`preço de até **R$ ${maxPrice.toFixed(2).replace(".", ",")}**`);
  }

  const aiExplanation = idsPorEmbedding.length > 0
    ? `✨ A busca semântica por embeddings ordenou os produtos por maior similaridade.${partes.length > 0 ? ` (Identificado ${partes.join(" e ")})` : ""}`
    : partes.length > 0
    ? `✨ A IA identificou busca por ${partes.join(" e ")}.`
    : `✨ A IA filtrou os produtos mais relevantes para sua pesquisa.`;

  return {
    resultados,
    aiExplanation,
    apiKeyConfigurada,
    usouEmbeddings: idsPorEmbedding.length > 0,
  };
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const { resultados: produtos, aiExplanation, apiKeyConfigurada } = query
    ? await buscarProdutosComIA(query)
    : { resultados: [], aiExplanation: "", apiKeyConfigurada: Boolean(process.env.OPENAI_API_KEY) };

  return (
    <main>
      <Header />
      <CategoryNav />

      <div className="page-container py-section" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ marginBottom: '16px' }}>
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-text-primary">
              {query ? `Resultados para "${query}"` : "Busca de Produtos"}
            </h1>
            {query && produtos.length > 0 && (
              <p className="text-lavendergrey text-sm font-sans" style={{ marginTop: '4px' }}>
                {`${produtos.length} produto${produtos.length !== 1 ? "s" : ""} encontrado${produtos.length !== 1 ? "s" : ""}`}
              </p>
            )}
          </div>
        </div>

        {/* Card de Resposta da IA */}
        {query && produtos.length > 0 && (
          <div
            className="bg-gradient-to-r from-mauve/20 via-blushpop/20 to-aquamarine/20 border border-mauve/30 rounded-card p-4 flex items-center gap-3 shadow-xs"
            style={{ marginTop: '12px', marginBottom: '24px' }}
          >
            <div className="w-9 h-9 rounded-full bg-mauve/30 flex items-center justify-center text-mauve font-bold flex-shrink-0">
              ✨
            </div>
            <p className="text-sm text-text-primary font-sans">
              <strong className="font-semibold">Busca Inteligente por IA:</strong> {aiExplanation.replace("✨ ", "")}
            </p>
          </div>
        )}

        {!query && (
          <div className="bg-white rounded-card border border-lavendergrey/20 p-8 text-center max-w-xl mx-auto" style={{ marginTop: '24px' }}>
            <p className="font-display font-bold text-lg text-text-primary mb-2">
              ✨ Experimente a Busca Inteligente por IA
            </p>
            <p className="text-lavendergrey text-sm font-sans mb-6">
              Você pode pesquisar como fala normalmente! Digite na barra de busca acima frases como:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Presente até 50 reais de One Piece",
                "Camisetas do Naruto",
                "Figura do Pikachu",
                "Deck de Magic para jogar",
                "espada e magia",
                "shinobi",
              ].map((ex) => (
                <a
                  key={ex}
                  href={`/busca?q=${encodeURIComponent(ex)}`}
                  className="px-3.5 py-2 rounded-full bg-mauve/15 text-text-primary text-xs font-semibold hover:bg-mauve/30 transition-colors"
                >
                  &ldquo;{ex}&rdquo;
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {query && produtos.length === 0 && (
          <div className="flex justify-center" style={{ marginTop: '32px' }}>
            <div className="bg-white rounded-card shadow-sm border border-lavendergrey/10 text-center max-w-lg w-full" style={{ padding: '40px' }}>
              <div className="w-16 h-16 bg-mauve/20 rounded-full flex items-center justify-center mx-auto" style={{ marginBottom: '20px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-mauve">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>

              <h2 className="font-display font-black text-xl text-text-primary" style={{ marginBottom: '8px' }}>
                Nenhum produto encontrado
              </h2>
              <p className="text-lavendergrey font-sans text-sm max-w-sm mx-auto" style={{ marginBottom: '24px' }}>
                Não encontramos nada para <strong className="text-text-primary">&ldquo;{query}&rdquo;</strong>. Tente buscar um dos temas recomendados:
              </p>

              <div className="flex flex-wrap justify-center" style={{ gap: '8px', marginBottom: '24px' }}>
                {["One Piece", "Naruto", "Pokémon", "D&D", "Magic", "Dragon Ball", "K-Pop"].map((tag) => (
                  <a
                    key={tag}
                    href={`/busca?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 rounded-full bg-aquamarine/40 text-text-primary text-xs font-semibold hover:bg-aquamarine transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>

              <a href="/lojas" className="text-sm text-mauve hover:underline font-semibold">
                Ver todas as lojas parceiras →
              </a>
            </div>
          </div>
        )}

        {/* Resultados em Grid */}
        {produtos.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: '16px' }}>
            {produtos.map((produto) => {
              const img = produto.images[0];
              const preco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(produto.price));
              return (
                <li key={produto.id}>
                  <a
                    href={`/produtos/${produto.id}`}
                    className="block rounded-card overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform border border-lavendergrey/10 group"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-aquamarine/20 to-mauve/20">
                      <SafeImage src={img?.url || ""} alt={produto.name} fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div style={{ padding: '16px' }}>
                      <span className="text-xs text-lavendergrey font-sans uppercase tracking-wide">{produto.store.name}</span>
                      <h2 className="font-display font-semibold text-text-primary text-base" style={{ marginTop: '4px', marginBottom: '8px' }}>{produto.name}</h2>
                      <div className="flex flex-wrap gap-1" style={{ marginBottom: '12px' }}>
                        {produto.tags.slice(0, 3).map(({ tag }) => (
                          <span key={tag.name} className="px-2 py-0.5 bg-aquamarine/40 rounded-full text-xs font-semibold text-text-primary">{tag.name}</span>
                        ))}
                      </div>
                      <p className="font-display font-black text-lg text-text-primary">{preco}</p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {/* Aviso exibido apenas se OPENAI_API_KEY não estiver configurada no .env */}
        {!apiKeyConfigurada && query && (
          <p className="text-xs text-lavendergrey font-sans bg-lavendergrey/10 rounded-lg px-4 py-2.5 inline-block" style={{ marginTop: '32px' }}>
            💡 Busca por similaridade semântica (embeddings) será ativada quando <code>OPENAI_API_KEY</code> for configurada no arquivo <code>.env</code>.
          </p>
        )}
      </div>
    </main>
  );
}
