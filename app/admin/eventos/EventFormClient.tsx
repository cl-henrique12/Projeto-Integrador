"use client";

import { useState } from "react";
import EventMapPickerLoader from "@/app/components/EventMapPickerLoader";

interface ApprovedStore {
  id: string;
  name: string;
  slug: string;
  neighborhood: string | null;
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
  stores: {
    storeId: string;
    store: {
      name: string;
    };
  }[];
}

interface EventFormClientProps {
  initialEvents: EventData[];
  approvedStores: ApprovedStore[];
}

export default function EventFormClient({
  initialEvents,
  approvedStores,
}: EventFormClientProps) {
  const [events, setEvents] = useState<EventData[]>(initialEvents);

  // Campos do formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [latitude, setLatitude] = useState<number>(-3.119); // Centro de Manaus
  const [longitude, setLongitude] = useState<number>(-60.021);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal para vincular lojas confirmadas ao evento
  const [linkingEvent, setLinkingEvent] = useState<EventData | null>(null);
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [savingStores, setSavingStores] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) {
      setErrorMsg("Nome do evento e data são obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          date,
          address,
          neighborhood,
          latitude,
          longitude,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao cadastrar evento");
      }

      const createdEvent = await res.json();

      setEvents((prev) => [
        {
          ...createdEvent,
          date: new Date(createdEvent.date).toISOString(),
          stores: [],
        },
        ...prev,
      ]);

      // Reset formulário
      setName("");
      setDescription("");
      setDate("");
      setAddress("");
      setNeighborhood("");

      // Abrir modal de seleção de lojas para o evento recém-criado
      setLinkingEvent({
        ...createdEvent,
        date: new Date(createdEvent.date).toISOString(),
        stores: [],
      });
      setSelectedStoreIds([]);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao cadastrar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Deseja realmente excluir este evento?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/eventos/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir evento");
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao excluir evento");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStoreLinking = (ev: EventData) => {
    setLinkingEvent(ev);
    setSelectedStoreIds(ev.stores.map((s) => s.storeId));
    setErrorMsg("");
  };

  const handleToggleStoreSelection = (storeId: string) => {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  const handleSaveEventStores = async () => {
    if (!linkingEvent) return;
    try {
      setSavingStores(true);
      setErrorMsg("");

      const res = await fetch(`/api/admin/eventos/${linkingEvent.id}/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeIds: selectedStoreIds }),
      });

      if (!res.ok) throw new Error("Erro ao salvar lojas confirmadas no evento");

      // Atualizar estado local
      const updatedStores = approvedStores
        .filter((s) => selectedStoreIds.includes(s.id))
        .map((s) => ({ storeId: s.id, store: { name: s.name } }));

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === linkingEvent.id ? { ...ev, stores: updatedStores } : ev
        )
      );

      setLinkingEvent(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao salvar lojas no evento");
    } finally {
      setSavingStores(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
      {/* Formulário de Cadastro de Evento */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "var(--radius-card)",
          padding: "1.5rem",
          border: "1px solid rgba(135,134,168,0.15)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1A1A2E",
            marginBottom: "1rem",
          }}
        >
          ➕ Novo Evento Geek
        </h2>

        {errorMsg && (
          <div style={{ padding: "0.75rem 1rem", backgroundColor: "#FEE2E2", color: "#DC2626", borderRadius: "var(--radius-card)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreateEvent} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
              Nome do Evento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Anime Jungle Party 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                Bairro
              </label>
              <input
                type="text"
                placeholder="Ex: Adrianópolis"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
              Endereço / Local
            </label>
            <input
              type="text"
              placeholder="Ex: Studio 5 Centro de Convenções"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
              Descrição
            </label>
            <textarea
              rows={3}
              placeholder="Detalhes do evento, atrações, convidados..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
            />
          </div>

          {/* Seletor no Mapa de Eventos */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.4rem" }}>
              📍 Localização no Mapa de Manaus (Clique para escolher):
            </label>
            <EventMapPickerLoader
              latitude={latitude}
              longitude={longitude}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-card)",
              border: "none",
              backgroundColor: "#8EF8D5",
              color: "#1A1A2E",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "0.9375rem",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Cadastrando..." : "✨ Cadastrar Evento & Selecionar Lojas →"}
          </button>
        </form>
      </div>

      {/* Lista de Eventos Existentes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1A1A2E",
            margin: 0,
          }}
        >
          📅 Eventos Cadastrados ({events.length})
        </h2>

        {events.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-card)", border: "1px dashed rgba(135,134,168,0.3)" }}>
            <p style={{ color: "#8786A8", fontSize: "0.875rem" }}>Nenhum evento cadastrado ainda.</p>
          </div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "var(--radius-card)",
                padding: "1.25rem",
                border: "1px solid rgba(135,134,168,0.15)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.0625rem", color: "#1A1A2E", margin: 0 }}>
                    {ev.name}
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "#8786A8", margin: "0.2rem 0 0 0" }}>
                    📅 {new Date(ev.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteEvent(ev.id)}
                  style={{ padding: "0.25rem 0.5rem", borderRadius: "6px", border: "1px solid #FCA5A5", backgroundColor: "#FEF2F2", color: "#DC2626", fontSize: "0.75rem", cursor: "pointer" }}
                >
                  🗑️ Excluir
                </button>
              </div>

              {ev.address && (
                <p style={{ fontSize: "0.8125rem", color: "#4B5563", margin: "0 0 0.5rem 0" }}>
                  📍 {ev.address} {ev.neighborhood ? `— ${ev.neighborhood}` : ""}
                </p>
              )}

              {/* Lojas vinculadas */}
              <div style={{ backgroundColor: "#FAF9FE", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(135,134,168,0.1)", marginTop: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7B6CB5", textTransform: "uppercase" }}>
                    🏪 Lojas Confirmadas ({ev.stores.length})
                  </span>
                  <button
                    onClick={() => handleOpenStoreLinking(ev)}
                    style={{ padding: "0.25rem 0.65rem", borderRadius: "6px", border: "none", backgroundColor: "#D3BCFF", color: "#1A1A2E", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    ⚙️ Gerenciar Lojas
                  </button>
                </div>

                {ev.stores.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {ev.stores.map((s) => (
                      <span key={s.storeId} style={{ fontSize: "0.75rem", backgroundColor: "#FFFFFF", padding: "0.15rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(135,134,168,0.2)" }}>
                        {s.store.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.75rem", color: "#8786A8", margin: 0, fontStyle: "italic" }}>
                    Nenhuma loja confirmada neste evento ainda.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Seleção/Vinculação de Lojas Confirmadas (EventStore) */}
      {linkingEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "var(--radius-card)",
              maxWidth: "520px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "#1A1A2E", marginBottom: "0.25rem" }}>
              Confirmar Lojas no Evento
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#8786A8", marginBottom: "1.25rem" }}>
              Evento: <strong>{linkingEvent.name}</strong>
            </p>

            <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.75rem" }}>
              Selecione as lojas aprovadas (APPROVED) que participarão:
            </p>

            {approvedStores.length === 0 ? (
              <p style={{ fontSize: "0.8125rem", color: "#8786A8" }}>Nenhuma loja aprovada no sistema no momento.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {approvedStores.map((store) => {
                  const isSelected = selectedStoreIds.includes(store.id);
                  return (
                    <label
                      key={store.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        backgroundColor: isSelected ? "rgba(142,248,213,0.2)" : "#F8F8FC",
                        border: isSelected ? "1px solid #8EF8D5" : "1px solid rgba(135,134,168,0.15)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleStoreSelection(store.id)}
                        style={{ width: "1.1rem", height: "1.1rem", cursor: "pointer" }}
                      />
                      <div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1A1A2E" }}>
                          {store.name}
                        </span>
                        {store.neighborhood && (
                          <span style={{ fontSize: "0.75rem", color: "#8786A8", marginLeft: "0.5rem" }}>
                            ({store.neighborhood})
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                onClick={() => setLinkingEvent(null)}
                style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", backgroundColor: "#FFFFFF", fontSize: "0.875rem", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEventStores}
                disabled={savingStores}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "var(--radius-card)", border: "none", backgroundColor: "#8EF8D5", color: "#1A1A2E", fontSize: "0.875rem", fontWeight: 800, cursor: "pointer" }}
              >
                {savingStores ? "Salvando..." : "✅ Salvar Lojas Confirmadas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
