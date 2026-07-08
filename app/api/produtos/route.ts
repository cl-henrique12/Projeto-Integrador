import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, descricao, preco, imagemUrl, tags, ownerEmail } = body;

  if (!nome || !preco || !ownerEmail) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  // Buscar loja do lojista
  const loja = await prisma.store.findFirst({
    where: { owner: { email: ownerEmail } },
  });

  if (!loja) {
    return NextResponse.json({ error: "Nenhuma loja encontrada para este usuário." }, { status: 404 });
  }

  const produto = await prisma.product.create({
    data: {
      name: nome,
      description: descricao ?? null,
      price: preco,
      status: "ACTIVE",
      storeId: loja.id,
      images: imagemUrl
        ? { create: [{ url: imagemUrl, order: 0 }] }
        : undefined,
      tags: tags?.length > 0
        ? { create: (tags as string[]).map((tagId: string) => ({ tagId })) }
        : undefined,
    },
  });

  // TODO: Gerar embedding em background quando OPENAI_API_KEY estiver configurada

  return NextResponse.json({ success: true, id: produto.id }, { status: 201 });
}
