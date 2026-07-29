"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon path
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onSelect, lat, lng }: { onSelect: (lat: number, lng: number) => void; lat: number; lng: number }) {
  useMapEvents({
    click(e: any) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={[lat, lng]} />;
}

export default function EventMapPicker({
  latitude,
  longitude,
  onLocationSelect,
}: LocationPickerProps) {
  const center: [number, number] = useMemo(() => [-3.119, -60.021], []); // Centro de Manaus

  return (
    <div style={{ borderRadius: "var(--radius-card)", overflow: "hidden", border: "1px solid rgba(135,134,168,0.2)" }}>
      <MapContainer center={[latitude || center[0], longitude || center[1]]} zoom={13} style={{ height: "300px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker lat={latitude || center[0]} lng={longitude || center[1]} onSelect={onLocationSelect} />
      </MapContainer>
      <div style={{ padding: "0.5rem 0.875rem", backgroundColor: "#FAF9FE", fontSize: "0.75rem", color: "#8786A8", borderTop: "1px solid rgba(135,134,168,0.1)" }}>
        🗺️ Clique em qualquer lugar no mapa para posicionar o pin do evento (Lat: <strong>{latitude.toFixed(4)}</strong>, Lng: <strong>{longitude.toFixed(4)}</strong>)
      </div>
    </div>
  );
}
