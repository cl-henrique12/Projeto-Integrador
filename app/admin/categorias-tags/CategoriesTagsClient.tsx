"use client";

import { useState } from "react";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  _count: {
    stores: number;
  };
}

interface TagData {
  id: string;
  name: string;
  slug: string;
  synonyms: string[];
  _count: {
    products: number;
  };
}

interface CategoriesTagsClientProps {
  initialCategories: CategoryData[];
  initialTags: TagData[];
}

export default function CategoriesTagsClient({
  initialCategories,
  initialTags,
}: CategoriesTagsClientProps) {
  const [activeTab, setActiveTab] = useState<"CATEGORIES" | "TAGS">("CATEGORIES");
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [tags, setTags] = useState<TagData[]>(initialTags);

  // Estados de formulário para Criar/Editar Categoria
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [editingCat, setEditingCat] = useState<CategoryData | null>(null);

  // Estados de formulário para Criar/Editar Tag
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [tagSynonyms, setTagSynonyms] = useState("");
  const [editingTag, setEditingTag] = useState<TagData | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handler: Auto-gerar slug a partir do nome
  const handleNameChangeCat = (val: string) => {
    setCatName(val);
    if (!editingCat) {
      setCatSlug(val.toLowerCase().trim().replace(/\s+/g, "-"));
    }
  };

  const handleNameChangeTag = (val: string) => {
    setTagName(val);
    if (!editingTag) {
      setTagSlug(val.toLowerCase().trim().replace(/\s+/g, "-"));
    }
  };

  // CRUD Categorias
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug) return;
    try {
      setLoading(true);
      setErrorMsg("");

      const url = editingCat ? `/api/admin/categorias/${editingCat.id}` : "/api/admin/categorias";
      const method = editingCat ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, slug: catSlug }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar categoria");
      }

      const saved = await res.json();

      if (editingCat) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCat.id ? { ...c, name: saved.name, slug: saved.slug } : c))
        );
      } else {
        setCategories((prev) => [...prev, { ...saved, _count: { stores: 0 } }]);
      }

      setCatName("");
      setCatSlug("");
      setEditingCat(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao salvar categoria");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: CategoryData) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${cat.name}"?`)) return;
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/admin/categorias/${cat.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir categoria");
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao excluir categoria");
    } finally {
      setLoading(false);
    }
  };

  // CRUD Tags
  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName || !tagSlug) return;
    try {
      setLoading(true);
      setErrorMsg("");

      const synonymsArray = tagSynonyms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const url = editingTag ? `/api/admin/tags/${editingTag.id}` : "/api/admin/tags";
      const method = editingTag ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName, slug: tagSlug, synonyms: synonymsArray }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar tag");
      }

      const saved = await res.json();

      if (editingTag) {
        setTags((prev) =>
          prev.map((t) =>
            t.id === editingTag.id
              ? { ...t, name: saved.name, slug: saved.slug, synonyms: saved.synonyms }
              : t
          )
        );
      } else {
        setTags((prev) => [...prev, { ...saved, _count: { products: 0 } }]);
      }

      setTagName("");
      setTagSlug("");
      setTagSynonyms("");
      setEditingTag(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao salvar tag");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tag: TagData) => {
    if (!confirm(`Tem certeza que deseja excluir a tag "${tag.name}"?`)) return;
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/admin/tags/${tag.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir tag");
      setTags((prev) => prev.filter((t) => t.id !== tag.id));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao excluir tag");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Abas */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => {
            setActiveTab("CATEGORIES");
            setErrorMsg("");
          }}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-card)",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: activeTab === "CATEGORIES" ? 700 : 500,
            backgroundColor: activeTab === "CATEGORIES" ? "#D3BCFF" : "rgba(135,134,168,0.1)",
            color: activeTab === "CATEGORIES" ? "#1A1A2E" : "#8786A8",
            cursor: "pointer",
          }}
        >
          📁 Categorias de Loja ({categories.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("TAGS");
            setErrorMsg("");
          }}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-card)",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: activeTab === "TAGS" ? 700 : 500,
            backgroundColor: activeTab === "TAGS" ? "#FFBFEA" : "rgba(135,134,168,0.1)",
            color: activeTab === "TAGS" ? "#1A1A2E" : "#8786A8",
            cursor: "pointer",
          }}
        >
          🏷️ Tags de Fandom ({tags.length})
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: "0.875rem 1.25rem", backgroundColor: "#FEE2E2", borderRadius: "var(--radius-card)", color: "#DC2626", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Seção Categorias */}
      {activeTab === "CATEGORIES" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Formulário Criar/Editar */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "var(--radius-card)", padding: "1.5rem", border: "1px solid rgba(135,134,168,0.15)", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: "#1A1A2E", marginBottom: "1rem" }}>
              {editingCat ? "✏️ Editar Categoria" : "➕ Nova Categoria"}
            </h3>

            <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TCG / Jogos de Carta"
                  value={catName}
                  onChange={(e) => handleNameChangeCat(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                  Slug (URL)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: tcg"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                {editingCat && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCat(null);
                      setCatName("");
                      setCatSlug("");
                    }}
                    style={{ flex: 1, padding: "0.5rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", backgroundColor: "#FFFFFF", fontSize: "0.8125rem", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, padding: "0.55rem", borderRadius: "var(--radius-card)", border: "none", backgroundColor: "#D3BCFF", color: "#1A1A2E", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}
                >
                  {loading ? "Salvando..." : editingCat ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Categorias */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "var(--radius-card)", padding: "1.5rem", border: "1px solid rgba(135,134,168,0.15)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: "#1A1A2E", marginBottom: "1rem" }}>
              Categorias Cadastradas
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    backgroundColor: "#FAF9FE",
                    border: "1px solid rgba(135,134,168,0.1)",
                  }}
                >
                  <div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem", color: "#1A1A2E", margin: 0 }}>
                      {cat.name}
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "#8786A8", margin: "0.1rem 0 0 0" }}>
                      Slug: <code>{cat.slug}</code> · Usada em {cat._count?.stores ?? 0} loja(s)
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      onClick={() => {
                        setEditingCat(cat);
                        setCatName(cat.name);
                        setCatSlug(cat.slug);
                      }}
                      style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid rgba(135,134,168,0.3)", backgroundColor: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid #FCA5A5", backgroundColor: "#FEF2F2", color: "#DC2626", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Seção Tags */}
      {activeTab === "TAGS" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Formulário Criar/Editar Tag */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "var(--radius-card)", padding: "1.5rem", border: "1px solid rgba(135,134,168,0.15)", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: "#1A1A2E", marginBottom: "1rem" }}>
              {editingTag ? "✏️ Editar Tag de Fandom" : "🏷️ Nova Tag de Fandom"}
            </h3>

            <form onSubmit={handleSaveTag} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                  Nome do Fandom / Tema
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: One Piece"
                  value={tagName}
                  onChange={(e) => handleNameChangeTag(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                  Slug (URL)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: one-piece"
                  value={tagSlug}
                  onChange={(e) => setTagSlug(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1A1A2E", marginBottom: "0.3rem" }}>
                  Sinônimos (separados por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: luffy, piratas, chapeu de palha"
                  value={tagSynonyms}
                  onChange={(e) => setTagSynonyms(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", boxSizing: "border-box" }}
                />
                <span style={{ fontSize: "0.7rem", color: "#8786A8" }}>Utilizado no mecanismo de busca semântica do Geekfy.</span>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                {editingTag && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTag(null);
                      setTagName("");
                      setTagSlug("");
                      setTagSynonyms("");
                    }}
                    style={{ flex: 1, padding: "0.5rem", borderRadius: "var(--radius-card)", border: "1px solid rgba(135,134,168,0.3)", backgroundColor: "#FFFFFF", fontSize: "0.8125rem", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, padding: "0.55rem", borderRadius: "var(--radius-card)", border: "none", backgroundColor: "#FFBFEA", color: "#1A1A2E", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}
                >
                  {loading ? "Salvando..." : editingTag ? "Atualizar Tag" : "Cadastrar Tag"}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Tags */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "var(--radius-card)", padding: "1.5rem", border: "1px solid rgba(135,134,168,0.15)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: "#1A1A2E", marginBottom: "1rem" }}>
              Tags de Fandom Cadastradas
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    backgroundColor: "#FAF9FE",
                    border: "1px solid rgba(135,134,168,0.1)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem", color: "#1A1A2E", margin: 0 }}>
                        {tag.name}
                      </h4>
                      <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem", borderRadius: "9999px", backgroundColor: "#FFBFEA", color: "#1A1A2E", fontWeight: 700 }}>
                        {tag._count?.products ?? 0} produto(s)
                      </span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#8786A8", margin: "0.2rem 0 0 0" }}>
                      Slug: <code>{tag.slug}</code>
                      {tag.synonyms.length > 0 && ` · Sinônimos: [${tag.synonyms.join(", ")}]`}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      onClick={() => {
                        setEditingTag(tag);
                        setTagName(tag.name);
                        setTagSlug(tag.slug);
                        setTagSynonyms(tag.synonyms.join(", "));
                      }}
                      style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid rgba(135,134,168,0.3)", backgroundColor: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag)}
                      style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid #FCA5A5", backgroundColor: "#FEF2F2", color: "#DC2626", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
