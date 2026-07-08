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
    <main>
      {/* 1. Header — design-system §3.1 */}
      <Header />

      {/* 2. Barra de navegação por categoria — design-system §3.2 */}
      <CategoryNav />

      {/* 3. Banner hero (carrossel) — design-system §3.3 */}
      <HeroBanner />

      {/* 4. Carrossel de lojas parceiras — design-system §3.4 */}
      <StoreCarousel stores={lojas} />

      {/* Divisor */}
      <div className="h-px bg-lavendergrey/10 mx-8" />

      {/* 5. Grid de produtos/destaques — design-system §3.5 */}
      <ProductGrid products={produtos} />

      {/* Footer simples */}
      <footer className="bg-blushpop/30 border-t border-lavendergrey/10 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-lavendergrey font-sans">
          <p>© 2026 Geekfy — Todos os direitos reservados</p>
          <div className="flex gap-6">
            <Link href="/lojas" className="hover:text-text-primary transition-colors">Lojas</Link>
            <Link href="/cadastro" className="hover:text-text-primary transition-colors">Cadastre sua loja</Link>
            <Link href="/admin" className="hover:text-text-primary transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
