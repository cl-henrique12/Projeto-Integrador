"use client";

import dynamic from "next/dynamic";

// Leaflet precisa de `window` — carregamento dinâmico sem SSR
const EventMap = dynamic(() => import("@/app/components/EventMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "400px",
        borderRadius: "var(--radius-card)",
        backgroundColor: "rgba(135,134,168,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "2rem",
          height: "2rem",
          border: "3px solid rgba(135,134,168,0.2)",
          borderTopColor: "#D3BCFF",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

// Wrapper Client Component — necessário porque ssr:false no dynamic()
// não é permitido em Server Components no Next.js 16+
export default function EventMapLoader() {
  return <EventMap />;
}
