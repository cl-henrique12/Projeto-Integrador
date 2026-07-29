import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

/**
 * Gera um vector embedding para o texto fornecido usando o modelo text-embedding-3-small da OpenAI.
 * Retorna null em caso de erro ou se a OPENAI_API_KEY não estiver configurada.
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    return null;
  }

  try {
    const cleanText = text.trim().replace(/\n+/g, " ");
    if (!cleanText) return null;

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: cleanText,
      encoding_format: "float",
    });

    return response.data[0]?.embedding ?? null;
  } catch (error: any) {
    console.warn("⚠️ Falha ao gerar embedding na OpenAI (usando fallback de busca):", error?.message || error);
    return null;
  }
}

/**
 * Atualiza a coluna `embedding` (vector) do produto no PostgreSQL / Supabase via pgvector.
 */
export async function updateProductEmbedding(
  productId: string,
  name: string,
  description?: string | null,
  tags?: string[]
): Promise<boolean> {
  try {
    const combinedText = [name, description || "", (tags || []).join(" ")].filter(Boolean).join(" ");
    const embedding = await generateEmbedding(combinedText);

    if (!embedding) return false;

    const vectorStr = `[${embedding.join(",")}]`;
    await prisma.$executeRawUnsafe(
      `UPDATE products SET "embedding" = $1::vector WHERE id = $2`,
      vectorStr,
      productId
    );
    return true;
  } catch (error: any) {
    console.error(`Erro ao salvar embedding do produto ${productId}:`, error?.message || error);
    return false;
  }
}

/**
 * Realiza busca vetorial por distância de cosseno (<=>) no pgvector para os produtos ativos de lojas aprovadas.
 */
export async function searchProductsByEmbedding(
  queryEmbedding: number[],
  limit = 30
): Promise<string[]> {
  try {
    const vectorStr = `[${queryEmbedding.join(",")}]`;

    const results = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT p.id
       FROM products p
       JOIN stores s ON p."storeId" = s.id
       WHERE p.status = 'ACTIVE'
         AND s.status = 'APPROVED'
         AND p.embedding IS NOT NULL
       ORDER BY p.embedding <=> $1::vector ASC
       LIMIT $2`,
      vectorStr,
      limit
    );

    return results.map(r => r.id);
  } catch (error: any) {
    console.error("Erro na busca por embedding no pgvector:", error?.message || error);
    return [];
  }
}
