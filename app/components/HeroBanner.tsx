"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// Slides do banner hero — design-system §3.3
// Em produção: alimentar via CMS/banco. Por ora: slides estáticos com paleta do design-system.
const SLIDES = [
  {
    id: 1,
    bg: "bg-gradient-to-r from-mauve via-blushpop to-aquamarine",
    title: "Geekfy chegou em Manaus!",
    subtitle: "Descubra as melhores lojas geek da cidade em um só lugar",
    cta: { label: "Explorar lojas", href: "/lojas" },
    imageUrl: null,
  },
  {
    id: 2,
    bg: "bg-gradient-to-r from-aquamarine via-mauve to-blushpop",
    title: "Busca por fandom",
    subtitle: "Pesquise por \"shinobi\", \"RPG de mesa\" e muito mais — nossa IA entende o que você procura",
    cta: { label: "Pesquisar agora", href: "/busca" },
    imageUrl: null,
  },
  {
    id: 3,
    bg: "bg-gradient-to-r from-blushpop via-aquamarine to-mauve",
    title: "Cadastre sua loja",
    subtitle: "Lojista geek? Apareça para milhares de consumidores em Manaus. Grátis no MVP!",
    cta: { label: "Cadastrar minha loja", href: "/cadastro" },
    imageUrl: null,
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

  const slide = SLIDES[current];

  return (
    // design-system §3.3 "Imagem/destaque de campanha em largura total"
    <section
      className="relative overflow-hidden"
      style={{ height: "360px" }}
      aria-label="Banner de destaque"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${s.bg} flex items-center ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          aria-hidden={i !== current}
        >
          <div className="max-w-7xl mx-auto px-8 py-12 w-full">
            <div className="max-w-lg animate-fade-in-up">
              <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary leading-tight mb-3">
                {s.title}
              </h1>
              <p className="text-text-primary/80 text-base md:text-lg mb-6 font-sans">
                {s.subtitle}
              </p>
              <Link
                href={s.cta.href}
                className="inline-block bg-text-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-mauve hover:text-text-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
              >
                {s.cta.label}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Botões de navegação */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md transition-all hover:scale-110"
        aria-label="Slide anterior"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md transition-all hover:scale-110"
        aria-label="Próximo slide"
      >
        <ChevronRight />
      </button>

      {/* Dots — design-system §3.3 "Indicadores de slide (dots) na parte inferior" */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist" aria-label="Slides">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-text-primary" : "w-2 bg-text-primary/40 hover:bg-text-primary/60"}`}
          />
        ))}
      </div>
    </section>
  );
}
