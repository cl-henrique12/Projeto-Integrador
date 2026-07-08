"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Categoria {
  id: string;
  name: string;
  slug: string;
}

export default function CadastroLojaPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSelect, setCategoriasSelect] = useState<string[]>([]);
  const [form, setForm] = useState({
    nome: "", descricao: "", whatsapp: "", instagram: "", bairro: "",
    logoUrl: "", coverUrl: "",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    fetch("/api/categorias").then(r => r.json()).then(setCategorias).catch(() => {});
  }, []);

  function toggleCategoria(id: string) {
    setCategoriasSelect(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.whatsapp) { setErro("WhatsApp é obrigatório."); return; }
    if (categoriasSelect.length === 0) { setErro("Selecione ao menos 1 categoria."); return; }

    setErro("");
    setCarregando(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const res = await fetch("/api/lojas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        descricao: form.descricao,
        whatsapp: form.whatsapp.replace(/\D/g, ""),
        instagram: form.instagram,
        bairro: form.bairro,
        logoUrl: form.logoUrl,
        coverUrl: form.coverUrl,
        categorias: categoriasSelect,
        ownerEmail: user.email,
        ownerName: user.user_metadata?.name ?? user.email,
      }),
    });

    setCarregando(false);

    if (res.ok) {
      setSucesso(true);
    } else {
      const data = await res.json();
      setErro(data.error ?? "Erro ao cadastrar loja.");
    }
  }

  if (sucesso) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blushpop/30 via-base to-mauve/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-card shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-aquamarine rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-display font-black text-2xl text-text-primary mb-2">Loja cadastrada!</h1>
          <p className="text-lavendergrey font-sans text-sm mb-6">
            Sua loja foi enviada para aprovação da equipe Geekfy. Você será notificado por e-mail quando for aprovada.
          </p>
          <a href="/painel" className="inline-block bg-mauve text-text-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-blushpop transition-colors">
            Ir para o painel →
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blushpop/20 via-base to-aquamarine/10 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-card shadow-xl p-8">
        <h1 className="font-display font-black text-2xl text-text-primary mb-1">Dados da sua loja</h1>
        <p className="text-lavendergrey text-sm font-sans mb-6">Preencha o perfil da sua loja geek. Quanto mais completo, melhor!</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Nome */}
          <div>
            <label htmlFor="loja-nome" className="block text-xs font-semibold text-text-primary mb-1.5">Nome da loja *</label>
            <input id="loja-nome" type="text" required value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))}
              placeholder="Ex: Coruja Geek" className="input-field" />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="loja-descricao" className="block text-xs font-semibold text-text-primary mb-1.5">Descrição</label>
            <textarea id="loja-descricao" rows={3} value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))}
              placeholder="Conte o que sua loja vende..." className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 resize-none transition-all" />
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="loja-whatsapp" className="block text-xs font-semibold text-text-primary mb-1.5">WhatsApp * <span className="text-lavendergrey font-normal">(com DDD, sem espaços)</span></label>
            <input id="loja-whatsapp" type="tel" required value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))}
              placeholder="92991234567" className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all" />
          </div>

          {/* Instagram */}
          <div>
            <label htmlFor="loja-instagram" className="block text-xs font-semibold text-text-primary mb-1.5">Instagram <span className="text-lavendergrey font-normal">(opcional)</span></label>
            <input id="loja-instagram" type="text" value={form.instagram} onChange={e => setForm(f => ({...f, instagram: e.target.value}))}
              placeholder="@minhaloja" className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all" />
          </div>

          {/* Bairro */}
          <div>
            <label htmlFor="loja-bairro" className="block text-xs font-semibold text-text-primary mb-1.5">Bairro em Manaus <span className="text-lavendergrey font-normal">(se tiver loja física)</span></label>
            <input id="loja-bairro" type="text" value={form.bairro} onChange={e => setForm(f => ({...f, bairro: e.target.value}))}
              placeholder="Ex: Centro, Adrianópolis..." className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all" />
          </div>

          {/* Categorias */}
          <div>
            <p className="text-xs font-semibold text-text-primary mb-2">Categorias * <span className="text-lavendergrey font-normal">(selecione pelo menos 1)</span></p>
            <div className="flex flex-wrap gap-2">
              {categorias.map(cat => (
                <button key={cat.id} type="button" onClick={() => toggleCategoria(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${categoriasSelect.includes(cat.id) ? "bg-mauve text-text-primary shadow" : "bg-lavendergrey/10 text-lavendergrey hover:bg-mauve/20"}`}>
                  {cat.name}
                </button>
              ))}
              {categorias.length === 0 && <p className="text-lavendergrey text-xs font-sans">Carregando categorias...</p>}
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-600 text-sm font-sans">{erro}</p>
            </div>
          )}

          <button id="btn-cadastrar-loja" type="submit" disabled={carregando}
            className="bg-mauve text-text-primary py-3.5 rounded-full font-bold text-sm hover:bg-blushpop transition-colors shadow-md disabled:opacity-60 mt-2">
            {carregando ? "Enviando para aprovação..." : "Cadastrar loja →"}
          </button>
        </form>
      </div>
    </main>
  );
}
