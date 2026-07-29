import { prisma } from "../lib/prisma";
import { updateProductEmbedding } from "../lib/embedding";
import { config } from "dotenv";

config();

async function main() {
  console.log("⚡ Gerando embeddings para os produtos cadastrados...");

  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY não foi encontrada no .env. Configure a chave e rode o script novamente.");
    process.exit(0);
  }

  const products = await prisma.product.findMany({
    include: {
      tags: { include: { tag: true } },
    },
  });

  console.log(`Encontrados ${products.length} produtos.`);

  for (const prod of products) {
    const tagNames = prod.tags.map(t => t.tag.name);
    console.log(` -> Processando embedding para: "${prod.name}"...`);
    const ok = await updateProductEmbedding(prod.id, prod.name, prod.description, tagNames);
    if (ok) {
      console.log(`    ✅ Embedding gerado e salvo para ${prod.id}`);
    } else {
      console.log(`    ⚠️ Falha ao salvar embedding para ${prod.id}`);
    }
  }

  console.log("🎉 Concluído!");
}

main().catch(console.error);
