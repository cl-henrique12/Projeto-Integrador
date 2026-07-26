import Link from "next/link";
import { Store } from "@prisma/client";
import { StoreLogo } from "@/app/components/StoreLogo";

interface StoreCarouselProps {
  stores: Pick<Store, "id" | "slug" | "name" | "logoUrl">[];
}

// Fallback de avatar com inicial da loja — substitui alt text vazando
function StoreAvatarFallback({ name }: { name: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--color-mauve), var(--color-blushpop))",
      }}
      aria-hidden
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "2rem",
          color: "var(--color-text-primary)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

// design-system §3.4: "Avatares circulares em linha horizontal, com nome/logo de cada loja"
// Tamanho 100px fiel ao Figma — "Deve ser dinâmico (puxar da tabela Store via API/Prisma), não hardcoded"
export default function StoreCarousel({ stores }: StoreCarouselProps) {
  if (stores.length === 0) {
    return null;
  }

  return (
    <section className="pt-10 pb-12 bg-base" aria-labelledby="parceiras-heading">
      <div className="page-container">
        <h2
          id="parceiras-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "var(--color-text-primary)",
            marginBottom: "1.75rem",
          }}
        >
          Lojas Parceiras
        </h2>

        {/* Scroll horizontal com avatares circulares — gap e tamanho fiéis ao Figma */}
        <div
          className="flex gap-9 overflow-x-auto pb-3 scrollbar-hide"
          role="list"
          aria-label="Lojas parceiras"
        >
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/lojas/${store.slug}`}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
              role="listitem"
              aria-label={`Ver loja ${store.name}`}
            >
              {/* Avatar circular 100×100 — fiel ao Figma */}
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-transparent group-hover:border-mauve transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:scale-105 transform">
                <StoreLogo logoUrl={store.logoUrl} name={store.name} size={100} />
              </div>

              {/* Nome da loja */}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  textAlign: "center",
                  maxWidth: 100,
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  transition: "color 0.2s",
                }}
                className="group-hover:text-lavendergrey"
              >
                {store.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
