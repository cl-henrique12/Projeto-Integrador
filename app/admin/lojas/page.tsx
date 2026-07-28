import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AdminLayout from "../AdminLayout";
import StoreReviewClient from "./StoreReviewClient";

export const metadata: Metadata = {
  title: "Admin — Revisar Lojas | Geekfy",
};

export default async function AdminLojasPage() {
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

  const stores = await prisma.store.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      categories: { include: { category: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedStores = stores.map((store) => ({
    ...store,
    createdAt: store.createdAt.toISOString(),
  }));

  return (
    <AdminLayout userEmail={user.email} activeTab="lojas">
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
          1. Revisar Cadastro de Lojas
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#8786A8" }}>
          Analise solicitações pendentes de cadastro, verifique contatos e categorias, e gerencie aprovações ou rejeições com motivo.
        </p>
      </div>

      <StoreReviewClient initialStores={formattedStores} />
    </AdminLayout>
  );
}
