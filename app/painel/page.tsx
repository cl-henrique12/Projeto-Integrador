import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel do Lojista | Geekfy",
};

export default async function PainelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Buscar dados da loja do lojista
  const loja = await prisma.store.findFirst({
    where: { owner: { email: user.email! } },
    include: {
      products: {
        where: { status: "ACTIVE" },
        include: { images: { take: 1 } },
        orderBy: { viewsCount: "desc" },
        take: 10,
      },
      categories: { include: { category: true } },
      _count: { select: { products: true } },
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-aquamarine/10 via-base to-mauve/10">
      {/* Header do painel */}
      <header className="bg-blushpop shadow-sm">
        <div className="page-container py-4 flex items-center justify-between">
          <Link href="/" className="font-display font-black text-xl text-text-primary">
            Geekfy <span className="text-lavendergrey font-normal text-sm">Painel</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-primary/70 font-sans hidden sm:block">{user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-sm text-lavendergrey hover:text-text-primary transition-colors font-semibold">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="page-container py-10">
        {!loja ? (
          /* Sem loja cadastrada */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-mauve/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-mauve">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
            <h1 className="font-display font-black text-2xl text-text-primary mb-2">Você ainda não tem uma loja</h1>
            <p className="text-lavendergrey font-sans text-sm mb-6 max-w-sm mx-auto">
              Cadastre sua loja geek e comece a receber clientes de toda Manaus!
            </p>
            <Link
              href="/cadastro/loja"
              className="inline-block bg-mauve text-text-primary px-8 py-3 rounded-full font-bold text-sm hover:bg-blushpop transition-colors shadow-md"
            >
              Cadastrar minha loja →
            </Link>
          </div>
        ) : (
          <>
            {/* Status da loja */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display font-black text-2xl text-text-primary">{loja.name}</h1>
                <p className="text-lavendergrey text-sm font-sans mt-0.5">{loja.neighborhood} · {loja.city}</p>
              </div>
              <div className="flex items-center gap-3">
                {loja.status === "PENDING" && (
                  <span className="px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">
                    ⏳ Aguardando aprovação
                  </span>
                )}
                {loja.status === "APPROVED" && (
                  <span className="px-4 py-1.5 rounded-full bg-aquamarine/50 text-text-primary text-xs font-bold">
                    ✅ Loja aprovada e visível
                  </span>
                )}
                {loja.status === "REJECTED" && (
                  <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    ❌ Cadastro rejeitado
                  </span>
                )}
                <Link
                  href={`/lojas/${loja.slug}`}
                  className="px-4 py-1.5 rounded-full border border-lavendergrey/30 text-text-primary text-xs font-semibold hover:border-mauve transition-colors"
                >
                  Ver página pública →
                </Link>
              </div>
            </div>

            {/* Cards de métricas — RF05 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              <div className="bg-white rounded-card p-5 shadow-sm border border-lavendergrey/10">
                <p className="text-lavendergrey text-xs font-sans uppercase tracking-wide mb-1">Views da loja</p>
                <p className="font-display font-black text-3xl text-text-primary">{loja.viewsCount.toLocaleString("pt-BR")}</p>
              </div>
              <div className="bg-white rounded-card p-5 shadow-sm border border-lavendergrey/10">
                <p className="text-lavendergrey text-xs font-sans uppercase tracking-wide mb-1">Produtos ativos</p>
                <p className="font-display font-black text-3xl text-text-primary">{loja._count.products}</p>
              </div>
              <div className="bg-white rounded-card p-5 shadow-sm border border-lavendergrey/10">
                <p className="text-lavendergrey text-xs font-sans uppercase tracking-wide mb-1">Categorias</p>
                <p className="font-display font-black text-3xl text-text-primary">{loja.categories.length}</p>
              </div>
            </div>

            {/* Ações rápidas */}
            <div className="flex gap-3 mb-8 flex-wrap">
              <Link
                href="/painel/produtos/novo"
                className="flex items-center gap-2 bg-mauve text-text-primary px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-blushpop transition-colors shadow-sm"
              >
                + Adicionar produto
              </Link>
              <Link
                href="/painel/loja/editar"
                className="flex items-center gap-2 border border-lavendergrey/30 text-text-primary px-5 py-2.5 rounded-full font-semibold text-sm hover:border-mauve hover:bg-mauve/10 transition-all"
              >
                Editar dados da loja
              </Link>
            </div>

            {/* Lista de produtos */}
            <h2 className="font-display font-bold text-lg text-text-primary mb-4">Meus Produtos</h2>
            {loja.products.length === 0 ? (
              <div className="bg-white rounded-card p-8 text-center border border-lavendergrey/10 shadow-sm">
                <p className="text-lavendergrey font-sans text-sm mb-4">Você ainda não tem produtos cadastrados.</p>
                <Link href="/painel/produtos/novo" className="inline-block bg-aquamarine text-text-primary px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-aquamarine/80 transition-colors">
                  Adicionar primeiro produto
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {loja.products.map((produto) => {
                  const img = produto.images[0];
                  return (
                    <li key={produto.id} className="flex items-center gap-4 bg-white rounded-card px-4 py-3 shadow-sm border border-lavendergrey/10 hover:border-mauve/30 transition-colors">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-mauve/10 flex-shrink-0">
                        {img && <img src={img.url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-text-primary text-sm truncate">{produto.name}</p>
                        <p className="text-lavendergrey text-xs font-sans">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(produto.price))}
                          {" · "}
                          {produto.viewsCount} view{produto.viewsCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Link href={`/produtos/${produto.id}`} className="text-xs text-mauve hover:underline font-semibold flex-shrink-0">
                        Ver →
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}
