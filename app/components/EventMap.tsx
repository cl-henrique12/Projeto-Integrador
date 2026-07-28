"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Fix Leaflet default icon path issue with bundlers (webpack/turbopack)
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Tipos ──────────────────────────────────────────────────────────────────
interface EventStore {
  name: string;
  slug: string;
}

interface EventData {
  id: string;
  name: string;
  description: string | null;
  date: string;
  address: string | null;
  neighborhood: string | null;
  latitude: number;
  longitude: number;
  stores: EventStore[];
}

type FilterType = "all" | "future" | "past";

// ── Componente ─────────────────────────────────────────────────────────────
export default function EventMap() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/events?filter=${filter}`)
      .then((res) => res.json())
      .then((data: EventData[]) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setEvents([]);
        setLoading(false);
      });
  }, [filter]);

  // Centro de Manaus
  const center: [number, number] = useMemo(() => [-3.119, -60.021], []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "Todos", value: "all" },
    { label: "Futuros", value: "future" },
    { label: "Passados", value: "past" },
  ];

  return (
    <div>
      {/* ── Filtro ── */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {filterButtons.map((btn) => {
          const isActive = filter === btn.value;
          return (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                fontWeight: isActive ? 700 : 500,
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--radius-card)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: isActive ? "#D3BCFF" : "rgba(135,134,168,0.10)",
                color: isActive ? "#1A1A2E" : "#8786A8",
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* ── Mapa ou Estado Vazio ── */}
      {loading ? (
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
      ) : events.length === 0 ? (
        /* Estado vazio amigável */
        <div
          style={{
            height: "400px",
            border: "2px dashed rgba(135,134,168,0.25)",
            borderRadius: "var(--radius-card)",
            backgroundColor: "rgba(135,134,168,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          {/* Ícone de mapa */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.2}
            stroke="currentColor"
            style={{
              width: "3rem",
              height: "3rem",
              color: "#8786A8",
              opacity: 0.5,
            }}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#8786A8",
            }}
          >
            Nenhum evento cadastrado no momento
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              color: "#8786A8",
              opacity: 0.7,
              textAlign: "center",
              maxWidth: "24rem",
            }}
          >
            {filter === "future"
              ? "Não há eventos futuros programados. Fique ligado para novidades! 🗺️"
              : filter === "past"
                ? "Nenhum evento passado encontrado neste período."
                : "Fique ligado — em breve teremos eventos geek em Manaus! 🗺️"}
          </p>
        </div>
      ) : (
        /* Mapa Leaflet */
        <div
          style={{
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
            border: "1px solid rgba(135,134,168,0.15)",
          }}
        >
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {events.map((event) => (
              <Marker
                key={event.id}
                position={[event.latitude, event.longitude]}
              >
                <Popup maxWidth={280} minWidth={200}>
                  <div style={{ fontFamily: "var(--font-sans)" }}>
                    {/* Nome do evento */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        color: "#1A1A2E",
                        margin: "0 0 0.25rem 0",
                        lineHeight: 1.3,
                      }}
                    >
                      {event.name}
                    </h3>

                    {/* Data */}
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#8786A8",
                        margin: "0 0 0.375rem 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      📅 {formatDate(event.date)}
                    </p>

                    {/* Local */}
                    {event.address && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#1A1A2E",
                          margin: "0 0 0.5rem 0",
                          lineHeight: 1.4,
                        }}
                      >
                        📍 {event.address}
                        {event.neighborhood && ` — ${event.neighborhood}`}
                      </p>
                    )}

                    {/* Lojas confirmadas */}
                    {event.stores.length > 0 && (
                      <div
                        style={{
                          borderTop: "1px solid rgba(135,134,168,0.15)",
                          paddingTop: "0.375rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            color: "#8786A8",
                            margin: "0 0 0.25rem 0",
                            textTransform: "uppercase",
                            letterSpacing: "0.03em",
                          }}
                        >
                          Lojas confirmadas
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.2rem",
                          }}
                        >
                          {event.stores.map((store) => (
                            <Link
                              key={store.slug}
                              href={`/lojas/${store.slug}`}
                              style={{
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                color: "#7B6CB5",
                                textDecoration: "none",
                                transition: "color 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "#D3BCFF")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color = "#7B6CB5")
                              }
                            >
                              🏪 {store.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
