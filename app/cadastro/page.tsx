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
        <div className="bg-white rounded-card shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-aquamarine rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-display font-black text-2xl text-text-primary mb-2">Conta criada!</h1>
          <p className="text-lavendergrey font-sans text-sm mb-6">
            Verifique seu e-mail <strong>{email}</strong> e clique no link de confirmação para ativar sua conta.
          </p>
          <Link href="/" className="text-sm text-mauve hover:underline font-semibold">← Voltar para a vitrine</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blushpop/30 via-base to-mauve/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-card shadow-xl p-8 max-w-md w-full">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-blushpop flex items-center justify-center mx-auto mb-3">
            <span className="font-display font-black text-text-primary">GKF</span>
          </div>
          <h1 className="font-display font-black text-2xl text-text-primary">Cadastre sua loja</h1>
          <p className="text-lavendergrey text-sm mt-1 font-sans">
            Apareça para milhares de geeks em Manaus. Grátis!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nome */}
          <div>
            <label htmlFor="cadastro-nome" className="block text-xs font-semibold text-text-primary mb-1.5 font-sans">
              Seu nome *
            </label>
            <input
              id="cadastro-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Como você se chama?"
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="cadastro-email" className="block text-xs font-semibold text-text-primary mb-1.5 font-sans">
              E-mail *
            </label>
            <input
              id="cadastro-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="cadastro-senha" className="block text-xs font-semibold text-text-primary mb-1.5 font-sans">
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
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          {/* Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-600 text-sm font-sans">{erro}</p>
            </div>
          )}

          {/* Submit */}
          <button
            id="btn-criar-conta"
            type="submit"
            disabled={carregando}
            className="bg-mauve text-text-primary py-3.5 rounded-full font-bold text-sm hover:bg-blushpop transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {carregando ? "Criando conta..." : "Criar minha conta →"}
          </button>
        </form>

        <p className="text-center text-xs text-lavendergrey mt-6 font-sans">
          Já tem conta?{" "}
          <Link href="/login" className="text-mauve hover:underline font-semibold">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
