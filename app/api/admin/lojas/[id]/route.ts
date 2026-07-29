import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/admin/lojas/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se é ADMIN
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, reason } = body;

    if (!["APPROVED", "REJECTED", "SUSPENDED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    if (status === "REJECTED" && (!reason || reason.trim() === "")) {
      return NextResponse.json(
        { error: "É obrigatório fornecer um motivo para a rejeição da loja." },
        { status: 400 }
      );
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? reason : null,
      },
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/lojas");
    revalidatePath(`/lojas/${updatedStore.slug}`);

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error("Erro ao atualizar loja:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar requisição" },
      { status: 500 }
    );
  }
}
