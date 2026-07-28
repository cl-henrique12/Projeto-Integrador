import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/eventos/[id]/stores (Confirmar/vincular lojas no evento)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser || dbUser.role !== "ADMIN") return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const { id: eventId } = await params;
    const { storeIds } = await request.json();

    if (!Array.isArray(storeIds)) {
      return NextResponse.json({ error: "storeIds deve ser uma lista" }, { status: 400 });
    }

    // Deletar vínculos atuais do evento
    await prisma.eventStore.deleteMany({ where: { eventId } });

    // Criar novos vínculos de lojas confirmadas
    if (storeIds.length > 0) {
      await prisma.eventStore.createMany({
        data: storeIds.map((storeId: string) => ({
          eventId,
          storeId,
          confirmed: true,
        })),
      });
    }

    return NextResponse.json({ success: true, count: storeIds.length });
  } catch (error) {
    console.error("Erro ao vincular lojas ao evento:", error);
    return NextResponse.json({ error: "Erro ao vincular lojas ao evento" }, { status: 500 });
  }
}
