"use client";

import { useReducer, useState, useMemo } from "react";
import { Search, AlertTriangle, CheckCircle, TrendingDown, Package, Plus, X } from "lucide-react";
import { estoque as initialEstoque, logAtividades as initialLog } from "@/lib/mock-data";
import { estoqueReducer } from "./estoque-reducer";
import { FiltroStatus, FiltroCategoria, CATEGORIA_LABEL } from "./types";
import EstoqueRow from "./EstoqueRow";
import ActivityLog from "./ActivityLog";
import AddItemModal from "./AddItemModal";
import ItemDetailModal from "./ItemDetailModal";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

const STATUS_CONFIG = {
  ok:      { label: "OK",      Icon: CheckCircle,  color: "#7ec88e"         },
  alerta:  { label: "Atenção", Icon: TrendingDown,  color: "var(--primary)" },
  critico: { label: "Crítico", Icon: AlertTriangle, color: "var(--tertiary)"},
} as const;

export default function EstoqueBoard({ isReadOnly = false }: { isReadOnly?: boolean }) {
  const [state, dispatch] = useReducer(estoqueReducer, {
    itens: initialEstoque,
    log:   initialLog,
  });

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Toast
  const { showToast } = useToast();

  // Live selected item (always fresh)
  const selectedItem = useMemo(
    () => state.itens.find((i) => i.id === selectedId) ?? null,
    [state.itens, selectedId]
  );

  // Filters
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<FiltroCategoria>("todas");

  const itensFiltrados = useMemo(() =>
    state.itens.filter((item) => {
      const matchSearch =
        item.nome.toLowerCase().includes(search.toLowerCase()) ||
        item.ref.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filtroStatus === "todos" || item.status === filtroStatus;
      const matchCategoria = filtroCategoria === "todas" || item.categoria === filtroCategoria;
      return matchSearch && matchStatus && matchCategoria;
    }),
    [state.itens, search, filtroStatus, filtroCategoria]
  );

  const totalCriticos = state.itens.filter((i) => i.status === "critico").length;
  const totalAlerta   = state.itens.filter((i) => i.status === "alerta").length;
  const hasFilters = filtroStatus !== "todos" || filtroCategoria !== "todas" || search !== "";

  const clearFilters = () => {
    setSearch("");
    setFiltroStatus("todos");
    setFiltroCategoria("todas");
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
              <h1 className="headline-md">Estoque</h1>
              <span className="chip chip-active">OPERATIONAL</span>
              {isReadOnly && (
                <span className="chip" style={{ background: "rgba(255,184,119,0.12)", color: "var(--primary)" }}>
                  SOMENTE LEITURA
                </span>
              )}
              {totalCriticos > 0 && (
                <span className="chip" style={{ background: "rgba(255,136,129,0.12)", color: "var(--tertiary)", border: "1px solid rgba(255,136,129,0.2)" }}>
                  {totalCriticos} CRÍTICO{totalCriticos !== 1 ? "S" : ""}
                </span>
              )}
              {hasFilters && (
                <span className="chip chip-warning" style={{ cursor: "pointer" }} onClick={clearFilters} title="Limpar filtros">
                  Filtros ativos <X size={9} style={{ marginLeft: 4 }} />
                </span>
              )}
            </div>
            <p className="label-sm">
              Gerenciamento de Estoque ·{" "}
              <strong style={{ color: "var(--on-surface)" }}>{state.itens.length}</strong> itens ·{" "}
              {isReadOnly && <span style={{ color: "var(--primary)", opacity: 0.95 }}>acesso sem edição · </span>}
              {totalCriticos > 0 && <span style={{ color: "var(--tertiary)" }}>{totalCriticos} crítico{totalCriticos !== 1 ? "s" : ""} · </span>}
              <span style={{ opacity: 0.5 }}>{totalAlerta} em atenção</span>
            </p>
          </div>

          {!isReadOnly && (
            <Button id="btn-add-item" variant="primary" onClick={() => setAddOpen(true)} style={{ gap: "0.375rem" }}>
              <Plus size={14} />
              Adicionar Item
            </Button>
          )}
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

          {/* Main panel */}
          <div>
            {/* Stats bar */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              {(["ok", "alerta", "critico"] as const).map((s) => {
                const cfg = STATUS_CONFIG[s];
                const count = state.itens.filter((i) => i.status === s).length;
                const { Icon } = cfg;
                return (
                  <button
                    key={s}
                    onClick={() => setFiltroStatus(filtroStatus === s ? "todos" : s)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.75rem 1rem",
                      background: filtroStatus === s ? `${cfg.color}18` : "var(--surface-container-low)",
                      border: "none",
                      outline: filtroStatus === s ? `1px solid ${cfg.color}40` : "1px solid transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Icon size={14} color={cfg.color} />
                    <div>
                      <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.125rem", fontWeight: 700, color: cfg.color, lineHeight: 1 }}>
                        {count}
                      </div>
                      <div style={{ fontSize: "0.5625rem", color: "var(--on-surface-variant)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {cfg.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Search + category filters */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                <Search size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--on-surface-variant)", opacity: 0.4 }} />
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
                <Button
                  variant={filtroCategoria === "todas" ? "primary" : "secondary"}
                  onClick={() => setFiltroCategoria("todas")}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", borderRadius: 0 }}
                >
                  Todas
                </Button>
                {(Object.entries(CATEGORIA_LABEL) as [keyof typeof CATEGORIA_LABEL, string][]).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={filtroCategoria === key ? "primary" : "secondary"}
                    onClick={() => setFiltroCategoria(filtroCategoria === key ? "todas" : key)}
                    style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", borderRadius: 0 }}
                  >
                    {label}
                  </Button>
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
                  {itensFiltrados.map((item) => (
                    <EstoqueRow
                      key={item.id}
                      item={item}
                      onClick={(i) => setSelectedId(i.id)}
                    />
                  ))}
                </tbody>
              </table>

              {itensFiltrados.length === 0 && (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--on-surface-variant)", opacity: 0.4 }}>
                  <Package size={32} style={{ margin: "0 auto 0.75rem" }} />
                  <p className="label-sm">Nenhum item encontrado</p>
                  {hasFilters && (
                    <button onClick={clearFilters} style={{ marginTop: "0.75rem", background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontSize: "0.6875rem", fontFamily: "var(--font-body)" }}>
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activity Log */}
          <ActivityLog entries={state.log} />
        </div>
      </div>

      {/* Modals */}
      {!isReadOnly && (
        <AddItemModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          dispatch={dispatch}
          onSuccess={(nome: string) => showToast(`Item "${nome}" cadastrado com sucesso.`, "success")}
        />
      )}

      <ItemDetailModal
        key={selectedItem?.id ?? "empty"}
        item={selectedItem}
        onClose={() => setSelectedId(null)}
        dispatch={dispatch}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
