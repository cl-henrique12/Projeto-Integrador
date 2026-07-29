"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/app/components/ImageUploader";


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
    <main className="min-h-screen bg-gradient-to-br from-aquamarine/10 via-base to-mauve/10">
      {/* Topo do Painel */}
      <header className="bg-blushpop shadow-xs" style={{ padding: '16px 0' }}>
        <div className="page-container flex items-center justify-between">
          <a href="/painel" className="font-display font-black text-xl text-text-primary">
            Geekfy <span className="text-text-primary/70 font-semibold text-sm">/ Painel</span>
          </a>
          <a href="/painel" className="text-xs font-semibold text-text-primary/80 hover:text-text-primary transition-colors">
            ← Voltar aos meus produtos
          </a>
        </div>
      </header>

      <div className="page-container" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        <div className="max-w-xl mx-auto bg-white rounded-card shadow-xl" style={{ padding: '40px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
            <h1 className="font-display font-black text-2xl text-text-primary">Novo produto</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '20px' }}>
            {/* Nome */}
            <div>
              <label htmlFor="prod-nome" className="block text-xs font-semibold text-text-primary" style={{ marginBottom: '6px' }}>Nome do produto *</label>
              <input id="prod-nome" type="text" required value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))}
                placeholder="Ex: Card One Piece OP-01" className="w-full rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all" style={{ padding: '12px 16px' }} />
            </div>

            {/* Preço */}
            <div>
              <label htmlFor="prod-preco" className="block text-xs font-semibold text-text-primary" style={{ marginBottom: '6px' }}>Preço (R$) *</label>
              <input id="prod-preco" type="text" required value={form.preco} onChange={e => setForm(f => ({...f, preco: e.target.value}))}
                placeholder="Ex: 45,90" className="w-full rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all" style={{ padding: '12px 16px' }} />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="prod-desc" className="block text-xs font-semibold text-text-primary" style={{ marginBottom: '6px' }}>Descrição</label>
              <textarea id="prod-desc" rows={3} value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))}
                placeholder="Detalhes do produto..." className="w-full rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 resize-none transition-all" style={{ padding: '12px 16px' }} />
            </div>

            {/* Imagem do produto */}
            <ImageUploader
              label="Imagem do produto"
              folder="produtos"
              value={form.imagemUrl}
              onChange={url => setForm(f => ({ ...f, imagemUrl: url }))}
              helpText="Envie uma imagem em boa resolução para destacar seu produto no catálogo."
            />

            {/* Tags de fandom */}
            <div>
              <p className="text-xs font-semibold text-text-primary" style={{ marginBottom: '8px' }}>Tags de fandom / tema</p>
              <div className="flex flex-wrap" style={{ gap: '8px' }}>
                {tags.map(tag => (
                  <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                    className={`rounded-full text-sm font-semibold transition-all ${tagsSelecionadas.includes(tag.id) ? "bg-aquamarine text-text-primary shadow-xs" : "bg-lavendergrey/10 text-lavendergrey hover:bg-aquamarine/30"}`}
                    style={{ padding: '6px 14px' }}>
                    {tag.name}
                  </button>
                ))}
                {tags.length === 0 && <p className="text-lavendergrey text-xs">Carregando tags...</p>}
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-lg" style={{ padding: '12px 16px' }}>
                <p className="text-red-600 text-sm font-sans">{erro}</p>
              </div>
            )}

            <button id="btn-criar-produto" type="submit" disabled={carregando}
              className="bg-aquamarine text-text-primary rounded-full font-bold text-sm hover:bg-aquamarine/80 transition-colors shadow-md disabled:opacity-60 cursor-pointer"
              style={{ padding: '14px 24px', marginTop: '12px' }}>
              {carregando ? "Salvando..." : "Salvar produto →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
