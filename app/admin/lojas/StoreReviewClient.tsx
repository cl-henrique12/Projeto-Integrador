"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface StoreData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  whatsapp: string;
  instagram: string | null;
  neighborhood: string | null;
  city: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  rejectionReason?: string | null;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
  categories: {
    category: Category;
  }[];
  _count: {
    products: number;
  };
}

interface StoreReviewClientProps {
  initialStores: StoreData[];
}

export default function StoreReviewClient({ initialStores }: StoreReviewClientProps) {
  const [stores, setStores] = useState<StoreData[]>(initialStores);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");
  const [rejectingStore, setRejectingStore] = useState<StoreData | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredStores = stores.filter((s) => {
    if (activeTab === "ALL") return true;
    return s.status === activeTab;
  });

  const handleApprove = async (storeId: string) => {
    try {
      setLoadingId(storeId);
      setErrorMsg("");
      const res = await fetch(`/api/admin/lojas/${storeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao aprovar loja");
      }

      setStores((prev) =>
        prev.map((s) =>
          s.id === storeId ? { ...s, status: "APPROVED", rejectionReason: null } : s
        )
      );
      if (selectedStore?.id === storeId) {
        setSelectedStore((prev) => (prev ? { ...prev, status: "APPROVED", rejectionReason: null } : null));
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectingStore) return;
    if (!rejectionReasonInput.trim()) {
      setErrorMsg("O motivo da rejeição é obrigatório.");
      return;
    }

    try {
      setLoadingId(rejectingStore.id);
      setErrorMsg("");
      const res = await fetch(`/api/admin/lojas/${rejectingStore.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REJECTED",
          reason: rejectionReasonInput.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao rejeitar loja");
      }

      setStores((prev) =>
        prev.map((s) =>
          s.id === rejectingStore.id
            ? { ...s, status: "REJECTED", rejectionReason: rejectionReasonInput.trim() }
            : s
        )
      );

      if (selectedStore?.id === rejectingStore.id) {
        setSelectedStore((prev) =>
          prev ? { ...prev, status: "REJECTED", rejectionReason: rejectionReasonInput.trim() } : null
        );
      }

      setRejectingStore(null);
      setRejectionReasonInput("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao rejeitar loja");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span style={{ padding: "0.25rem 0.6rem", borderRadius: "9999px", backgroundColor: "#FFD166", color: "#1A1A2E", fontWeight: 700, fontSize: "0.75rem" }}>⏳ PENDENTE</span>;
      case "APPROVED":
        return <span style={{ padding: "0.25rem 0.6rem", borderRadius: "9999px", backgroundColor: "#8EF8D5", color: "#1A1A2E", fontWeight: 700, fontSize: "0.75rem" }}>✅ APROVADA</span>;
      case "REJECTED":
        return <span style={{ padding: "0.25rem 0.6rem", borderRadius: "9999px", backgroundColor: "#FEE2E2", color: "#DC2626", fontWeight: 700, fontSize: "0.75rem" }}>❌ REJEITADA</span>;
      default:
        return <span style={{ padding: "0.25rem 0.6rem", borderRadius: "9999px", backgroundColor: "#E5E7EB", color: "#4B5563", fontWeight: 700, fontSize: "0.75rem" }}>{status}</span>;
    }
  };

  return (
    <div>
      {/* Abas de filtro */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { id: "PENDING", label: `Pendentes (${stores.filter((s) => s.status === "PENDING").length})` },
          { id: "APPROVED", label: `Aprovadas (${stores.filter((s) => s.status === "APPROVED").length})` },
          { id: "REJECTED", label: `Rejeitadas (${stores.filter((s) => s.status === "REJECTED").length})` },
          { id: "ALL", label: `Todas (${stores.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--radius-card)",
                border: "none",
                fontSize: "0.8125rem",
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? "#D3BCFF" : "rgba(135,134,168,0.1)",
                color: isActive ? "#1A1A2E" : "#8786A8",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <div style={{ padding: "0.875rem 1.25rem", backgroundColor: "#FEE2E2", borderRadius: "var(--radius-card)", color: "#DC2626", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Lista de lojas */}
      {filteredStores.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-card)", border: "1px dashed rgba(135,134,168,0.3)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#8786A8" }}>
            Nenhuma loja encontrada para este filtro.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredStores.map((store) => (
            <div
              key={store.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "var(--radius-card)",
                padding: "1.5rem",
                border: store.status === "PENDING" ? "2px solid #FFD166" : "1px solid rgba(135,134,168,0.15)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  {store.logoUrl ? (
                    <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", overflow: "hidden", position: "relative", backgroundColor: "#F3F4F6", flexShrink: 0 }}>
                      <Image src={store.logoUrl} alt={store.name} fill style={{ objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", backgroundColor: "#FFBFEA", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#1A1A2E", flexShrink: 0 }}>
                      {store.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: "#1A1A2E", margin: 0 }}>
                        {store.name}
                      </h3>
                      {getStatusBadge(store.status)}
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "#8786A8", margin: "0.2rem 0 0 0" }}>
                      Dono: <strong>{store.owner.name}</strong> ({store.owner.email}) · Cadastrado em {new Date(store.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={() => setSelectedStore(selectedStore?.id === store.id ? null : store)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius-card)",
                      border: "1px solid rgba(135,134,168,0.3)",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "#1A1A2E",
                      cursor: "pointer",
                    }}
                  >
                    {selectedStore?.id === store.id ? "Fechar detalhes ▲" : "Analisar cadastro ▼"}
                  </button>

                  {store.status !== "APPROVED" && (
                    <button
                      onClick={() => handleApprove(store.id)}
                      disabled={loadingId === store.id}
                      style={{
                        padding: "0.5rem 1.25rem",
                        borderRadius: "var(--radius-card)",
                        border: "none",
                        backgroundColor: "#8EF8D5",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "#1A1A2E",
                        cursor: "pointer",
                      }}
                    >
                      {loadingId === store.id ? "Salvando..." : "✅ Aprovar"}
                    </button>
                  )}

                  {store.status !== "REJECTED" && (
                    <button
                      onClick={() => {
                        setRejectingStore(store);
                        setRejectionReasonInput("");
                        setErrorMsg("");
                      }}
                      disabled={loadingId === store.id}
                      style={{
                        padding: "0.5rem 1.25rem",
                        borderRadius: "var(--radius-card)",
                        border: "1px solid #FCA5A5",
                        backgroundColor: "#FEF2F2",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "#DC2626",
                        cursor: "pointer",
                      }}
                    >
                      ❌ Rejeitar
                    </button>
                  )}
                </div>
              </div>

              {/* Motivo de Rejeição (se houver) */}
              {store.status === "REJECTED" && store.rejectionReason && (
                <div style={{ padding: "0.75rem 1rem", backgroundColor: "#FEF2F2", borderRadius: "8px", borderLeft: "4px solid #EF4444" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#991B1B", margin: "0 0 0.2rem 0" }}>
                    MOTIVO DA REJEIÇÃO ENVIADO AO LOJISTA:
                  </p>
                  <p style={{ fontSize: "0.8125rem", color: "#7F1D1D", margin: 0, fontStyle: "italic" }}>
                    &quot;{store.rejectionReason}&quot;
                  </p>
                </div>
              )}

              {/* Painel Expansível de Análise de Dados */}
              {selectedStore?.id === store.id && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(135,134,168,0.15)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1.25rem",
                    backgroundColor: "#FAF9FE",
                    padding: "1.25rem",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#8786A8", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      Informações Principais
                    </h4>
                    <p style={{ fontSize: "0.875rem", margin: "0 0 0.4rem 0" }}>
                      <strong>Nome:</strong> {store.name}
                    </p>
                    <p style={{ fontSize: "0.875rem", margin: "0 0 0.4rem 0" }}>
                      <strong>Slug URL:</strong> <code>/lojas/{store.slug}</code>
                    </p>
                    <p style={{ fontSize: "0.875rem", margin: "0 0 0.4rem 0" }}>
                      <strong>Descrição:</strong> {store.description || "Sem descrição"}
                    </p>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>
                      <strong>Produtos cadastrados:</strong> {store._count.products}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#8786A8", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      Contato & Localização
                    </h4>
                    <p style={{ fontSize: "0.875rem", margin: "0 0 0.4rem 0" }}>
                      <strong>WhatsApp:</strong> {store.whatsapp}
                    </p>
                    <p style={{ fontSize: "0.875rem", margin: "0 0 0.4rem 0" }}>
                      <strong>Instagram:</strong> {store.instagram || "Não informado"}
                    </p>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>
                      <strong>Bairro / Cidade:</strong> {store.neighborhood ? `${store.neighborhood}, ${store.city}` : store.city}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#8786A8", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      Categorias Vinculadas
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {store.categories.length > 0 ? (
                        store.categories.map(({ category }) => (
                          <span
                            key={category.id}
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              padding: "0.25rem 0.6rem",
                              borderRadius: "9999px",
                              backgroundColor: "#D3BCFF",
                              color: "#1A1A2E",
                            }}
                          >
                            {category.name}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: "0.8125rem", color: "#8786A8" }}>Nenhuma categoria</span>
                      )}
                    </div>
                    {store.status === "APPROVED" && (
                      <div style={{ marginTop: "1rem" }}>
                        <Link
                          href={`/lojas/${store.slug}`}
                          target="_blank"
                          style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#7B6CB5", textDecoration: "none" }}
                        >
                          Ver página pública da loja ↗
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmação de motivo de rejeição */}
      {rejectingStore && (
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
              maxWidth: "500px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#DC2626",
                marginBottom: "0.5rem",
              }}
            >
              Rejeitar Cadastro da Loja
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#4B5563", marginBottom: "1rem" }}>
              Você está rejeitando o cadastro da loja <strong>{rejectingStore.name}</strong>. Por favor, forneça o motivo em texto para orientar o lojista:
            </p>

            <textarea
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="Ex: Documentação de contato incompleta ou descrição fora das diretrizes geek."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(135,134,168,0.3)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-sans)",
                marginBottom: "1rem",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                onClick={() => setRejectingStore(null)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid rgba(135,134,168,0.3)",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleRejectSubmit}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "var(--radius-card)",
                  border: "none",
                  backgroundColor: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
