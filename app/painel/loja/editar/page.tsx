"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/app/components/ImageUploader";

export default function EditarLojaPage() {
  const router = useRouter();
  const [storeId, setStoreId] = useState("");
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    whatsapp: "",
    instagram: "",
    bairro: "",
    logoUrl: "",
    coverUrl: "",
  });
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    async function carregarLoja() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`/api/lojas?ownerEmail=${encodeURIComponent(user.email!)}`);
        const data = await res.json();

        // Buscar dados da loja do lojista
        const resPainel = await fetch("/api/lojas/minha-loja");
        let storeData = data.lojas?.find((l: any) => l.owner?.email === user.email);

        if (!storeData && resPainel.ok) {
          storeData = await resPainel.json();
        }

        if (storeData) {
          setStoreId(storeData.id);
          setForm({
            nome: storeData.name || "",
            descricao: storeData.description || "",
            whatsapp: storeData.whatsapp || "",
            instagram: storeData.instagram || "",
            bairro: storeData.neighborhood || "",
            logoUrl: storeData.logoUrl || "",
            coverUrl: storeData.coverUrl || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados da loja:", err);
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarLoja();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.whatsapp) {
      setErro("Nome e WhatsApp são obrigatórios.");
      return;
    }

    setErro("");
    setCarregando(true);
    setSucesso(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/lojas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeId,
        nome: form.nome,
        descricao: form.descricao,
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        bairro: form.bairro,
        logoUrl: form.logoUrl,
        coverUrl: form.coverUrl,
        ownerEmail: user.email,
      }),
    });

    setCarregando(false);

    if (res.ok) {
      setSucesso(true);
      setTimeout(() => {
        router.push("/painel");
      }, 1500);
    } else {
      const data = await res.json();
      setErro(data.error ?? "Erro ao salvar alterações da loja.");
    }
  }

  if (carregandoDados) {
    return (
      <main className="min-h-screen bg-base flex items-center justify-center p-4">
        <p className="text-sm font-semibold text-lavendergrey">Carregando dados da sua loja...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blushpop/20 via-base to-aquamarine/10 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-card shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <a href="/painel" className="text-lavendergrey hover:text-text-primary transition-colors text-sm font-semibold">← Painel</a>
          <h1 className="font-display font-black text-xl text-text-primary">Editar perfil da loja</h1>
        </div>

        {sucesso && (
          <div className="bg-aquamarine/30 border border-aquamarine text-text-primary px-4 py-3 rounded-card mb-6 text-sm font-semibold flex items-center gap-2">
            <span>✅</span> Alterações salvas com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nome */}
          <div>
            <label htmlFor="loja-nome" className="block text-xs font-semibold text-text-primary mb-1.5">
              Nome da loja *
            </label>
            <input
              id="loja-nome"
              type="text"
              required
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="loja-desc" className="block text-xs font-semibold text-text-primary mb-1.5">
              Descrição
            </label>
            <textarea
              id="loja-desc"
              rows={3}
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 resize-none transition-all"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="loja-whatsapp" className="block text-xs font-semibold text-text-primary mb-1.5">
              WhatsApp *
            </label>
            <input
              id="loja-whatsapp"
              type="tel"
              required
              value={form.whatsapp}
              onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          {/* Instagram */}
          <div>
            <label htmlFor="loja-instagram" className="block text-xs font-semibold text-text-primary mb-1.5">
              Instagram
            </label>
            <input
              id="loja-instagram"
              type="text"
              value={form.instagram}
              onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          {/* Bairro */}
          <div>
            <label htmlFor="loja-bairro" className="block text-xs font-semibold text-text-primary mb-1.5">
              Bairro em Manaus
            </label>
            <input
              id="loja-bairro"
              type="text"
              value={form.bairro}
              onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))}
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          {/* Upload de Logo */}
          <ImageUploader
            label="Logo da loja"
            folder="lojas"
            aspectRatio="logo"
            value={form.logoUrl}
            onChange={url => setForm(f => ({ ...f, logoUrl: url }))}
            helpText="Logomarca da loja que aparece nos cards e no perfil."
          />

          {/* Upload de Capa */}
          <ImageUploader
            label="Imagem de capa"
            folder="lojas"
            aspectRatio="cover"
            value={form.coverUrl}
            onChange={url => setForm(f => ({ ...f, coverUrl: url }))}
            helpText="Banner principal no topo da sua página."
          />

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-sans">{erro}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="bg-mauve text-text-primary py-3.5 rounded-full font-bold text-sm hover:bg-blushpop transition-colors shadow-md disabled:opacity-60"
          >
            {carregando ? "Salvando..." : "Salvar alterações →"}
          </button>
        </form>
      </div>
    </main>
  );
}
