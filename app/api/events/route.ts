import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events?filter=future|past|all
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filter = searchParams.get("filter") || "all";

  const now = new Date();

  // Filtro por data
  const dateFilter =
    filter === "future"
      ? { date: { gte: now } }
      : filter === "past"
        ? { date: { lt: now } }
        : {};

  const events = await prisma.event.findMany({
    where: dateFilter,
    include: {
      stores: {
        where: { confirmed: true },
        include: {
          store: {
            select: { name: true, slug: true },
          },
        },
      },
    },
    orderBy: { date: "asc" },
  });

  // Formatar resposta
  const formatted = events.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    date: event.date.toISOString(),
    address: event.address,
    neighborhood: event.neighborhood,
    latitude: event.latitude,
    longitude: event.longitude,
    stores: event.stores.map((es) => ({
      name: es.store.name,
      slug: es.store.slug,
    })),
  }));

  return NextResponse.json(formatted);
}
