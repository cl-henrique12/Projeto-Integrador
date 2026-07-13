"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Categorias da nav — design-system §3.2
// "Acessórios", "Quadrinho/Mangás", "Camisas", "Artistas", "Parceiros"
const CATEGORIAS = [
  { label: "Acessórios",        href: "/lojas?categoria=acessorios",  slug: "acessorios" },
  { label: "Quadrinhos/Mangás", href: "/lojas?categoria=manga",       slug: "manga" },
  { label: "Camisas",           href: "/lojas?categoria=camisas",     slug: "camisas" },
  { label: "Artistas",          href: "/lojas?categoria=artistas",    slug: "artistas" },
  { label: "Parceiros",         href: "/lojas",                       slug: "parceiros" },
];

function CategoryNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategoria = searchParams.get("categoria");

  function isActive(cat: typeof CATEGORIAS[number]) {
    if (cat.slug === "parceiros") {
      return pathname === "/lojas" && !currentCategoria;
    }
    return currentCategoria === cat.slug;
  }

  return (
    // Fundo aquamarine — design-system §3.2 "Fundo em --color-accent-1 (Aquamarine)"
    <nav
      style={{
        backgroundColor: "var(--color-aquamarine)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
      aria-label="Navegação por categoria"
    >
      <ul
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",          // gap-2 — espaçamento visível entre itens
          overflowX: "auto",
          paddingTop: "0.25rem",    // reduzido de 0.5rem → barra mais compacta
          paddingBottom: "0.25rem",
          listStyle: "none",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties}
        className="scrollbar-hide"
      >
        {CATEGORIAS.map((cat) => {
          const active = isActive(cat);
          return (
            <li key={cat.slug} style={{ flexShrink: 0 }}>
              <Link
                href={cat.href}
                style={{
                  position: "relative",
                  padding: "0.375rem 1rem", // reduzido de 0.5rem 1.25rem → mais compacto
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  color: "var(--color-text-primary)",
                  backgroundColor: active ? "rgba(255,255,255,0.6)" : "transparent",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                }}
                aria-current={active ? "page" : undefined}
              >
                {cat.label}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      height: "2px",
                      width: "80%",
                      backgroundColor: "var(--color-text-primary)",
                      borderRadius: "9999px",
                    }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function CategoryNav() {
  return (
    <Suspense fallback={
      <nav
        style={{
          backgroundColor: "var(--color-aquamarine)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
        aria-label="Navegação por categoria"
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            height: "36px", // altura do skeleton ajustada junto com o padding
          }}
        />
      </nav>
    }>
      <CategoryNavInner />
    </Suspense>
  );
}
