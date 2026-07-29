import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query de busca é obrigatória." }, { status: 400 });
    }

    const qLower = query.toLowerCase();

    // 1. Extração de fandoms conhecidos
    const tagsConhecidas = await prisma.tag.findMany({ select: { name: true, slug: true, synonyms: true } });
    const fandomsEncontrados = tagsConhecidas.filter(t =>
      qLower.includes(t.name.toLowerCase()) ||
      t.synonyms.some(s => qLower.includes(s.toLowerCase()))
    );

    // 2. Extração de limite de preço (ex: "até 50", "menos de 100", "até R$45")
    let maxPrice: number | null = null;
    const priceMatch = qLower.match(/(?:até|menos de|abaixo de|por|no máximo)?\s*(?:r\$)?\s*(\d+(?:[\.,]\d{1,2})?)/i);
    if (priceMatch && (qLower.includes("até") || qLower.includes("menos") || qLower.includes("barato") || qLower.includes("r$"))) {
      const parsed = parseFloat(priceMatch[1].replace(",", "."));
      if (!isNaN(parsed) && parsed > 0) {
        maxPrice = parsed;
      }
    }

    // 3. Montar query no banco com base na interpretação de IA
    const tagSlugs = fandomsEncontrados.map(f => f.slug);

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        store: { status: "APPROVED" },
        ...(maxPrice ? { price: { lte: maxPrice } } : {}),
        OR: [
          ...(tagSlugs.length > 0
            ? [{ tags: { some: { tag: { slug: { in: tagSlugs } } } } }]
            : []),
          { name: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        store: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true } } } },
      },
      orderBy: { viewsCount: "desc" },
      take: 30,
    });

    // 4. Resumo amigável gerado pela IA
    let aiExplanation = `A IA analisou sua busca "${query}"`;
    const partes: string[] = [];

    if (fandomsEncontrados.length > 0) {
      partes.push(`fandom **${fandomsEncontrados.map(f => f.name).join(", ")}**`);
    }
    if (maxPrice) {
      partes.push(`preço de até **R$ ${maxPrice.toFixed(2).replace(".", ",")}**`);
    }

    if (partes.length > 0) {
      aiExplanation = `✨ A IA identificou interesse em ${partes.join(" e ")}.`;
    } else {
      aiExplanation = `✨ A IA filtrou os produtos mais populares correspondentes à sua pesquisa.`;
    }

    return NextResponse.json({
      success: true,
      query,
      aiExplanation,
      matchedFandoms: fandomsEncontrados.map(f => f.name),
      maxPriceFilter: maxPrice,
      resultsCount: products.length,
      products,
    });
  } catch (error: any) {
    console.error("Erro na busca por IA:", error);
    return NextResponse.json({ error: "Erro ao processar a busca inteligente." }, { status: 500 });
  }
}
