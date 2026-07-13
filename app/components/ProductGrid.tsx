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

// Ícone placeholder para imagem ausente — design-system §3.5
function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-aquamarine/30 via-mauve/20 to-blushpop/30 gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ width: "2.5rem", height: "2.5rem", color: "var(--color-lavendergrey)" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--color-lavendergrey)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Sem imagem
      </span>
    </div>
  );
}

// design-system §3.5: "Cards retangulares em grid (3 colunas no desktop)"
// Card com altura fixa e flex-column para evitar overlap de preço/botão
export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="section-gap bg-base" aria-labelledby="produtos-heading">
        <div className="max-w-7xl mx-auto px-6 text-center py-16">
          <p
            style={{
              color: "var(--color-lavendergrey)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Nenhum produto disponível no momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-gap bg-base" aria-labelledby="produtos-heading">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          id="produtos-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "var(--color-text-primary)",
            marginBottom: "1.75rem",
          }}
        >
          Produtos em Destaque
        </h2>

        {/* Grid 3 cols desktop / 2 cols tablet / 1 col mobile — fiel ao Figma */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Grade de produtos"
        >
          {products.map((product) => {
            const firstImage = product.images[0];
            return (
              <li key={product.id} className="group">
                <Link
                  href={`/produtos/${product.id}`}
                  className="block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 transform border border-lavendergrey/10"
                  aria-label={`Ver produto: ${product.name}`}
                  style={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                  {/* Imagem do produto — 285px fiel ao Figma */}
                  <div className="relative overflow-hidden flex-shrink-0" style={{ height: "285px" }}>
                    {firstImage ? (
                      <Image
                        src={firstImage.url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}

                    {/* Overlay sutil no hover */}
                    <div className="absolute inset-0 bg-text-primary/0 group-hover:bg-text-primary/5 transition-colors duration-300" />
                  </div>

                  {/* Conteúdo do card — flex-column para empurrar botão ao final */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      padding: "1.25rem",
                      gap: "0.5rem",
                    }}
                  >
                    {/* Nome da loja */}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-lavendergrey)",
                        fontFamily: "var(--font-sans)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {product.store.name}
                    </span>

                    {/* Nome do produto — flex-grow empurra linha de preço para baixo */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "var(--color-text-primary)",
                        lineHeight: 1.35,
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Linha inferior: preço + badge — sempre na base do card */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        marginTop: "auto",
                        paddingTop: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 900,
                          fontSize: "1.25rem",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      <span
                        style={{
                          padding: "0.375rem 0.75rem",
                          borderRadius: "0.5rem",
                          backgroundColor: "var(--color-aquamarine)",
                          color: "var(--color-text-primary)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          transition: "background-color 0.2s",
                        }}
                        className="group-hover:bg-mauve"
                      >
                        Ver produto
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Ver todos — dentro do fluxo normal da seção, não fixo/absoluto */}
        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <Link
            href="/lojas"
            style={{
              display: "inline-block",
              backgroundColor: "var(--color-text-primary)",
              color: "#ffffff",
              padding: "0.875rem 2.5rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              boxShadow: "0 4px 14px rgba(26,26,46,0.15)",
              transition: "all 0.2s",
              fontFamily: "var(--font-sans)",
            }}
          >
            Ver todas as lojas →
          </Link>
        </div>
      </div>
    </section>
  );
}
