"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Ícones SVG inline (Heroicons)
// Pendência design-system §5: substituir pelos SVGs exportados do Figma
function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

export default function Header() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    // Fundo blushpop — design-system §3.1 "Fundo em --color-accent-2 (Blush Pop)"
    <header className="bg-blushpop sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo circular à esquerda */}
        <Link href="/" className="flex-shrink-0" aria-label="Geekfy — página inicial">
          <div className="w-12 h-12 rounded-full bg-mauve flex items-center justify-center shadow-md hover:scale-105 transition-transform">
            <span className="font-display font-black text-text-primary text-sm leading-none text-center select-none">
              GKF
            </span>
          </div>
        </Link>

        {/* Barra de busca central */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquise por tema ou loja"
              className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-transparent bg-white/80 backdrop-blur-sm text-text-primary placeholder-lavendergrey text-sm font-sans focus:outline-none focus:border-mauve focus:bg-white transition-all shadow-sm"
              aria-label="Buscar por tema ou loja"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lavendergrey hover:text-mauve transition-colors"
              aria-label="Pesquisar"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        {/* Ícones à direita */}
        <nav className="flex items-center gap-3 flex-shrink-0" aria-label="Ações do usuário">
          <button
            id="btn-favoritos"
            className="text-text-primary hover:text-mauve transition-colors hover:scale-110 transform"
            aria-label="Favoritos"
          >
            <HeartIcon />
          </button>
          <button
            id="btn-carrinho"
            className="text-text-primary hover:text-mauve transition-colors hover:scale-110 transform"
            aria-label="Carrinho"
          >
            <BagIcon />
          </button>
          <Link
            href="/login"
            id="btn-perfil"
            className="text-text-primary hover:text-mauve transition-colors hover:scale-110 transform"
            aria-label="Perfil / Login"
          >
            <UserIcon />
          </Link>
        </nav>
      </div>
    </header>
  );
}
