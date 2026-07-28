import Link from "next/link";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  userEmail?: string;
  activeTab?: "dashboard" | "lojas" | "produtos" | "categorias-tags" | "eventos";
}

export default function AdminLayout({
  children,
  userEmail = "admin@geekfy.com",
  activeTab = "dashboard",
}: AdminLayoutProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/admin" },
    { id: "lojas", label: "1. Revisar Lojas", href: "/admin/lojas" },
    { id: "produtos", label: "2. Moderar Produtos", href: "/admin/produtos" },
    { id: "categorias-tags", label: "3. Categorias & Tags", href: "/admin/categorias-tags" },
    { id: "eventos", label: "4. Cadastrar Evento", href: "/admin/eventos" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F8FC", display: "flex", flexDirection: "column" }}>
      {/* Header Admin */}
      <header
        style={{
          backgroundColor: "#D3BCFF",
          borderBottom: "1px solid rgba(26,26,46,0.08)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="page-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "1.25rem",
                color: "#1A1A2E",
                textDecoration: "none",
              }}
            >
              Geekfy
            </Link>
            <span
              style={{
                padding: "0.2rem 0.6rem",
                backgroundColor: "rgba(26,26,46,0.1)",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#1A1A2E",
              }}
            >
              Painel Admin
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "rgba(26,26,46,0.7)" }}>
              {userEmail}
            </span>
            <Link
              href="/"
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#1A1A2E",
                textDecoration: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "var(--radius-card)",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Ver site público →
            </Link>
          </div>
        </div>

        {/* Sub-navegação */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.4)", borderTop: "1px solid rgba(26,26,46,0.05)" }}>
          <div
            className="page-container"
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    padding: "0.4rem 0.9rem",
                    borderRadius: "9999px",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#1A1A2E" : "rgba(26,26,46,0.7)",
                    backgroundColor: isActive ? "#FFFFFF" : "transparent",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="page-container" style={{ flex: 1, paddingTop: "2rem", paddingBottom: "3rem" }}>
        {children}
      </main>
    </div>
  );
}
