"use client";

interface AdminStoreActionsProps {
  storeId: string;
}

export default function AdminStoreActions({ storeId }: AdminStoreActionsProps) {
  return (
    <div
      className="flex flex-row sm:flex-col flex-shrink-0"
      style={{ gap: "8px" }}
    >
      <button
        id={`btn-aprovar-${storeId}`}
        type="button"
        className="w-full bg-aquamarine text-text-primary rounded-full font-bold text-sm hover:bg-aquamarine/70 transition-colors shadow-sm"
        style={{ padding: "10px 20px", border: "none", cursor: "pointer" }}
        onClick={async () => {
          await fetch(`/api/admin/lojas/${storeId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "APPROVED" }),
          });
          window.location.reload();
        }}
      >
        ✅ Aprovar
      </button>
      <button
        id={`btn-rejeitar-${storeId}`}
        type="button"
        className="border border-red-200 text-red-600 rounded-full font-bold text-sm hover:bg-red-50 transition-colors"
        style={{ padding: "10px 20px", cursor: "pointer" }}
        onClick={async () => {
          const motivo = window.prompt("Motivo da rejeição (opcional):");
          await fetch(`/api/admin/lojas/${storeId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "REJECTED", reason: motivo }),
          });
          window.location.reload();
        }}
      >
        ❌ Rejeitar
      </button>
    </div>
  );
}
