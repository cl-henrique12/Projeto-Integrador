import Image from "next/image";
import Link from "next/link";
import { Store } from "@prisma/client";

interface StoreCarouselProps {
  stores: Pick<Store, "id" | "slug" | "name" | "logoUrl">[];
}

// design-system §3.4: "Avatares circulares em linha horizontal, com nome/logo de cada loja"
// "Deve ser dinâmico (puxar da tabela Store via API/Prisma), não hardcoded"
export default function StoreCarousel({ stores }: StoreCarouselProps) {
  if (stores.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-base" aria-labelledby="parceiras-heading">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          id="parceiras-heading"
          className="font-display font-bold text-xl text-text-primary mb-5"
        >
          Lojas Parceiras
        </h2>

        {/* Scroll horizontal com avatares circulares */}
        <div
          className="flex gap-6 overflow-x-auto pb-3 scrollbar-hide"
          role="list"
          aria-label="Lojas parceiras"
        >
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/lojas/${store.slug}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
              role="listitem"
              aria-label={`Ver loja ${store.name}`}
            >
              {/* Avatar circular */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-transparent group-hover:border-mauve transition-all shadow-md group-hover:shadow-lg group-hover:scale-105 transform bg-aquamarine/30">
                {store.logoUrl ? (
                  <Image
                    src={store.logoUrl}
                    alt={`Logo da loja ${store.name}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-mauve to-blushpop">
                    <span className="font-display font-black text-xl text-text-primary">
                      {store.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Nome da loja */}
              <span className="text-xs font-sans font-medium text-text-primary text-center max-w-[80px] leading-tight group-hover:text-mauve transition-colors line-clamp-2">
                {store.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
