import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Geekfy — tokens exatos de design-system.md
        base:         "#FFFFFF",
        aquamarine:   "#8EF8D5",
        blushpop:     "#FFBFEA",
        mauve:        "#D3BCFF",
        lavendergrey: "#8786A8",
        "text-primary":   "#1A1A2E",
        "text-secondary": "#8786A8",
      },
      fontFamily: {
        // Pendência design-system §5: fonte exata do Figma não especificada
        // Decisão provisória: Nunito (títulos/geométrica) + Inter (corpo)
        sans:    ["Inter", "sans-serif"],
        display: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        // Pendência design-system §5: raio exato não especificado
        // Decisão provisória: 12px para cards
        card: "12px",
      },
      spacing: {
        // Pendência design-system §5: espaçamento entre seções não especificado
        // Decisão provisória: 48px entre seções
        section: "48px",
      },
    },
  },
  plugins: [],
};

export default config;
