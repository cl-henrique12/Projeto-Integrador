import Image from "next/image";
import Link from "next/link";
import { Store } from "@prisma/client";

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
              {/* Avatar circular 100×100 — fiel ao Figma
                  overflow-hidden garante que o alt text nunca estoure o círculo */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid transparent",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  flexShrink: 0,
                  position: "relative",
                  background: "linear-gradient(135deg, rgba(142,248,213,0.4), rgba(211,188,255,0.3))",
                  transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                }}
                className="group-hover:scale-105"
              >
                {store.logoUrl ? (
                  <Image
                    src={store.logoUrl}
                    alt={`Logo da loja ${store.name}`}
                    width={100}
                    height={100}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <StoreAvatarFallback name={store.name} />
                )}
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
