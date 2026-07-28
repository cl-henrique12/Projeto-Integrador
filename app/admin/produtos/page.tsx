import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AdminLayout from "../AdminLayout";
import ProductModerationClient from "./ProductModerationClient";

export const metadata: Metadata = {
  title: "Admin — Moderar Produtos | Geekfy",
};

export default async function AdminProdutosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });
  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/painel");
  }

  const products = await prisma.product.findMany({
    include: {
      store: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
  }));

  return (
    <AdminLayout userEmail={user.email} activeTab="produtos">
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
          2. Moderar Produtos
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#8786A8" }}>
          Pesquise produtos cadastrados pelas lojas parceiras, ative/inative anúncios e edite conteúdos se necessário.
        </p>
      </div>

      <ProductModerationClient initialProducts={formattedProducts} />
    </AdminLayout>
  );
}
