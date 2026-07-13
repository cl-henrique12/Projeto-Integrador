import { prisma } from "@/lib/prisma";
import { StoreStatus, ProductStatus } from "@prisma/client";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import HeroBanner from "@/app/components/HeroBanner";
import StoreCarousel from "@/app/components/StoreCarousel";
import ProductGrid from "@/app/components/ProductGrid";
import Link from "next/link";

// Server Component — dados buscados direto do banco via Prisma
// design-system §3: "exatamente estes componentes, nesta ordem"
export default async function HomePage() {
  // Lojas APPROVED para o carrossel (design-system §3.4)
  const lojas = await prisma.store.findMany({
    where: { status: StoreStatus.APPROVED },
    select: { id: true, slug: true, name: true, logoUrl: true },
    orderBy: { viewsCount: "desc" },
    take: 20,
  });

  // Produtos ACTIVE de lojas APPROVED para o grid (design-system §3.5)
  const produtos = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      store: { status: StoreStatus.APPROVED },
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      store: { select: { name: true, slug: true } },
    },
    orderBy: { viewsCount: "desc" },
    take: 9,
  });

  return (
    <main style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 1. Header — design-system §3.1 */}
      <Header />

      {/* 2. Barra de navegação por categoria — design-system §3.2 */}
      <CategoryNav />

      {/* 3. Banner hero (carrossel) — design-system §3.3 */}
      <HeroBanner />

      {/* 4. Carrossel de lojas parceiras — design-system §3.4 */}
      <StoreCarousel stores={lojas} />

      {/* Divisor */}
      <div
        style={{
          height: "1px",
          backgroundColor: "rgba(135,134,168,0.10)",
          margin: "0 2rem",
        }}
      />

      {/* 5. Grid de produtos/destaques — design-system §3.5 */}
      <div style={{ flex: 1 }}>
        <ProductGrid products={produtos} />
      </div>

      {/* Footer — design-system §3.6
          Fundo lavendergrey (#8786A8), texto branco, parte do fluxo normal da página */}
      <footer
        style={{
          backgroundColor: "var(--color-lavendergrey)",
          marginTop: 0,
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "2.5rem 1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    color: "#ffffff",
                    fontSize: "0.7rem",
                  }}
                >
                  GKF
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: "1.125rem",
                }}
              >
                Geekfy
              </span>
            </div>

            {/* Links — fiéis ao Figma: Lojas, Cadastre sua loja, Admin */}
            <nav
              style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}
              aria-label="Links do rodapé"
            >
              <Link
                href="/lojas"
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Lojas
              </Link>
              <Link
                href="/cadastro"
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Cadastre sua loja
              </Link>
              <Link
                href="/admin"
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Admin
              </Link>
            </nav>

            {/* Copyright */}
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              © 2026 Geekfy — Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
