"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos. Verifique seus dados.");
      return;
    }

    // Redirecionar conforme role
    const role = data.user.user_metadata?.role;
    window.location.href = role === "ADMIN" ? "/admin" : "/painel";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-aquamarine/20 via-base to-blushpop/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-card shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-blushpop flex items-center justify-center mx-auto mb-3">
            <span className="font-display font-black text-text-primary">GKF</span>
          </div>
          <h1 className="font-display font-black text-2xl text-text-primary">Entrar no Geekfy</h1>
          <p className="text-lavendergrey text-sm mt-1 font-sans">Acesse o painel da sua loja</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-text-primary mb-1.5 font-sans">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="login-senha" className="block text-xs font-semibold text-text-primary mb-1.5 font-sans">Senha</label>
            <input
              id="login-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Sua senha"
              className="w-full px-4 py-3 rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-600 text-sm font-sans">{erro}</p>
            </div>
          )}

          <button
            id="btn-login"
            type="submit"
            disabled={carregando}
            className="bg-mauve text-text-primary py-3.5 rounded-full font-bold text-sm hover:bg-blushpop transition-colors shadow-md disabled:opacity-60 mt-2"
          >
            {carregando ? "Entrando..." : "Entrar →"}
          </button>
        </form>

        <p className="text-center text-xs text-lavendergrey mt-6 font-sans">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="text-mauve hover:underline font-semibold">Cadastrar minha loja</Link>
        </p>
      </div>
    </main>
  );
}
