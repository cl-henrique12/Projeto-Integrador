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
