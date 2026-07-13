"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Ícones SVG inline (Heroicons)
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
    <header
      style={{
        backgroundColor: "var(--color-blushpop)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "72px",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Logo + Nome à esquerda */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
            textDecoration: "none",
          }}
          aria-label="Geekfy — página inicial"
        >
          <div
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              backgroundColor: "var(--color-text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(26,26,46,0.25)",
            }}
            className="animate-pulse-glow"
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "var(--color-blushpop)",
                fontSize: "0.7rem",
                letterSpacing: "-0.03em",
                userSelect: "none",
              }}
            >
              GKF
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              color: "var(--color-text-primary)",
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
            }}
            className="hidden sm:block"
          >
            Geekfy
          </span>
        </Link>

        {/* Barra de busca central — fiel ao Figma: retângulo branco com bordas 8px */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "42rem", margin: "0 auto" }}>
          <div style={{ position: "relative" }}>
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquise por lojas ou tema"
              style={{
                width: "100%",
                paddingLeft: "1.25rem",
                paddingRight: "3rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: "#ffffff",
                color: "var(--color-text-primary)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-sans)",
                outline: "none",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
              aria-label="Buscar por lojas ou tema"
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-lavendergrey)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
              }}
              aria-label="Pesquisar"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        {/* Ícones à direita — design-system §3.1 */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}
          aria-label="Ações do usuário"
        >
          <button
            id="btn-favoritos"
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            aria-label="Favoritos"
          >
            <HeartIcon />
          </button>
          <button
            id="btn-carrinho"
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            aria-label="Carrinho"
          >
            <BagIcon />
          </button>
          <Link
            href="/login"
            id="btn-perfil"
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-primary)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            aria-label="Perfil / Login"
          >
            <UserIcon />
          </Link>
        </nav>
      </div>
    </header>
  );
}
