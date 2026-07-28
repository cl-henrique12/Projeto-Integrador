import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AdminLayout from "../AdminLayout";
import EventFormClient from "./EventFormClient";

export const metadata: Metadata = {
  title: "Admin — Cadastrar Evento | Geekfy",
};

export default async function AdminEventosPage() {
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

  // Buscar eventos existentes com lojas confirmadas
  const events = await prisma.event.findMany({
    include: {
      stores: {
        where: { confirmed: true },
        include: {
          store: { select: { name: true } },
        },
      },
    },
    orderBy: { date: "asc" },
  });

  // Buscar lojas aprovadas (APPROVED) para vinculação no evento
  const approvedStores = await prisma.store.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      name: true,
      slug: true,
      neighborhood: true,
    },
    orderBy: { name: "asc" },
  });

  const formattedEvents = events.map((ev) => ({
    ...ev,
    date: ev.date.toISOString(),
  }));

  return (
    <AdminLayout userEmail={user.email} activeTab="eventos">
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
          4. Cadastrar & Gerenciar Eventos Geek
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#8786A8" }}>
          Cadastre novas feiras ou convenções com o mapa interativo e vincule as lojas participantes que foram aprovadas na plataforma.
        </p>
      </div>

      <EventFormClient initialEvents={formattedEvents} approvedStores={approvedStores} />
    </AdminLayout>
  );
}
