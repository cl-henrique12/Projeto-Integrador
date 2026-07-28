import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import AdminLayout from "./AdminLayout";

export const metadata: Metadata = {
  title: "Admin — Dashboard de Moderação | Geekfy",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verificar role ADMIN no Prisma
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });
  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/painel");
  }

  // Contagens para os cards de moderação
  const lojasPendentesCount = await prisma.store.count({
    where: { status: "PENDING" },
  });
  const lojasAprovadasCount = await prisma.store.count({
    where: { status: "APPROVED" },
  });
  const produtosTotalCount = await prisma.product.count();
  const categoriasCount = await prisma.category.count();
  const tagsCount = await prisma.tag.count();
  const eventosCount = await prisma.event.count();

  const adminActions = [
    {
      id: "lojas",
      title: "1. Revisar Cadastro de Loja",
      description:
        "Analise solicitações de novas lojas, verifique dados e aprove ou rejeite com motivo.",
      href: "/admin/lojas",
      badge: lojasPendentesCount > 0 ? `${lojasPendentesCount} pendente(s)` : "Em dia",
      badgeColor: lojasPendentesCount > 0 ? "#FFD166" : "#8EF8D5",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "2rem", height: "2rem", color: "#1A1A2E" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36rem-4.5 0H9m-4.5 0a2.25 2.25 0 0 1-2.25-2.25V5.25A2.25 2.25 0 0 1 4.5 3h15a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 19.5 21h-6Z" />
        </svg>
      ),
      metricLabel: "Lojas em análise",
      metricValue: lojasPendentesCount,
    },
    {
      id: "produtos",
      title: "2. Moderar Produtos",
      description:
        "Busque produtos da plataforma, altere status (Ativo/Inativo) e edite conteúdo impróprio.",
      href: "/admin/produtos",
      badge: `${produtosTotalCount} produtos`,
      badgeColor: "#D3BCFF",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "2rem", height: "2rem", color: "#1A1A2E" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
      metricLabel: "Produtos cadastrados",
      metricValue: produtosTotalCount,
    },
    {
      id: "categorias-tags",
      title: "3. Gerenciar Categorias & Tags",
      description:
        "CRUD para categorias de lojas e tags de fandom (usadas na busca semântica).",
      href: "/admin/categorias-tags",
      badge: `${categoriasCount} cat. / ${tagsCount} tags`,
      badgeColor: "#FFBFEA",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "2rem", height: "2rem", color: "#1A1A2E" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      ),
      metricLabel: "Total de taxonomias",
      metricValue: categoriasCount + tagsCount,
    },
    {
      id: "eventos",
      title: "4. Cadastrar Evento",
      description:
        "Cadastre feiras/convenções com seletor no mapa (lat/long) e vincule lojas participantes.",
      href: "/admin/eventos",
      badge: `${eventosCount} evento(s)`,
      badgeColor: "#8EF8D5",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "2rem", height: "2rem", color: "#1A1A2E" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      ),
      metricLabel: "Eventos cadastrados",
      metricValue: eventosCount,
    },
  ];

  return (
    <AdminLayout userEmail={user.email} activeTab="dashboard">
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "1.75rem",
            color: "#1A1A2E",
            marginBottom: "0.5rem",
          }}
        >
          Painel de Moderação Administrativa
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#8786A8" }}>
          Gerencie o ecossistema Geekfy seguindo as etapas de moderação do sistema.
        </p>
      </div>

      {/* Grid com os 4 Cards Principais do Fluxograma */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {adminActions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "#FFFFFF",
              borderRadius: "var(--radius-card)",
              padding: "1.5rem",
              border: "1px solid rgba(135,134,168,0.15)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "3.25rem",
                    height: "3.25rem",
                    borderRadius: "12px",
                    backgroundColor: "rgba(211,188,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {action.icon}
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                    backgroundColor: action.badgeColor,
                    color: "#1A1A2E",
                  }}
                >
                  {action.badge}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "#1A1A2E",
                  marginBottom: "0.5rem",
                }}
              >
                {action.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  color: "#8786A8",
                  lineHeight: 1.5,
                  marginBottom: "1.25rem",
                }}
              >
                {action.description}
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(135,134,168,0.1)",
                paddingTop: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "#7B6CB5",
                }}
              >
                Acessar seção →
              </span>
              <span style={{ fontSize: "0.75rem", color: "#8786A8" }}>
                {action.metricLabel}: <strong>{action.metricValue}</strong>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Resumo Rápido do Banco */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "var(--radius-card)",
          padding: "1.5rem",
          border: "1px solid rgba(135,134,168,0.15)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#1A1A2E",
            marginBottom: "1rem",
          }}
        >
          📊 Estatísticas Rápidas do Ecossistema
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          <div style={{ backgroundColor: "#F8F8FC", padding: "1rem", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.75rem", color: "#8786A8", marginBottom: "0.25rem" }}>Lojas Aprovadas</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "#1A1A2E" }}>{lojasAprovadasCount}</p>
          </div>
          <div style={{ backgroundColor: "#F8F8FC", padding: "1rem", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.75rem", color: "#8786A8", marginBottom: "0.25rem" }}>Lojas Pendentes</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: lojasPendentesCount > 0 ? "#D97706" : "#1A1A2E" }}>{lojasPendentesCount}</p>
          </div>
          <div style={{ backgroundColor: "#F8F8FC", padding: "1rem", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.75rem", color: "#8786A8", marginBottom: "0.25rem" }}>Categorias de Loja</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "#1A1A2E" }}>{categoriasCount}</p>
          </div>
          <div style={{ backgroundColor: "#F8F8FC", padding: "1rem", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.75rem", color: "#8786A8", marginBottom: "0.25rem" }}>Tags de Fandom</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "#1A1A2E" }}>{tagsCount}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
