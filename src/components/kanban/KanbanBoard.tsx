"use client";

import { useReducer, useState, useMemo } from "react";
import { Plus, Filter, X } from "lucide-react";
import { pedidos as initialPedidos } from "@/lib/mock-data";
import { kanbanReducer } from "./kanban-reducer";
import {
  COLUNAS,
  Prioridade,
  PRIORIDADE_ORDER,
  isPedidoAtrasado,
} from "./types";
import KanbanColumn from "./KanbanColumn";
import CardDetailModal from "./CardDetailModal";
import NewOrderModal from "./NewOrderModal";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

type FilterPrioridade = Prioridade | "todas";
type FilterAtraso = "todos" | "atrasados" | "em_dia";

export default function KanbanBoard() {
  const [state, dispatch] = useReducer(kanbanReducer, {
    pedidos: initialPedidos,
  });

  // Drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Modal state — store only ID, derive live pedido from state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  // Toast
  const { showToast } = useToast();

  // Live selected pedido (always fresh from state — comments update instantly)
  const selectedPedido = useMemo(
    () => state.pedidos.find((p) => p.id === selectedId) ?? null,
    [state.pedidos, selectedId]
  );

  // Filter state
  const [filterPrioridade, setFilterPrioridade] = useState<FilterPrioridade>("todas");
  const [filterAtraso, setFilterAtraso] = useState<FilterAtraso>("todos");
  const [showFilters, setShowFilters] = useState(false);

  // Filtered pedidos
  const pedidosFiltrados = useMemo(() => {
    return state.pedidos.filter((p) => {
      const isAtrasado = isPedidoAtrasado(p);
      const prioridadeEfetiva = isPedidoAtrasado(p) ? "alta" : p.prioridade;
      const matchPrioridade =
        filterPrioridade === "todas" || prioridadeEfetiva === filterPrioridade;
      const matchAtraso =
        filterAtraso === "todos" ||
        (filterAtraso === "atrasados" ? isAtrasado : !isAtrasado);

      return matchPrioridade && matchAtraso;
    });
  }, [state.pedidos, filterPrioridade, filterAtraso]);

  const hasFilters =
    filterPrioridade !== "todas" ||
    filterAtraso !== "todos";

  const totalAtrasados = useMemo(
    () => pedidosFiltrados.filter((p) => isPedidoAtrasado(p)).length,
    [pedidosFiltrados]
  );

  const clearFilters = () => {
    setFilterPrioridade("todas");
    setFilterAtraso("todos");
  };

  return (
    <div>
      {/* Board header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              <h1 className="headline-md">Produção</h1>
              <span className="chip chip-active">Kanban Board</span>
              {totalAtrasados > 0 && (
                <span
                  className="chip"
                  style={{
                    background: "rgba(255,136,129,0.14)",
                    color: "var(--tertiary)",
                    border: "1px solid rgba(255,136,129,0.22)",
                  }}
                >
                  {totalAtrasados} ATRASADO{totalAtrasados !== 1 ? "S" : ""}
                </span>
              )}
              {hasFilters && (
                <span
                  className="chip chip-warning"
                  style={{ cursor: "pointer" }}
                  onClick={clearFilters}
                  title="Limpar filtros"
                >
                  Filtros ativos
                  <X size={9} style={{ marginLeft: 4 }} />
                </span>
              )}
            </div>
            <p className="label-sm">
              Fluxo de produção ·{" "}
              <strong style={{ color: "var(--on-surface)" }}>
                {pedidosFiltrados.length}
              </strong>{" "}
              {pedidosFiltrados.length !== state.pedidos.length && (
                <span style={{ opacity: 0.5 }}>
                  de {state.pedidos.length} pedidos
                </span>
              )}
              {pedidosFiltrados.length === state.pedidos.length && (
                <span style={{ opacity: 0.5 }}>pedidos</span>
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variant={showFilters ? "primary" : "secondary"}
                onClick={() => setShowFilters(!showFilters)}
                style={{ gap: "0.375rem" }}
              >
                <Filter size={14} /> Filtros
              </Button>
              <Button
                variant="primary"
                onClick={() => setNewOrderOpen(true)}
                style={{ gap: "0.375rem" }}
              >
                <Plus size={14} /> Novo Pedido
              </Button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        {showFilters && (
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "center",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(85,67,53,0.15)",
              animation: "fadeIn 0.15s ease",
              flexWrap: "wrap",
            }}
          >
            {/* Prioridade */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span className="label-sm">Prioridade:</span>
              {(["todas", "alta", "media", "normal"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPrioridade(p)}
                  style={{
                    padding: "0.25rem 0.625rem",
                    background:
                      filterPrioridade === p
                        ? p === "alta"
                          ? "rgba(255,136,129,0.2)"
                          : p === "media"
                          ? "rgba(255,184,119,0.15)"
                          : "var(--surface-container-high)"
                        : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-body)",
                    color:
                      filterPrioridade === p
                        ? p === "alta"
                          ? "var(--tertiary)"
                          : p === "media"
                          ? "var(--primary)"
                          : "var(--on-surface)"
                        : "var(--on-surface-variant)",
                    transition: "all 150ms ease",
                  }}
                >
                  {p === "todas" ? "Todas" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {/* Atraso */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span className="label-sm">Atraso:</span>
              {([
                { key: "todos", label: "Todos" },
                { key: "atrasados", label: "Atrasados" },
                { key: "em_dia", label: "Em dia" },
              ] as const).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilterAtraso(item.key)}
                  style={{
                    padding: "0.25rem 0.625rem",
                    background:
                      filterAtraso === item.key
                        ? item.key === "atrasados"
                          ? "rgba(255,136,129,0.2)"
                          : item.key === "em_dia"
                          ? "rgba(126,200,142,0.16)"
                          : "var(--surface-container-high)"
                        : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-body)",
                    color:
                      filterAtraso === item.key
                        ? item.key === "atrasados"
                          ? "var(--tertiary)"
                          : item.key === "em_dia"
                          ? "#7ec88e"
                          : "var(--on-surface)"
                        : "var(--on-surface-variant)",
                    transition: "all 150ms ease",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  color: "var(--tertiary)",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.05em",
                }}
              >
                <X size={11} />
                Limpar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Board */}
      <div
        className="page-body"
        style={{ overflowX: "auto", paddingBottom: "2rem" }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            minWidth: "max-content",
            alignItems: "flex-start",
          }}
        >
          {COLUNAS.map((coluna) => {
            const colPedidos = pedidosFiltrados
              .filter((p) => p.status === coluna.id)
              .sort((a, b) => {
                const aAtrasado = isPedidoAtrasado(a);
                const bAtrasado = isPedidoAtrasado(b);

                if (aAtrasado !== bAtrasado) {
                  return aAtrasado ? -1 : 1;
                }

                const aPrioridade = aAtrasado ? "alta" : a.prioridade;
                const bPrioridade = bAtrasado ? "alta" : b.prioridade;

                if (PRIORIDADE_ORDER[aPrioridade] !== PRIORIDADE_ORDER[bPrioridade]) {
                  return PRIORIDADE_ORDER[aPrioridade] - PRIORIDADE_ORDER[bPrioridade];
                }

                return a.ref.localeCompare(b.ref);
              });

            return (
              <KanbanColumn
                key={coluna.id}
                coluna={coluna}
                pedidos={colPedidos}
                dispatch={dispatch}
                onOpenDetail={(p) => setSelectedId(p.id)}
                draggingId={draggingId}
                onDragStart={(id) => setDraggingId(id)}
                onDragEnd={() => setDraggingId(null)}
              />
            );
          })}
        </div>

        {/* Summary footer */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Priority legend */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
          >
            <span className="label-sm" style={{ opacity: 0.5 }}>
              Prioridade:
            </span>
            {[
              { label: "Alta", bg: "rgba(255,136,129,0.15)", color: "var(--tertiary)" },
              { label: "Média", bg: "rgba(255,184,119,0.12)", color: "var(--primary)" },
              { label: "Normal", bg: "rgba(85,67,53,0.2)", color: "var(--on-surface-variant)" },
            ].map((item) => (
              <span
                key={item.label}
                style={{
                  padding: "0.125rem 0.5rem",
                  background: item.bg,
                  color: item.color,
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
            ))}
          </div>

          {/* Column summary */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
          >
            {COLUNAS.map((col) => {
              const count = state.pedidos.filter(
                (p) => p.status === col.id
              ).length;
              return (
                <div
                  key={col.id}
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
                >
                  <div
                    style={{ width: 6, height: 6, background: col.cor }}
                  />
                  <span className="label-sm" style={{ fontSize: "0.5625rem" }}>
                    {col.label}:{" "}
                    <strong style={{ color: "var(--on-surface)" }}>{count}</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CardDetailModal
        key={selectedPedido?.id ?? "empty"}
        pedido={selectedPedido}
        onClose={() => setSelectedId(null)}
        dispatch={dispatch}
        onDelete={(ref: string) => showToast(`Pedido ${ref} excluído.`, "info")}
      />

      <NewOrderModal
        open={newOrderOpen}
        onClose={() => setNewOrderOpen(false)}
        dispatch={dispatch}
        onSuccess={(ref: string) => showToast(`Novo pedido ${ref} adicionado ao kanban!`, "success")}
      />
    </div>
  );
}
