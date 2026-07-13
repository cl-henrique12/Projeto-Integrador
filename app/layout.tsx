import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";

/* ── Fontes via next/font (self-hosted, sem network request extra)
   Pendência design-system.md §5 resolvida:
   - Display/Títulos: Nunito (geométrica/arredondada → tom "geek/pop")
   - Corpo de texto:  Inter (sans-serif neutra e legível)            */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Geekfy — Lojas Geek de Manaus",
  description:
    "Descubra as melhores lojas geek de Manaus! Anime, mangá, TCG, board games, cosplay e muito mais. Encontre produtos pelo seu fandom favorito.",
  keywords: ["geek", "anime", "mangá", "TCG", "board games", "Manaus", "loja geek"],
  openGraph: {
    title: "Geekfy — Lojas Geek de Manaus",
    description: "Vitrine digital das melhores lojas geek de Manaus.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${nunito.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-sans)",
          backgroundColor: "var(--color-base)",
          color: "var(--color-text-primary)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
