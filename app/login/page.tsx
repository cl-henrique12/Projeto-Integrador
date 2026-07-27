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
      {/* Card principal — mais padding interno */}
      <div
        className="bg-white rounded-card shadow-xl max-w-md w-full"
        style={{ padding: '48px 40px 36px 40px' }}
      >
        {/* Cabeçalho — mais espaço abaixo da logo e do título */}
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <div
            className="rounded-full bg-blushpop flex items-center justify-center mx-auto"
            style={{ width: '56px', height: '56px', marginBottom: '16px' }}
          >
            <span className="font-display font-black text-text-primary">GKF</span>
          </div>
          <h1 className="font-display font-black text-2xl text-text-primary">Entrar no Geekfy</h1>
          <p className="text-lavendergrey text-sm font-sans" style={{ marginTop: '8px' }}>
            Acesse o painel da sua loja
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '20px' }}>
          {/* Campo E-mail */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-text-primary font-sans"
              style={{ marginBottom: '8px' }}
            >
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
              style={{ padding: '12px 16px' }}
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label
              htmlFor="login-senha"
              className="block text-xs font-semibold text-text-primary font-sans"
              style={{ marginBottom: '8px' }}
            >
              Senha
            </label>
            <input
              id="login-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Sua senha"
              className="w-full rounded-card border border-lavendergrey/30 text-text-primary text-sm font-sans focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
              style={{ padding: '12px 16px' }}
            />
          </div>

          {erro && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg"
              style={{ padding: '12px 16px' }}
            >
              <p className="text-red-600 text-sm font-sans">{erro}</p>
            </div>
          )}

          {/* Botão — espaço acima + altura generosa */}
          <button
            id="btn-login"
            type="submit"
            disabled={carregando}
            className="bg-mauve text-text-primary rounded-full font-bold text-sm hover:bg-blushpop transition-colors shadow-md disabled:opacity-60"
            style={{ padding: '16px 24px', marginTop: '8px', width: '100%', border: 'none', cursor: carregando ? 'not-allowed' : 'pointer' }}
          >
            {carregando ? "Entrando..." : "Entrar →"}
          </button>
        </form>

        {/* Rodapé — espaço acima */}
        <p
          className="text-center text-xs text-lavendergrey font-sans"
          style={{ marginTop: '24px', paddingBottom: '4px' }}
        >
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="text-mauve hover:underline font-semibold">
            Cadastrar minha loja
          </Link>
        </p>
      </div>
    </main>
  );
}
