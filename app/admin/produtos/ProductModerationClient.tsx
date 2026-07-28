"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  viewsCount: number;
  createdAt: string;
  store: {
    name: string;
    slug: string;
  };
  images: {
    url: string;
  }[];
}

interface ProductModerationClientProps {
  initialProducts: ProductData[];
}

export default function ProductModerationClient({ initialProducts }: ProductModerationClientProps) {
  const [products, setProducts] = useState<ProductData[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.store.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (product: ProductData) => {
    const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      setLoadingId(product.id);
      setErrorMsg("");
      const res = await fetch(`/api/admin/produtos/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Falha ao alterar status do produto");
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao atualizar produto");
    } finally {
      setLoadingId(null);
    }
  };

  const handleOpenEdit = (p: ProductData) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditDesc(p.description || "");
    setEditPrice(p.price.toString());
    setEditStatus(p.status);
    setErrorMsg("");
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    try {
      setLoadingId(editingProduct.id);
      setErrorMsg("");
      const res = await fetch(`/api/admin/produtos/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          price: editPrice,
          status: editStatus,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar produto");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: editName,
                description: editDesc,
                price: parseFloat(editPrice),
                status: editStatus,
              }
            : p
        )
      );
      setEditingProduct(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao salvar edições");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {/* Barra de busca e filtros */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔎 Buscar por produto ou nome da loja..."
          style={{
            flex: 1,
            minWidth: "260px",
            padding: "0.6rem 1rem",
            borderRadius: "var(--radius-card)",
            border: "1px solid rgba(135,134,168,0.3)",
            fontSize: "0.875rem",
            fontFamily: "var(--font-sans)",
          }}
        />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            { id: "ALL", label: `Todos (${products.length})` },
            { id: "ACTIVE", label: `Ativos (${products.filter((p) => p.status === "ACTIVE").length})` },
            { id: "INACTIVE", label: `Inativos (${products.filter((p) => p.status === "INACTIVE").length})` },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "var(--radius-card)",
                  border: "none",
                  fontSize: "0.8125rem",
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? "#D3BCFF" : "rgba(135,134,168,0.1)",
                  color: isActive ? "#1A1A2E" : "#8786A8",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: "0.875rem 1.25rem", backgroundColor: "#FEE2E2", borderRadius: "var(--radius-card)", color: "#DC2626", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Lista de produtos */}
      {filteredProducts.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-card)", border: "1px dashed rgba(135,134,168,0.3)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#8786A8" }}>
            Nenhum produto encontrado.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {filteredProducts.map((product) => {
            const isInactive = product.status === "INACTIVE";
            const imageUrl = product.images[0]?.url || "https://placehold.co/300x300/D3BCFF/1A1A2E?text=Sem+Foto";

            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "var(--radius-card)",
                  padding: "1.25rem",
                  border: isInactive ? "1px solid #FCA5A5" : "1px solid rgba(135,134,168,0.15)",
                  opacity: isInactive ? 0.75 : 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ width: "4rem", height: "4rem", borderRadius: "8px", overflow: "hidden", position: "relative", backgroundColor: "#F3F4F6", flexShrink: 0 }}>
                      <Image src={imageUrl} alt={product.name} fill style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isInactive ? "#DC2626" : "#059669", backgroundColor: isInactive ? "#FEE2E2" : "#D1FAE5", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                        {isInactive ? "🚫 INATIVO" : "🟢 ATIVO"}
                      </span>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#1A1A2E", marginTop: "0.25rem", marginBottom: "0.2rem", lineHeight: 1.3 }}>
                        {product.name}
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "#7B6CB5", fontWeight: 600, margin: 0 }}>
                        🏪 {product.store.name}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.8125rem", color: "#8786A8", marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {product.description || "Sem descrição"}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.125rem", color: "#1A1A2E" }}>
                      R$ {product.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#8786A8" }}>
                      👁️ {product.viewsCount} views
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid rgba(135,134,168,0.1)", paddingTop: "0.75rem" }}>
                  <button
                    onClick={() => handleToggleStatus(product)}
                    disabled={loadingId === product.id}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: "var(--radius-card)",
                      border: "none",
                      backgroundColor: isInactive ? "#8EF8D5" : "#FEF2F2",
                      color: isInactive ? "#1A1A2E" : "#DC2626",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {isInactive ? "Ativar Produto" : "Inativar Produto"}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(product)}
                    style={{
                      padding: "0.5rem 0.875rem",
                      borderRadius: "var(--radius-card)",
                      border: "1px solid rgba(135,134,168,0.3)",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#1A1A2E",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Edição de Conteúdo Impróprio / Dados do Produto */}
      {editingProduct && (
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
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "#1A1A2E", marginBottom: "0.5rem" }}>
              Moderar / Editar Produto
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#8786A8", marginBottom: "1.25rem" }}>
              Loja: <strong>{editingProduct.store.name}</strong>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                  Nome do produto
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                  Descrição
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                    Status no catálogo
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                  >
                    <option value="ACTIVE">ACTIVE (Visível)</option>
                    <option value="INACTIVE">INACTIVE (Oculto)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", backgroundColor: "#FFFFFF", fontSize: "0.875rem", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "var(--radius-card)", border: "none", backgroundColor: "#D3BCFF", color: "#1A1A2E", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
