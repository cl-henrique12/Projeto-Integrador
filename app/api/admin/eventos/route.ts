import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/eventos (Criar Evento)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser || dbUser.role !== "ADMIN") return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const body = await request.json();
    const { name, description, date, address, neighborhood, latitude, longitude } = body;

    if (!name || !date || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Nome, data e localização no mapa (lat/lng) são obrigatórios" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        date: new Date(date),
        address: address ? address.trim() : null,
        neighborhood: neighborhood ? neighborhood.trim() : null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json({ error: "Erro interno ao cadastrar evento" }, { status: 500 });
  }
}
