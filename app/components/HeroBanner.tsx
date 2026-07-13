"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Slides do banner hero — design-system §3.3
// Altura reduzida para 320px (era 516px) + fundo branco dominante (design-system §1.2 regra 60-30-10)
// A cor de destaque aparece como barra lateral e elemento decorativo pontual, não como fundo total
const SLIDES = [
  {
    id: 1,
    accentColor: "#D3BCFF", // mauve
    accentColorLight: "rgba(211,188,255,0.15)",
    dotColor: "#D3BCFF",
    title: "Geekfy chegou em Manaus!",
    subtitle: "Descubra as melhores lojas geek da cidade em um só lugar",
    cta: { label: "Explorar lojas →", href: "/lojas" },
    emoji: "🎮",
  },
  {
    id: 2,
    accentColor: "#8EF8D5", // aquamarine
    accentColorLight: "rgba(142,248,213,0.15)",
    dotColor: "#8EF8D5",
    title: "Busca por fandom",
    subtitle: "Pesquise por \"shinobi\", \"RPG de mesa\" e muito mais — nossa IA entende o que você procura",
    cta: { label: "Pesquisar agora →", href: "/busca" },
    emoji: "🔍",
  },
  {
    id: 3,
    accentColor: "#FFBFEA", // blushpop
    accentColorLight: "rgba(255,191,234,0.15)",
    dotColor: "#FFBFEA",
    title: "Cadastre sua loja",
    subtitle: "Lojista geek? Apareça para milhares de consumidores em Manaus. Grátis no MVP!",
    cta: { label: "Cadastrar minha loja →", href: "/cadastro" },
    emoji: "🏪",
  },
];

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-avanço a cada 5 segundos
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    // Design-system §1.2 regra 60-30-10:
    // Fundo branco (60%) domina; cor de destaque aparece em barra lateral pontual (30%)
    // Altura reduzida de 516px → 320px para que o banner não monopolize a tela
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        height: "320px",
        backgroundColor: "var(--color-base)",
      }}
      aria-label="Banner de destaque"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            opacity: i === current ? 1 : 0,
            transform: i === current ? "translateX(0)" : i < current ? "translateX(-100%)" : "translateX(100%)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            zIndex: i === current ? 10 : 0,
            backgroundColor: "var(--color-base)", // fundo branco dominante
          }}
          aria-hidden={i !== current}
        >
          {/* Barra de destaque pontual à esquerda — cor de acento em bloco contido */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "6px",
              backgroundColor: s.accentColor,
            }}
          />

          {/* Decoração de fundo — círculo grande, muito sutil */}
          <div
            style={{
              position: "absolute",
              right: "-80px",
              top: "-80px",
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              backgroundColor: s.accentColorLight,
              pointerEvents: "none",
            }}
          />

          {/* Emoji decorativo lado direito — elemento pontual de destaque */}
          <div
            style={{
              position: "absolute",
              right: "10%",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "7rem",
              opacity: 0.18,
              pointerEvents: "none",
              userSelect: "none",
            }}
            role="img"
            aria-hidden
          >
            {s.emoji}
          </div>

          {/* Conteúdo principal */}
          <div
            style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 2.5rem", width: "100%", position: "relative" }}
          >
            <div style={{ maxWidth: "36rem" }} className="animate-fade-in-up">
              {/* Emoji visível em tamanho menor */}
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", userSelect: "none" }} role="img" aria-hidden>
                {s.emoji}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.2,
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.title}
              </h1>
              <p
                style={{
                  color: "rgba(26,26,46,0.65)",
                  fontSize: "1rem",
                  marginBottom: "1.5rem",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.6,
                }}
              >
                {s.subtitle}
              </p>
              <Link
                href={s.cta.href}
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--color-text-primary)",
                  color: "#ffffff",
                  padding: "0.75rem 2rem",
                  borderRadius: "0.75rem",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-sans)",
                  boxShadow: "0 4px 14px rgba(26,26,46,0.2)",
                  transition: "all 0.2s",
                }}
              >
                {s.cta.label}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Botão anterior */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          left: "1.25rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(4px)",
          borderRadius: "50%",
          padding: "0.625rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        aria-label="Slide anterior"
      >
        <ChevronLeft />
      </button>

      {/* Botão próximo */}
      <button
        onClick={next}
        style={{
          position: "absolute",
          right: "1.25rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(4px)",
          borderRadius: "50%",
          padding: "0.625rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        aria-label="Próximo slide"
      >
        <ChevronRight />
      </button>

      {/* Dots — design-system §3.3 */}
      <div
        style={{
          position: "absolute",
          bottom: "1.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: "0.5rem",
        }}
        role="tablist"
        aria-label="Slides"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            style={{
              height: "0.625rem",
              width: i === current ? "2.5rem" : "0.625rem",
              borderRadius: "999px",
              backgroundColor: i === current ? "var(--color-text-primary)" : "rgba(26,26,46,0.25)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
