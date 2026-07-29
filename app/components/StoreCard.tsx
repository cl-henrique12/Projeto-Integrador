"use client";

import Link from "next/link";
import { SafeImage } from "@/app/components/SafeImage";
import { StoreLogo } from "@/app/components/StoreLogo";
import { CSSProperties, useState } from "react";

// ── Design-system tokens (espelham globals.css / tailwind.config.ts) ──────────
const COLOR = {
  base:          "#FFFFFF",
  aquamarine:    "#8EF8D5",
  blushpop:      "#FFBFEA",
  mauve:         "#D3BCFF",
  lavendergrey:  "#8786A8",
  textPrimary:   "#1A1A2E",
  textSecondary: "#8786A8",
} as const;

const FONT = {
  sans:    "'Inter', ui-sans-serif, system-ui, sans-serif",
  display: "'Nunito', ui-sans-serif, system-ui, sans-serif",
} as const;

// ── Styles (objetos JS) ────────────────────────────────────────────────────────

const cardBaseStyle: CSSProperties = {
  display:         "block",
  borderRadius:    "12px",
  overflow:        "hidden",
  backgroundColor: COLOR.base,
  boxShadow:       "0 1px 3px rgba(0,0,0,.08)",
  border:          "1px solid rgba(135, 134, 168, 0.1)",
  transition:      "box-shadow 0.3s ease, transform 0.3s ease",
  paddingBottom:   "10px",
  paddingLeft:     "10px",
  paddingRight:    "10px",
  textDecoration:  "none",
  color:           "inherit",
};

const cardHoverStyle: CSSProperties = {
  ...cardBaseStyle,
  boxShadow: "0 20px 40px rgba(0,0,0,.14)",
  transform: "translateY(-4px)",
};

const coverWrapperStyle: CSSProperties = {
  position:   "relative",
  height:     "144px",
  background: "linear-gradient(135deg, rgba(142,248,213,.3), rgba(211,188,255,.3))",
};

const avatarWrapperStyle: CSSProperties = {
  position: "absolute",
  bottom:   "-24px",
  left:     "16px",
};

const avatarInnerStyle: CSSProperties = {
  width:           "56px",
  height:          "56px",
  borderRadius:    "9999px",
  border:          "4px solid #FFFFFF",
  backgroundColor: "#FFFFFF",
  overflow:        "hidden",
  boxShadow:       "0 4px 8px rgba(0,0,0,.12)",
};

const bodyStyle: CSSProperties = {
  padding:    "20px",
  paddingTop: "32px",
};

const nameStyle: CSSProperties = {
  fontFamily: FONT.display,
  fontWeight: 700,
  fontSize:   "1.125rem",
  color:      COLOR.textPrimary,
  margin:     0,
};

const locationStyle: CSSProperties = {
  fontFamily: FONT.sans,
  fontSize:   "0.75rem",
  color:      COLOR.lavendergrey,
  marginTop:  "2px",
};

const descriptionStyle: CSSProperties = {
  fontFamily:      FONT.sans,
  fontSize:        "0.875rem",
  color:           "rgba(26, 26, 46, 0.7)",
  marginTop:       "8px",
  display:         "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow:        "hidden",
  textOverflow:    "ellipsis",
  lineHeight:      1.5,
};

const tagsWrapperStyle: CSSProperties = {
  display:   "flex",
  flexWrap:  "wrap",
  gap:       "6px",
  marginTop: "12px",
};

const tagStyle: CSSProperties = {
  display:         "inline-block",
  padding:         "2px 8px",
  borderRadius:    "9999px",
  backgroundColor: "rgba(142,248,213,.5)",
  color:           COLOR.textPrimary,
  fontSize:        "0.75rem",
  fontWeight:      600,
  fontFamily:      FONT.sans,
};

const productCountStyle: CSSProperties = {
  fontFamily: FONT.sans,
  fontSize:   "0.75rem",
  color:      COLOR.lavendergrey,
  marginTop:  "12px",
};

// ── Prop types ─────────────────────────────────────────────────────────────────

interface StoreCardProps {
  slug:         string;
  name:         string;
  logoUrl:      string | null;
  coverUrl:     string | null;
  neighborhood: string | null;
  city:         string | null;
  description:  string | null;
  categories:   { category: { id: string; name: string } }[];
  productCount: number;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function StoreCard({
  slug,
  name,
  logoUrl,
  coverUrl,
  neighborhood,
  city,
  description,
  categories,
  productCount,
}: StoreCardProps) {
  const [hovered, setHovered]           = useState(false);
  const [coverHovered, setCoverHovered] = useState(false);

  return (
    <Link
      href={`/lojas/${slug}`}
      style={hovered ? cardHoverStyle : cardBaseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCoverHovered(false); }}
      aria-label={`Ver loja ${name}`}
    >
      {/* ── Imagem de capa ── */}
      <div
        style={coverWrapperStyle}
        onMouseEnter={() => setCoverHovered(true)}
        onMouseLeave={() => setCoverHovered(false)}
      >
        <SafeImage
          src={coverUrl || ""}
          alt={name}
          fallbackType="cover"
          fill
          style={{
            objectFit:  "cover",
            transition: "transform 0.5s ease",
            transform:  coverHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Avatar circular sobreposto na borda inferior da capa */}
        <div style={avatarWrapperStyle}>
          <div style={avatarInnerStyle}>
            <StoreLogo logoUrl={logoUrl} name={name} size={56} />
          </div>
        </div>
      </div>

      {/* ── Corpo do card ── */}
      <div style={bodyStyle}>
        {/* Nome da loja */}
        <h2 style={nameStyle}>{name}</h2>

        {/* Bairro · Cidade */}
        {neighborhood && (
          <p style={locationStyle}>
            {neighborhood} · {city}
          </p>
        )}

        {/* Descrição (2 linhas com reticências) */}
        {description && (
          <p style={descriptionStyle}>{description}</p>
        )}

        {/* Tags de categoria */}
        <div style={tagsWrapperStyle}>
          {categories.slice(0, 3).map(({ category }) => (
            <span key={category.id} style={tagStyle}>
              {category.name}
            </span>
          ))}
        </div>

        {/* Contagem de produtos */}
        <p style={productCountStyle}>
          {productCount} produto{productCount !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
