import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/tags (Criar tag)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser || dbUser.role !== "ADMIN") return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const { name, slug, synonyms } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        synonyms: Array.isArray(synonyms) ? synonyms : [],
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tag:", error);
    return NextResponse.json({ error: "Erro interno ou tag duplicada" }, { status: 500 });
  }
}
