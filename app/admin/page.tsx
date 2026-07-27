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
        <div className="page-container flex items-center justify-between" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <div className="flex items-center" style={{ gap: "12px" }}>
            <Link href="/" className="font-display font-black text-lg text-text-primary">Geekfy</Link>
            <span className="px-2 py-0.5 bg-text-primary/10 rounded-full text-xs font-bold text-text-primary">Admin</span>
          </div>
          <span className="text-xs text-text-primary/70 font-sans hidden sm:block">{user.email}</span>
        </div>
      </header>

      <div className="page-container" style={{ paddingTop: "40px", paddingBottom: "64px" }}>
        <h1 className="font-display font-black text-2xl text-text-primary" style={{ marginBottom: "8px" }}>Painel Administrativo</h1>
        <p className="text-lavendergrey text-sm font-sans" style={{ marginBottom: "32px" }}>
          Gerencie lojas, produtos e conteúdo da plataforma.
        </p>

        {/* Métricas gerais */}
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "20px", marginBottom: "40px" }}>
          {[
            { label: "Lojas aprovadas",  value: lojasAprovadas },
            { label: "Pendentes",         value: lojasPendentes.length, highlight: lojasPendentes.length > 0 },
            { label: "Produtos ativos",   value: totalProdutos },
            { label: "Buscas realizadas", value: totalBuscas },
          ].map((m) => (
            <div
              key={m.label}
              className={`rounded-card shadow-sm border ${m.highlight ? "bg-yellow-50 border-yellow-200" : "bg-white border-lavendergrey/10"}`}
              style={{ padding: "20px" }}
            >
              <p className="text-lavendergrey text-xs font-sans uppercase tracking-wide" style={{ marginBottom: "8px" }}>{m.label}</p>
              <p className={`font-display font-black text-2xl ${m.highlight ? "text-yellow-600" : "text-text-primary"}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Lojas pendentes */}
        <h2 className="font-display font-bold text-lg text-text-primary flex items-center" style={{ gap: "8px", marginBottom: "24px" }}>
          Lojas Pendentes de Aprovação
          {lojasPendentes.length > 0 && (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">{lojasPendentes.length}</span>
          )}
        </h2>

        {lojasPendentes.length === 0 ? (
          <div className="bg-white rounded-card text-center border border-lavendergrey/10 shadow-sm" style={{ padding: "40px 32px" }}>
            <p className="text-lavendergrey font-sans text-sm">✅ Nenhuma loja pendente de aprovação.</p>
          </div>
        ) : (
          <ul style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {lojasPendentes.map((loja) => (
              <li
                key={loja.id}
                className="bg-white rounded-card shadow-sm border border-yellow-100 hover:border-yellow-200 transition-colors"
                style={{ padding: "24px" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start" style={{ gap: "20px" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center" style={{ gap: "8px", marginBottom: "8px" }}>
                      <h3 className="font-display font-bold text-text-primary text-lg">{loja.name}</h3>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">PENDING</span>
                    </div>
                    <p className="text-lavendergrey text-xs font-sans" style={{ marginBottom: "4px" }}>
                      <strong>Dono:</strong> {loja.owner.name} ({loja.owner.email})
                    </p>
                    <p className="text-lavendergrey text-xs font-sans" style={{ marginBottom: "4px" }}>
                      <strong>WhatsApp:</strong> {loja.whatsapp}
                      {loja.neighborhood && <> · <strong>Bairro:</strong> {loja.neighborhood}</>}
                    </p>
                    {loja.description && (
                      <p className="text-text-primary/70 text-sm font-sans line-clamp-2" style={{ marginTop: "8px" }}>{loja.description}</p>
                    )}
                    <div className="flex flex-wrap" style={{ gap: "6px", marginTop: "10px" }}>
                      {loja.categories.map(({ category }) => (
                        <span key={category.id} className="px-2 py-0.5 rounded-full bg-aquamarine/40 text-text-primary text-xs font-semibold">
                          {category.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-lavendergrey" style={{ marginTop: "8px" }}>
                      {loja._count.products} produto{loja._count.products !== 1 ? "s" : ""} · Cadastrado em {new Date(loja.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-row sm:flex-col flex-shrink-0" style={{ gap: "8px" }}>
                    <form action={`/api/admin/lojas/${loja.id}`} method="PATCH">
                      <input type="hidden" name="status" value="APPROVED" />
                      <button
                        id={`btn-aprovar-${loja.id}`}
                        type="submit"
                        className="w-full bg-aquamarine text-text-primary rounded-full font-bold text-sm hover:bg-aquamarine/70 transition-colors shadow-sm"
                        style={{ padding: "10px 20px" }}
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
                      className="border border-red-200 text-red-600 rounded-full font-bold text-sm hover:bg-red-50 transition-colors"
                      style={{ padding: "10px 20px" }}
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
        <div className="flex flex-wrap" style={{ gap: "12px", marginTop: "40px" }}>
          <Link href="/lojas" className="text-sm text-mauve hover:underline font-semibold">Ver vitrine pública →</Link>
          <Link href="/" className="text-sm text-lavendergrey hover:text-text-primary font-semibold">Voltar à home</Link>
        </div>
      </div>
    </main>
  );
}
