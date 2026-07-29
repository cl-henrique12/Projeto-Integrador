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

  // Gerar embedding do produto se OPENAI_API_KEY estiver configurada
  if (process.env.OPENAI_API_KEY) {
    let tagNames: string[] = [];
    if (tags?.length > 0) {
      const tagRecords = await prisma.tag.findMany({
        where: { id: { in: tags as string[] } },
        select: { name: true },
      });
      tagNames = tagRecords.map(t => t.name);
    }
    const { updateProductEmbedding } = await import("@/lib/embedding");
    updateProductEmbedding(produto.id, nome, descricao, tagNames).catch(err => {
      console.warn("Erro ao atualizar embedding do produto em background:", err);
    });
  }

  return NextResponse.json({ success: true, id: produto.id }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, nome, descricao, preco, imagemUrl, tags, ownerEmail } = body;

    if (!productId || !ownerEmail) {
      return NextResponse.json({ error: "IDs obrigatórios ausentes." }, { status: 400 });
    }

    const produtoExistente = await prisma.product.findFirst({
      where: { id: productId, store: { owner: { email: ownerEmail } } },
      include: { tags: { select: { tagId: true } } },
    });

    if (!produtoExistente) {
      return NextResponse.json({ error: "Produto não encontrado ou permissão negada." }, { status: 404 });
    }

    // Verificar se texto relevante mudou (para economizar chamadas à API de embeddings)
    const oldTags = produtoExistente.tags.map(t => t.tagId).sort().join(",");
    const newTags = (tags as string[] || []).sort().join(",");
    const textoMudou =
      (nome !== undefined && nome !== produtoExistente.name) ||
      (descricao !== undefined && descricao !== produtoExistente.description) ||
      oldTags !== newTags;

    // Atualizar produto no banco
    const produtoAtualizado = await prisma.product.update({
      where: { id: productId },
      data: {
        name: nome ?? produtoExistente.name,
        description: descricao !== undefined ? descricao : produtoExistente.description,
        price: preco ?? produtoExistente.price,
        images: imagemUrl
          ? {
              deleteMany: {},
              create: [{ url: imagemUrl, order: 0 }],
            }
          : undefined,
        tags: tags
          ? {
              deleteMany: {},
              create: (tags as string[]).map(tagId => ({ tagId })),
            }
          : undefined,
      },
    });

    // Só gera o embedding se o texto ou tags realmente mudaram (cache de latência/custo)
    if (textoMudou && process.env.OPENAI_API_KEY) {
      let tagNames: string[] = [];
      if (tags?.length > 0) {
        const tagRecords = await prisma.tag.findMany({
          where: { id: { in: tags as string[] } },
          select: { name: true },
        });
        tagNames = tagRecords.map(t => t.name);
      }
      const { updateProductEmbedding } = await import("@/lib/embedding");
      updateProductEmbedding(
        productId,
        nome ?? produtoExistente.name,
        descricao !== undefined ? descricao : produtoExistente.description,
        tagNames
      ).catch(err => {
        console.warn("Erro ao atualizar embedding na edição:", err);
      });
    }

    return NextResponse.json({ success: true, produto: produtoAtualizado });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro ao editar produto." }, { status: 500 });
  }
}

