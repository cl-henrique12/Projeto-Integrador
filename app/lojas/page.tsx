import { prisma } from "@/lib/prisma";
import { StoreStatus } from "@prisma/client";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import Image from "next/image";
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

      <div className="page-container py-12">
        <h1 className="font-display font-black text-3xl text-text-primary mb-2">
          Lojas Parceiras
        </h1>
        <p className="text-lavendergrey text-sm mb-8 font-sans">
          {lojas.length} loja{lojas.length !== 1 ? "s" : ""} encontrada{lojas.length !== 1 ? "s" : ""}
          {categoria ? ` em "${categoria}"` : ""}
        </p>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8">
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
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lojas.map((loja) => (
              <li key={loja.id}>
                <Link
                  href={`/lojas/${loja.slug}`}
                  className="block rounded-card overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform border border-lavendergrey/10 group"
                >
                  {/* Cover */}
                  <div className="relative h-36 bg-gradient-to-br from-aquamarine/30 to-mauve/30">
                    {loja.coverUrl && (
                      <Image src={loja.coverUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    {/* Logo sobre o cover */}
                    <div className="absolute -bottom-6 left-4">
                      <div className="w-14 h-14 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                        {loja.logoUrl ? (
                          <Image src={loja.logoUrl} alt={`Logo ${loja.name}`} width={56} height={56} className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-mauve to-blushpop flex items-center justify-center">
                            <span className="font-display font-black text-lg text-text-primary">{loja.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pt-8 pb-4">
                    <h2 className="font-display font-bold text-lg text-text-primary">{loja.name}</h2>
                    {loja.neighborhood && (
                      <p className="text-xs text-lavendergrey mt-0.5">{loja.neighborhood} · {loja.city}</p>
                    )}
                    {loja.description && (
                      <p className="text-sm text-text-primary/70 mt-2 line-clamp-2 font-sans">{loja.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {loja.categories.slice(0, 3).map(({ category }) => (
                        <span key={category.id} className="px-2 py-0.5 rounded-full bg-aquamarine/50 text-text-primary text-xs font-semibold">
                          {category.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-lavendergrey mt-3">{loja._count.products} produto{loja._count.products !== 1 ? "s" : ""}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
