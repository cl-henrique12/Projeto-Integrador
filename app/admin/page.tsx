import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Painel de Aprovação | Geekfy",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verificar role ADMIN via Prisma
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/painel");
  }

  const lojasPendentes = await prisma.store.findMany({
    where: { status: "PENDING" },
    include: {
      owner: { select: { name: true, email: true } },
      categories: { include: { category: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const lojasAprovadas = await prisma.store.count({ where: { status: "APPROVED" } });
  const totalProdutos = await prisma.product.count({ where: { status: "ACTIVE" } });
  const totalBuscas = await prisma.searchQuery.count();

  return (
    <main className="min-h-screen bg-gradient-to-br from-mauve/10 via-base to-blushpop/10">
      {/* Header admin */}
      <header className="bg-mauve shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-display font-black text-lg text-text-primary">Geekfy</Link>
            <span className="px-2 py-0.5 bg-text-primary/10 rounded-full text-xs font-bold text-text-primary">Admin</span>
          </div>
          <span className="text-xs text-text-primary/70 font-sans hidden sm:block">{user.email}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-display font-black text-2xl text-text-primary mb-2">Painel Administrativo</h1>
        <p className="text-lavendergrey text-sm font-sans mb-8">Gerencie lojas, produtos e conteúdo da plataforma.</p>

        {/* Métricas gerais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Lojas aprovadas",  value: lojasAprovadas },
            { label: "Pendentes",         value: lojasPendentes.length, highlight: lojasPendentes.length > 0 },
            { label: "Produtos ativos",   value: totalProdutos },
            { label: "Buscas realizadas", value: totalBuscas },
          ].map((m) => (
            <div key={m.label} className={`rounded-card p-4 shadow-sm border ${m.highlight ? "bg-yellow-50 border-yellow-200" : "bg-white border-lavendergrey/10"}`}>
              <p className="text-lavendergrey text-xs font-sans uppercase tracking-wide mb-1">{m.label}</p>
              <p className={`font-display font-black text-2xl ${m.highlight ? "text-yellow-600" : "text-text-primary"}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Lojas pendentes */}
        <h2 className="font-display font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
          Lojas Pendentes de Aprovação
          {lojasPendentes.length > 0 && (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">{lojasPendentes.length}</span>
          )}
        </h2>

        {lojasPendentes.length === 0 ? (
          <div className="bg-white rounded-card p-8 text-center border border-lavendergrey/10 shadow-sm">
            <p className="text-lavendergrey font-sans text-sm">✅ Nenhuma loja pendente de aprovação.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {lojasPendentes.map((loja) => (
              <li key={loja.id} className="bg-white rounded-card p-5 shadow-sm border border-yellow-100 hover:border-yellow-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-text-primary text-lg">{loja.name}</h3>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">PENDING</span>
                    </div>
                    <p className="text-lavendergrey text-xs font-sans mb-1">
                      <strong>Dono:</strong> {loja.owner.name} ({loja.owner.email})
                    </p>
                    <p className="text-lavendergrey text-xs font-sans mb-1">
                      <strong>WhatsApp:</strong> {loja.whatsapp}
                      {loja.neighborhood && <> · <strong>Bairro:</strong> {loja.neighborhood}</>}
                    </p>
                    {loja.description && (
                      <p className="text-text-primary/70 text-sm mt-2 font-sans line-clamp-2">{loja.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {loja.categories.map(({ category }) => (
                        <span key={category.id} className="px-2 py-0.5 rounded-full bg-aquamarine/40 text-text-primary text-xs font-semibold">
                          {category.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-lavendergrey mt-2">
                      {loja._count.products} produto{loja._count.products !== 1 ? "s" : ""} · Cadastrado em {new Date(loja.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                    <form action={`/api/admin/lojas/${loja.id}`} method="PATCH">
                      <input type="hidden" name="status" value="APPROVED" />
                      <button
                        id={`btn-aprovar-${loja.id}`}
                        type="submit"
                        className="w-full px-5 py-2 bg-aquamarine text-text-primary rounded-full font-bold text-sm hover:bg-aquamarine/70 transition-colors shadow-sm"
                        onClick={async (e) => {
                          e.preventDefault();
                          await fetch(`/api/admin/lojas/${loja.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "APPROVED" }),
                          });
                          window.location.reload();
                        }}
                      >
                        ✅ Aprovar
                      </button>
                    </form>
                    <button
                      id={`btn-rejeitar-${loja.id}`}
                      onClick={async () => {
                        const motivo = window.prompt("Motivo da rejeição (opcional):");
                        await fetch(`/api/admin/lojas/${loja.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "REJECTED", reason: motivo }),
                        });
                        window.location.reload();
                      }}
                      className="px-5 py-2 border border-red-200 text-red-600 rounded-full font-bold text-sm hover:bg-red-50 transition-colors"
                    >
                      ❌ Rejeitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Links rápidos */}
        <div className="mt-10 flex gap-3 flex-wrap">
          <Link href="/lojas" className="text-sm text-mauve hover:underline font-semibold">Ver vitrine pública →</Link>
          <Link href="/" className="text-sm text-lavendergrey hover:text-text-primary font-semibold">Voltar à home</Link>
        </div>
      </div>
    </main>
  );
}
