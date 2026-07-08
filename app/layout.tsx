import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR">
      <body className="bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
