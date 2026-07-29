import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, descricao, whatsapp, instagram, bairro, logoUrl, coverUrl, categorias, ownerEmail, ownerName } = body;

  if (!nome || !whatsapp || !ownerEmail) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes (nome, whatsapp, ownerEmail)." }, { status: 400 });
  }

  // Garantir que o User existe no banco (pode ter sido criado via Supabase Auth)
  const user = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      name: ownerName ?? ownerEmail,
      email: ownerEmail,
      passwordHash: "supabase_auth_managed",
      role: "LOJISTA",
    },
  });

  // Verificar se já tem loja
  const lojaExistente = await prisma.store.findUnique({ where: { ownerId: user.id } });
  if (lojaExistente) {
    return NextResponse.json({ error: "Você já possui uma loja cadastrada." }, { status: 409 });
  }

  // Gerar slug único
  let baseSlug = slugify(nome);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.store.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const loja = await prisma.store.create({
    data: {
      slug,
      name: nome,
      description: descricao ?? null,
      whatsapp,
      instagram: instagram ?? null,
      neighborhood: bairro ?? null,
      city: "Manaus",
      logoUrl: logoUrl ?? null,
      coverUrl: coverUrl ?? null,
      status: "PENDING",
      ownerId: user.id,
      categories: {
        create: (categorias as string[]).map((categoryId: string) => ({ categoryId })),
      },
    },
  });

  return NextResponse.json({ success: true, slug: loja.slug }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, nome, descricao, whatsapp, instagram, bairro, logoUrl, coverUrl, ownerEmail } = body;

    if (!storeId || !ownerEmail) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    const loja = await prisma.store.findFirst({
      where: { id: storeId, owner: { email: ownerEmail } },
    });

    if (!loja) {
      return NextResponse.json({ error: "Loja não encontrada ou permissão negada." }, { status: 404 });
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        name: nome ?? loja.name,
        description: descricao !== undefined ? descricao : loja.description,
        whatsapp: whatsapp ? whatsapp.replace(/\D/g, "") : loja.whatsapp,
        instagram: instagram !== undefined ? instagram : loja.instagram,
        neighborhood: bairro !== undefined ? bairro : loja.neighborhood,
        logoUrl: logoUrl !== undefined ? logoUrl : loja.logoUrl,
        coverUrl: coverUrl !== undefined ? coverUrl : loja.coverUrl,
      },
    });

    return NextResponse.json({ success: true, store: updatedStore });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro ao atualizar a loja." }, { status: 500 });
  }
}

