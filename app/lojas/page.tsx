import { prisma } from "@/lib/prisma";
import { StoreStatus } from "@prisma/client";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import StoreCard from "@/app/components/StoreCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lojas Geek | Geekfy",
  description: "Explore todas as lojas geek de Manaus. Filtre por categoria e encontre seus produtos favoritos.",
};

interface PageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function LojasPage({ searchParams }: PageProps) {
  const { categoria } = await searchParams;

  const lojas = await prisma.store.findMany({
    where: {
      status: StoreStatus.APPROVED,
      ...(categoria
        ? { categories: { some: { category: { slug: categoria } } } }
        : {}),
    },
    include: {
      categories: { include: { category: true } },
      _count: { select: { products: true } },
    },
    orderBy: { viewsCount: "desc" },
  });

  const categorias = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <main>
      <Header />
      <CategoryNav />

      <div className="page-container py-section">
        <h1 className="font-display font-black text-3xl text-text-primary" style={{ marginBottom: '3px', paddingTop: '20px' }}>
          Lojas Parceiras
        </h1>
        <p className="text-lavendergrey text-sm font-sans" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
          {lojas.length} loja{lojas.length !== 1 ? "s" : ""} encontrada{lojas.length !== 1 ? "s" : ""}
          {categoria ? ` em "${categoria}"` : ""}
        </p>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto" style={{ marginTop: '6px', marginBottom: '10px', paddingBottom: '8px' }}>
          <Link
            href="/lojas"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${!categoria ? "bg-mauve text-text-primary shadow" : "bg-lavendergrey/10 text-lavendergrey hover:bg-mauve/30"}`}
          >
            Todas
          </Link>
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/lojas?categoria=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${categoria === cat.slug ? "bg-mauve text-text-primary shadow" : "bg-lavendergrey/10 text-lavendergrey hover:bg-mauve/30"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Grid de lojas */}
        {lojas.length === 0 ? (
          <div className="text-center py-16 text-lavendergrey">
            <p className="text-lg font-semibold mb-2">Nenhuma loja encontrada</p>
            <Link href="/lojas" className="text-sm text-mauve hover:underline">Ver todas as lojas</Link>
          </div>
        ) : (
          <ul className="stores-grid">
            {lojas.map((loja) => (
              <li key={loja.id}>
                <StoreCard
                  slug={loja.slug}
                  name={loja.name}
                  logoUrl={loja.logoUrl}
                  coverUrl={loja.coverUrl}
                  neighborhood={loja.neighborhood}
                  city={loja.city}
                  description={loja.description}
                  categories={loja.categories}
                  productCount={loja._count.products}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
