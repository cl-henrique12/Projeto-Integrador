import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/admin/produtos/[id]
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

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, name, description, price } = body;

    const updateData: {
      status?: "ACTIVE" | "INACTIVE";
      name?: string;
      description?: string | null;
      price?: number;
    } = {};

    if (status) updateData.status = status;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/lojas");
    revalidatePath(`/produtos/${id}`);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao moderar produto:", error);
    return NextResponse.json(
      { error: "Erro interno ao moderar produto" },
      { status: 500 }
    );
  }
}
