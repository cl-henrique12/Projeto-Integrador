import Image from "next/image";
import Link from "next/link";
import { Product, ProductImage, Store } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type ProductWithDetails = Product & {
  images: ProductImage[];
  store: Pick<Store, "name" | "slug">;
};

interface ProductGridProps {
  products: ProductWithDetails[];
}

function formatPrice(price: Decimal | number): string {
  const num = typeof price === "number" ? price : Number(price);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

// design-system §3.5: "Cards retangulares em grid (3 colunas no desktop)"
// "Cada card representa um produto ou destaque de loja"
export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="section-gap bg-base" aria-labelledby="produtos-heading">
        <div className="max-w-7xl mx-auto px-4 text-center py-16">
          <p className="text-lavendergrey font-sans">Nenhum produto disponível no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-gap bg-base" aria-labelledby="produtos-heading">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          id="produtos-heading"
          className="font-display font-bold text-xl text-text-primary mb-6"
        >
          Produtos em Destaque
        </h2>

        {/* Grid 3 cols desktop / 2 cols tablet / 1 col mobile */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-label="Grade de produtos"
        >
          {products.map((product) => {
            const firstImage = product.images[0];
            return (
              <li key={product.id} className="group">
                <Link
                  href={`/produtos/${product.id}`}
                  className="block rounded-card overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform border border-lavendergrey/10"
                  aria-label={`Ver produto: ${product.name}`}
                >
                  {/* Imagem do produto */}
                  <div className="relative h-52 bg-gradient-to-br from-aquamarine/20 to-mauve/20 overflow-hidden">
                    {firstImage ? (
                      <Image
                        src={firstImage.url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-lavendergrey text-sm font-sans">Sem imagem</span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo do card */}
                  <div className="p-4">
                    {/* Nome da loja */}
                    <span className="text-xs text-lavendergrey font-sans uppercase tracking-wide">
                      {product.store.name}
                    </span>

                    {/* Nome do produto */}
                    <h3 className="font-display font-semibold text-text-primary text-base mt-1 mb-2 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>

                    {/* Linha inferior: preço + badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-black text-lg text-text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-aquamarine text-text-primary text-xs font-semibold">
                        Ver produto
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Ver todos */}
        <div className="mt-8 text-center">
          <Link
            href="/lojas"
            className="inline-block bg-mauve text-text-primary px-8 py-3 rounded-full font-semibold text-sm hover:bg-blushpop transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
          >
            Ver todas as lojas →
          </Link>
        </div>
      </div>
    </section>
  );
}
