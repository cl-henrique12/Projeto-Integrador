import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Busca | Geekfy",
  description: "Busque produtos geek por fandom, tema ou loja em Manaus.",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

// API de busca — importada aqui para uso direto no Server Component
async function buscarProdutos(query: string) {
  const { prisma } = await import("@/lib/prisma");

  // Log da busca
  const resultados = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      store: { status: "APPROVED" },
      OR: [
        { name:        { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { some: { tag: { OR: [
          { name:     { contains: query, mode: "insensitive" } },
          { synonyms: { has: query.toLowerCase() } },
        ] } } } },
      ],
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      store: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    take: 30,
    orderBy: { viewsCount: "desc" },
  });

  // Registrar busca
  prisma.searchQuery.create({
    data: { query, resultsCount: resultados.length },
  }).catch(() => {});

  return resultados;
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const produtos = query ? await buscarProdutos(query) : [];

  return (
    <main>
      <Header />
      <CategoryNav />

      <div className="page-container py-12">
        <h1 className="font-display font-black text-2xl text-text-primary mb-2">
          {query ? `Resultados para "${query}"` : "Busca"}
        </h1>

        {query && (
          <p className="text-lavendergrey text-sm mb-8 font-sans">
            {produtos.length === 0
              ? "Nenhum produto encontrado."
              : `${produtos.length} produto${produtos.length !== 1 ? "s" : ""} encontrado${produtos.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {!query && (
          <p className="text-lavendergrey font-sans text-base mt-4">
            Digite um fandom, tema ou nome de loja na barra de busca acima.
          </p>
        )}

        {/* Estado vazio com sugestões */}
        {query && produtos.length === 0 && (
          <div className="mt-8 p-6 rounded-card bg-mauve/10 max-w-lg">
            <p className="font-display font-semibold text-text-primary mb-3">Sugestões de busca:</p>
            <div className="flex flex-wrap gap-2">
              {["One Piece", "Naruto", "Pokémon", "D&D", "Magic", "Dragon Ball", "K-Pop"].map((tag) => (
                <a
                  key={tag}
                  href={`/busca?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 rounded-full bg-aquamarine/50 text-text-primary text-sm font-semibold hover:bg-aquamarine transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
            <div className="mt-4">
              <a href="/lojas" className="text-sm text-mauve hover:underline font-semibold">
                Ver todas as lojas →
              </a>
            </div>
          </div>
        )}

        {/* Resultados */}
        {produtos.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
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
                      {img && (
                        <img src={img.url} alt={produto.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-lavendergrey font-sans uppercase tracking-wide">{produto.store.name}</span>
                      <h2 className="font-display font-semibold text-text-primary text-base mt-1 mb-2 line-clamp-2">{produto.name}</h2>
                      <div className="flex flex-wrap gap-1 mb-3">
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

        {/* Aviso de fallback (busca semântica não disponível) */}
        {query && (
          <p className="mt-8 text-xs text-lavendergrey font-sans bg-lavendergrey/10 rounded-lg px-4 py-2 inline-block">
            💡 Busca por similaridade semântica (embeddings) será ativada quando <code>OPENAI_API_KEY</code> for configurada.
          </p>
        )}
      </div>
    </main>
  );
}
