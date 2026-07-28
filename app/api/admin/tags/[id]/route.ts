import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/admin/tags/[id]
export async function PATCH(
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

    const { id } = await params;
    const { name, slug, synonyms } = await request.json();

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(slug && { slug: slug.trim().toLowerCase().replace(/\s+/g, "-") }),
        ...(Array.isArray(synonyms) && { synonyms }),
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Erro ao atualizar tag:", error);
    return NextResponse.json({ error: "Erro ao atualizar tag" }, { status: 500 });
  }
}

// DELETE /api/admin/tags/[id]
export async function DELETE(
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

    const { id } = await params;
    await prisma.tag.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar tag:", error);
    return NextResponse.json({ error: "Erro ao deletar tag" }, { status: 500 });
  }
}
