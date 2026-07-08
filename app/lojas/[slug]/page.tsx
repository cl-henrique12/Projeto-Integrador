import { prisma } from "@/lib/prisma";
import { StoreStatus, ProductStatus } from "@prisma/client";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loja = await prisma.store.findUnique({ where: { slug } });
  if (!loja) return { title: "Loja não encontrada | Geekfy" };
  return {
    title: `${loja.name} | Geekfy`,
    description: loja.description ?? `Veja os produtos de ${loja.name} na Geekfy.`,
  };
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export default async function LojaPage({ params }: PageProps) {
  const { slug } = await params;

  const loja = await prisma.store.findUnique({
    where: { slug, status: StoreStatus.APPROVED },
    include: {
      categories: { include: { category: true } },
      products: {
        where: { status: ProductStatus.ACTIVE },
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
        orderBy: { viewsCount: "desc" },
        take: 24,
      },
    },
  });

  if (!loja) notFound();

  // Incrementar views (fire-and-forget)
  prisma.store.update({ where: { slug }, data: { viewsCount: { increment: 1 } } }).catch(() => {});

  const whatsappMsg = encodeURIComponent(`Olá! Vi sua loja "${loja.name}" no Geekfy e gostaria de saber mais sobre seus produtos.`);
  const whatsappUrl = `https://wa.me/${loja.whatsapp}?text=${whatsappMsg}`;

  return (
    <main>
      <Header />
      <CategoryNav />

      {/* Cover */}
      <div className="relative h-56 md:h-72 bg-gradient-to-r from-mauve/50 to-blushpop/50 overflow-hidden">
        {loja.coverUrl && (
          <Image src={loja.coverUrl} alt={`Capa de ${loja.name}`} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Cabeçalho da loja */}
        <div className="relative -mt-12 mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Logo */}
          <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg flex-shrink-0">
            {loja.logoUrl ? (
              <Image src={loja.logoUrl} alt={`Logo ${loja.name}`} width={96} height={96} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-mauve to-blushpop flex items-center justify-center">
                <span className="font-display font-black text-3xl text-text-primary">{loja.name.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <h1 className="font-display font-black text-2xl md:text-3xl text-text-primary">{loja.name}</h1>
            {loja.neighborhood && (
              <p className="text-lavendergrey text-sm mt-0.5">{loja.neighborhood} · {loja.city}</p>
            )}
            {/* Categorias */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {loja.categories.map(({ category }) => (
                <span key={category.id} className="px-2.5 py-0.5 rounded-full bg-aquamarine/60 text-text-primary text-xs font-semibold">
                  {category.name}
                </span>
              ))}
            </div>
          </div>

          {/* Botão WhatsApp */}
          <div className="flex gap-3 flex-shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id={`whatsapp-loja-${loja.slug}`}
              className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#1ebe5d] transition-colors shadow-md hover:shadow-lg"
            >
              <WhatsAppIcon />
              Falar com a loja
            </a>
            {loja.instagram && (
              <a
                href={`https://instagram.com/${loja.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full border border-lavendergrey/30 text-text-primary text-sm font-semibold hover:border-mauve hover:bg-mauve/10 transition-all"
              >
                Instagram
              </a>
            )}
          </div>
        </div>

        {/* Descrição */}
        {loja.description && (
          <p className="text-text-primary/80 text-base font-sans mb-8 max-w-2xl">{loja.description}</p>
        )}

        {/* Produtos da loja */}
        <h2 className="font-display font-bold text-xl text-text-primary mb-5">Produtos</h2>
        {loja.products.length === 0 ? (
          <p className="text-lavendergrey text-sm py-8 text-center">Esta loja ainda não tem produtos cadastrados.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
            {loja.products.map((produto) => {
              const img = produto.images[0];
              return (
                <li key={produto.id}>
                  <Link
                    href={`/produtos/${produto.id}`}
                    className="block rounded-card overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform border border-lavendergrey/10 group"
                  >
                    <div className="relative h-44 bg-gradient-to-br from-aquamarine/20 to-mauve/20">
                      {img && (
                        <Image src={img.url} alt={produto.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-display font-semibold text-sm text-text-primary line-clamp-2">{produto.name}</h3>
                      <p className="font-display font-black text-base mt-1 text-text-primary">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(produto.price))}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
