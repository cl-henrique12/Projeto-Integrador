import Link from "next/link";

// Categorias da nav — design-system §3.2
// "Acessórios", "Quadrinho/Mangás", "Camisas", "Artistas", "Parceiros"
const CATEGORIAS = [
  { label: "Acessórios",       href: "/lojas?categoria=acessorios",   slug: "acessorios" },
  { label: "Quadrinhos/Mangás",href: "/lojas?categoria=manga",        slug: "manga" },
  { label: "Camisas",          href: "/lojas?categoria=camisas",      slug: "camisas" },
  { label: "Artistas",         href: "/lojas?categoria=artistas",     slug: "artistas" },
  { label: "Parceiros",        href: "/lojas",                        slug: "parceiros" },
];

export default function CategoryNav() {
  return (
    // Fundo aquamarine — design-system §3.2 "Fundo em --color-accent-1 (Aquamarine)"
    <nav
      className="bg-aquamarine"
      aria-label="Navegação por categoria"
    >
      <ul className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-hide">
        {CATEGORIAS.map((cat) => (
          <li key={cat.slug} className="flex-shrink-0">
            <Link
              href={cat.href}
              className="px-5 py-1.5 rounded-full text-sm font-sans font-semibold text-text-primary hover:bg-white/40 hover:shadow-sm transition-all whitespace-nowrap"
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
