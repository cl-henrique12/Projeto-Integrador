"use client";

import dynamic from "next/dynamic";

const EventMapPicker = dynamic(() => import("@/app/components/EventMapPicker"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "300px",
        borderRadius: "var(--radius-card)",
        backgroundColor: "rgba(135,134,168,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ fontSize: "0.8125rem", color: "#8786A8" }}>Carregando seletor do mapa...</p>
    </div>
  ),
});

interface Props {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function EventMapPickerLoader(props: Props) {
  return <EventMapPicker {...props} />;
}
