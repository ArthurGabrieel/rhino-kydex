"use client";

import { useState } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Package,
  Plus,
  Filter,
} from "lucide-react";
import { estoque, logAtividades, ItemEstoque } from "@/lib/mock-data";

const categoriaLabel: Record<string, string> = {
  material: "Material",
  hardware: "Hardware",
  produto_final: "Produto Final",
};

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  ok: {
    label: "OK",
    icon: CheckCircle,
    color: "#7ec88e",
    bg: "rgba(126,200,142,0.1)",
  },
  alerta: {
    label: "Atenção",
    icon: TrendingDown,
    color: "var(--primary)",
    bg: "rgba(255,184,119,0.1)",
  },
  critico: {
    label: "Crítico",
    icon: AlertTriangle,
    color: "var(--tertiary)",
    bg: "rgba(255,136,129,0.12)",
  },
};

const logColors: Record<string, string> = {
  saida: "var(--on-surface-variant)",
  alerta: "var(--tertiary)",
  entrada: "#7ec88e",
  auth: "var(--secondary)",
  producao: "var(--primary)",
};

export default function EstoquePage() {
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "ok" | "alerta" | "critico">("todos");

  const itensFiltrados = estoque.filter((item) => {
    const matchSearch =
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.ref.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filtroStatus === "todos" || item.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const totalItens = estoque.length;
  const itensCriticos = estoque.filter((i) => i.status === "critico").length;
  const itensAlerta = estoque.filter((i) => i.status === "alerta").length;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.375rem",
              }}
            >
              <h1 className="headline-md">Estoque</h1>
              <span className="chip chip-active">
                OPERATIONAL STATUS: ACTIVE
              </span>
              <span className="label-sm" style={{ opacity: 0.5 }}>
                ITEMS_MONITORED: {totalItens}
              </span>
            </div>
            <p className="label-sm">
              Gerenciamento de Estoque · {itensCriticos} crítico
              {itensCriticos !== 1 ? "s" : ""} · {itensAlerta} em atenção
            </p>
          </div>
          <button className="btn-primary" style={{ gap: "0.375rem" }}>
            <Plus size={14} />
            Adicionar Item
          </button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

          {/* Main table */}
          <div>
            {/* Filters */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginBottom: "1rem",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative", flex: 1 }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--on-surface-variant)",
                    opacity: 0.4,
                  }}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Buscar por nome ou REF..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.375rem" }}>
                {(["todos", "ok", "alerta", "critico"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltroStatus(f)}
                    className={filtroStatus === f ? "btn-primary" : "btn-secondary"}
                    style={{ padding: "0.5rem 0.875rem", fontSize: "0.6875rem" }}
                  >
                    {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ background: "var(--surface-container-low)", overflow: "hidden" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>REF</th>
                    <th>Item</th>
                    <th>Categoria</th>
                    <th style={{ textAlign: "right" }}>Qtd</th>
                    <th style={{ textAlign: "right" }}>Mínimo</th>
                    <th>Local</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {itensFiltrados.map((item) => {
                    const st = statusConfig[item.status];
                    const Icon = st.icon;
                    const pct = Math.min(
                      100,
                      Math.round((item.quantidade / item.minimo) * 100)
                    );

                    return (
                      <tr key={item.id} style={{ cursor: "pointer" }}>
                        <td>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.75rem",
                              color: "var(--primary)",
                              opacity: 0.8,
                            }}
                          >
                            {item.ref}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{item.nome}</div>
                          {/* Mini progress */}
                          <div
                            style={{
                              height: 2,
                              background: "var(--surface-container-highest)",
                              marginTop: "0.375rem",
                              overflow: "hidden",
                              width: 120,
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${Math.min(pct, 100)}%`,
                                background:
                                  item.status === "critico"
                                    ? "var(--tertiary)"
                                    : item.status === "alerta"
                                    ? "var(--primary)"
                                    : "#7ec88e",
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <span className="chip" style={{ fontSize: "0.625rem" }}>
                            {categoriaLabel[item.categoria]}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-headline)",
                              fontSize: "1rem",
                              fontWeight: 700,
                              color:
                                item.status === "critico"
                                  ? "var(--tertiary)"
                                  : item.status === "alerta"
                                  ? "var(--primary)"
                                  : "var(--on-surface)",
                            }}
                          >
                            {item.quantidade}
                          </span>
                          <span
                            className="label-sm"
                            style={{ marginLeft: "0.25rem", fontSize: "0.625rem" }}
                          >
                            {item.unidade}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span style={{ color: "var(--on-surface-variant)", fontSize: "0.8125rem" }}>
                            {item.minimo} {item.unidade}
                          </span>
                        </td>
                        <td>
                          <span
                            className="chip"
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.625rem",
                            }}
                          >
                            {item.localizacao}
                          </span>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              padding: "0.25rem 0.5rem",
                              background: st.bg,
                              color: st.color,
                              fontSize: "0.6875rem",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                            }}
                          >
                            <Icon size={10} />
                            {st.label}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {itensFiltrados.length === 0 && (
                <div
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "var(--on-surface-variant)",
                    opacity: 0.4,
                  }}
                >
                  <Package size={32} style={{ margin: "0 auto 0.75rem" }} />
                  <p className="label-sm">Nenhum item encontrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <div className="card-low" style={{ background: "var(--surface-container-lowest)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h2 className="title-md" style={{ fontSize: "0.875rem" }}>
                  Log de Atividades
                </h2>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    background: "var(--primary)",
                    borderRadius: "50%",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              </div>

              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.6875rem",
                }}
              >
                {logAtividades.map((log) => (
                  <div
                    key={log.id}
                    className="log-entry"
                    style={{ flexDirection: "column", gap: "0.125rem" }}
                  >
                    <span className="log-time">[{log.hora}]</span>
                    <span
                      style={{
                        color: logColors[log.tipo],
                        opacity: 0.9,
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {log.mensagem}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
