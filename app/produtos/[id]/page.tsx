import { prisma } from "@/lib/prisma";
import { ProductStatus, StoreStatus } from "@prisma/client";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const produto = await prisma.product.findUnique({ where: { id }, include: { store: { select: { name: true } } } });
  if (!produto) return { title: "Produto não encontrado | Geekfy" };
  return {
    title: `${produto.name} | ${produto.store.name} | Geekfy`,
    description: produto.description ?? `${produto.name} disponível na loja ${produto.store.name}.`,
  };
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id } = await params;

  const produto = await prisma.product.findUnique({
    where: { id, status: ProductStatus.ACTIVE },
    include: {
      images: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      store: {
        select: {
          id: true, slug: true, name: true, logoUrl: true,
          whatsapp: true, instagram: true, status: true,
        },
      },
    },
  });

  if (!produto || produto.store.status !== StoreStatus.APPROVED) notFound();

  // Incrementar views (fire-and-forget)
  prisma.product.update({ where: { id }, data: { viewsCount: { increment: 1 } } }).catch(() => {});

  const preco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(produto.price));

  // Mensagem pré-preenchida para o WhatsApp — RF15
  const whatsappMsg = encodeURIComponent(
    `Olá! Vi o produto "${produto.name}" (R$ ${Number(produto.price).toFixed(2).replace(".", ",")}) na loja "${produto.store.name}" no Geekfy e gostaria de mais informações!`
  );
  const whatsappUrl = `https://wa.me/${produto.store.whatsapp}?text=${whatsappMsg}`;

  return (
    <main>
      <Header />
      <CategoryNav />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-lavendergrey mb-6 font-sans" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-text-primary transition-colors">Início</Link>
          {" / "}
          <Link href="/lojas" className="hover:text-text-primary transition-colors">Lojas</Link>
          {" / "}
          <Link href={`/lojas/${produto.store.slug}`} className="hover:text-text-primary transition-colors">{produto.store.name}</Link>
          {" / "}
          <span className="text-text-primary">{produto.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Galeria de imagens */}
          <div>
            {produto.images.length > 0 ? (
              <div className="space-y-3">
                <div className="relative h-80 rounded-card overflow-hidden bg-gradient-to-br from-aquamarine/20 to-mauve/20">
                  <Image
                    src={produto.images[0].url}
                    alt={produto.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                {produto.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {produto.images.map((img, i) => (
                      <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-mauve transition-colors cursor-pointer">
                        <Image src={img.url} alt={`Foto ${i + 1} de ${produto.name}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80 rounded-card bg-gradient-to-br from-aquamarine/20 to-mauve/20 flex items-center justify-center">
                <span className="text-lavendergrey text-sm">Sem imagem</span>
              </div>
            )}
          </div>

          {/* Informações do produto */}
          <div className="flex flex-col gap-5">
            {/* Nome */}
            <div>
              <h1 className="font-display font-black text-2xl md:text-3xl text-text-primary leading-tight mb-2">
                {produto.name}
              </h1>

              {/* Tags de fandom — RF03 */}
              {produto.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {produto.tags.map(({ tag }) => (
                    <span key={tag.id} className="px-2.5 py-0.5 rounded-full bg-aquamarine/50 text-text-primary text-xs font-semibold">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Preço */}
            <div className="bg-mauve/10 rounded-card px-5 py-4">
              <p className="text-lavendergrey text-xs font-sans mb-1">Preço</p>
              <p className="font-display font-black text-4xl text-text-primary">{preco}</p>
            </div>

            {/* Descrição */}
            {produto.description && (
              <div>
                <p className="text-lavendergrey text-xs font-sans uppercase tracking-wide mb-1">Descrição</p>
                <p className="text-text-primary/80 text-base font-sans leading-relaxed">{produto.description}</p>
              </div>
            )}

            {/* CTA WhatsApp — RF15: "Botão 'Falar com a loja' abre WhatsApp com mensagem pré-preenchida" */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id={`whatsapp-produto-${produto.id}`}
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-full font-bold text-base hover:bg-[#1ebe5d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
            >
              <WhatsAppIcon />
              Falar com a loja
            </a>

            {/* Card da loja */}
            <Link
              href={`/lojas/${produto.store.slug}`}
              className="flex items-center gap-3 p-4 rounded-card border border-lavendergrey/20 hover:border-mauve/50 hover:bg-mauve/5 transition-all group"
              aria-label={`Ver mais produtos de ${produto.store.name}`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-mauve to-blushpop">
                {produto.store.logoUrl && (
                  <Image src={produto.store.logoUrl} alt={produto.store.name} width={48} height={48} className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-lavendergrey text-xs font-sans">Vendido por</p>
                <p className="font-display font-bold text-text-primary group-hover:text-mauve transition-colors">{produto.store.name}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-lavendergrey group-hover:text-mauve transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
