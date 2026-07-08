"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Tag { id: string; name: string; slug: string; }

export default function NovoProdutoPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [form, setForm] = useState({
    nome: "", descricao: "", preco: "", imagemUrl: "",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch("/api/tags").then(r => r.json()).then(setTags).catch(() => {});
  }, []);

  function toggleTag(id: string) {
    setTagsSelecionadas(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.preco) { setErro("Nome e preço são obrigatórios."); return; }
    const preco = parseFloat(form.preco.replace(",", "."));
    if (isNaN(preco) || preco <= 0) { setErro("Preço inválido."); return; }

    setErro("");
    setCarregando(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        descricao: form.descricao,
        preco,
        imagemUrl: form.imagemUrl,
        tags: tagsSelecionadas,
        ownerEmail: user.email,
      }),
    });

    setCarregando(false);

    if (res.ok) {
      router.push("/painel?cadastro=produto_ok");
    } else {
      const data = await res.json();
      setErro(data.error ?? "Erro ao cadastrar produto.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-aquamarine/10 via-base to-mauve/10 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-card shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <a href="/painel" className="text-lavendergrey hover:text-text-primary transition-colors">← Painel</a>
          <h1 className="font-display font-black text-xl text-text-primary">Novo produto</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Nome */}
          <div>
            <label htmlFor="prod-nome" className="block text-xs font-semibold text-text-primary mb-1.5">Nome do produto *</label>
            <input id="prod-nome" type="text" required value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))}
              placeholder="Ex: Card One Piece OP-01" className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all" />
          </div>

          {/* Preço */}
          <div>
            <label htmlFor="prod-preco" className="block text-xs font-semibold text-text-primary mb-1.5">Preço (R$) *</label>
            <input id="prod-preco" type="text" required value={form.preco} onChange={e => setForm(f => ({...f, preco: e.target.value}))}
              placeholder="Ex: 45,90" className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all" />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="prod-desc" className="block text-xs font-semibold text-text-primary mb-1.5">Descrição</label>
            <textarea id="prod-desc" rows={3} value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))}
              placeholder="Detalhes do produto..." className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 resize-none transition-all" />
          </div>

          {/* URL da imagem */}
          <div>
            <label htmlFor="prod-imagem" className="block text-xs font-semibold text-text-primary mb-1.5">URL da imagem <span className="text-lavendergrey font-normal">(upload via Supabase Storage em breve)</span></label>
            <input id="prod-imagem" type="url" value={form.imagemUrl} onChange={e => setForm(f => ({...f, imagemUrl: e.target.value}))}
              placeholder="https://..." className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all" />
          </div>

          {/* Tags de fandom */}
          <div>
            <p className="text-xs font-semibold text-text-primary mb-2">Tags de fandom / tema</p>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${tagsSelecionadas.includes(tag.id) ? "bg-aquamarine text-text-primary shadow" : "bg-lavendergrey/10 text-lavendergrey hover:bg-aquamarine/30"}`}>
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && <p className="text-lavendergrey text-xs">Carregando tags...</p>}
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-600 text-sm font-sans">{erro}</p>
            </div>
          )}

          <button id="btn-criar-produto" type="submit" disabled={carregando}
            className="bg-mauve text-text-primary py-3.5 rounded-full font-bold text-sm hover:bg-blushpop transition-colors shadow-md disabled:opacity-60">
            {carregando ? "Salvando..." : "Salvar produto →"}
          </button>
        </form>
      </div>
    </main>
  );
}
