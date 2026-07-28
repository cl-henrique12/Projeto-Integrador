import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AdminLayout from "../AdminLayout";
import CategoriesTagsClient from "./CategoriesTagsClient";

export const metadata: Metadata = {
  title: "Admin — Categorias & Tags | Geekfy",
};

export default async function AdminCategoriasTagsPage() {
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

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { stores: true } },
    },
    orderBy: { name: "asc" },
  });

  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <AdminLayout userEmail={user.email} activeTab="categorias-tags">
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
          3. Gerenciar Categorias & Tags
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#8786A8" }}>
          Cadastre e modifique taxonomias. Categorias são usadas no perfil da loja e Tags orientam a busca por fandom.
        </p>
      </div>

      <CategoriesTagsClient initialCategories={categories} initialTags={tags} />
    </AdminLayout>
  );
}
