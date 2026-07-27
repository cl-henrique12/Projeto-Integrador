"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { name: nome, role: "LOJISTA" },
        emailRedirectTo: `${window.location.origin}/cadastro/loja`,
      },
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
    } else {
      setSucesso(true);
    }
  }

  if (sucesso) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blushpop/30 via-base to-mauve/20 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-card shadow-xl max-w-md w-full text-center"
          style={{ padding: "48px 40px" }}
        >
          <div
            className="bg-aquamarine rounded-full flex items-center justify-center mx-auto"
            style={{ width: "64px", height: "64px", marginBottom: "20px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-display font-black text-2xl text-text-primary" style={{ marginBottom: "12px" }}>Conta criada!</h1>
          <p className="text-lavendergrey font-sans text-sm" style={{ marginBottom: "28px" }}>
            Verifique seu e-mail <strong>{email}</strong> e clique no link de confirmação para ativar sua conta.
          </p>
          <Link href="/" className="text-sm text-mauve hover:underline font-semibold">← Voltar para a vitrine</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blushpop/30 via-base to-mauve/20 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-card shadow-xl max-w-md w-full"
        style={{ padding: "48px 40px 36px 40px" }}
      >
        {/* Cabeçalho */}
        <div className="text-center" style={{ marginBottom: "32px" }}>
          <div
            className="rounded-full bg-blushpop flex items-center justify-center mx-auto"
            style={{ width: "56px", height: "56px", marginBottom: "16px" }}
          >
            <span className="font-display font-black text-text-primary">GKF</span>
          </div>
          <h1 className="font-display font-black text-2xl text-text-primary">Cadastre sua loja</h1>
          <p className="text-lavendergrey text-sm font-sans" style={{ marginTop: "8px" }}>
            Apareça para milhares de geeks em Manaus. Grátis!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: "20px" }}>
          {/* Nome */}
          <div>
            <label
              htmlFor="cadastro-nome"
              className="block text-xs font-semibold text-text-primary font-sans"
              style={{ marginBottom: "8px" }}
            >
              Seu nome *
            </label>
            <input
              id="cadastro-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Como você se chama?"
              className="w-full rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
              style={{ padding: "12px 16px" }}
            />
          </div>

          {/* E-mail */}
          <div>
            <label
              htmlFor="cadastro-email"
              className="block text-xs font-semibold text-text-primary font-sans"
              style={{ marginBottom: "8px" }}
            >
              E-mail *
            </label>
            <input
              id="cadastro-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
              style={{ padding: "12px 16px" }}
            />
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="cadastro-senha"
              className="block text-xs font-semibold text-text-primary font-sans"
              style={{ marginBottom: "8px" }}
            >
              Senha *
            </label>
            <input
              id="cadastro-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
              style={{ padding: "12px 16px" }}
            />
          </div>

          {/* Erro */}
          {erro && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg"
              style={{ padding: "12px 16px" }}
            >
              <p className="text-red-600 text-sm font-sans">{erro}</p>
            </div>
          )}

          {/* Submit */}
          <button
            id="btn-criar-conta"
            type="submit"
            disabled={carregando}
            className="bg-mauve text-text-primary rounded-full font-bold text-sm hover:bg-blushpop transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ padding: "16px 24px", marginTop: "8px", width: "100%", border: "none", cursor: carregando ? "not-allowed" : "pointer" }}
          >
            {carregando ? "Criando conta..." : "Criar minha conta →"}
          </button>
        </form>

        <p
          className="text-center text-xs text-lavendergrey font-sans"
          style={{ marginTop: "24px", paddingBottom: "4px" }}
        >
          Já tem conta?{" "}
          <Link href="/login" className="text-mauve hover:underline font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
