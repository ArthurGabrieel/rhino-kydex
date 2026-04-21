"use client";

import { useState } from "react";
import {
  Clock,
  User,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Pedido, COLUNA_ORDER, isPedidoAtrasado } from "./types";
import { KanbanAction } from "./kanban-reducer";

interface KanbanCardProps {
  pedido: Pedido;
  dispatch: React.Dispatch<KanbanAction>;
  onOpenDetail: (pedido: Pedido) => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const PRIORIDADE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  alta:   { bg: "rgba(255,136,129,0.15)", color: "var(--tertiary)",           label: "ALTA"   },
  media:  { bg: "rgba(255,184,119,0.12)", color: "var(--primary)",            label: "MÉDIA"  },
  normal: { bg: "rgba(85,67,53,0.2)",     color: "var(--on-surface-variant)", label: "NORMAL" },
};

export default function KanbanCard({
  pedido,
  dispatch,
  onOpenDetail,
  isDragging,
  onDragStart,
  onDragEnd,
}: KanbanCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);

  const currentIdx = COLUNA_ORDER.indexOf(pedido.status);
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < COLUNA_ORDER.length - 1;
  const commentCount = (pedido.logs ?? []).filter((log) => log.tipo === "comentario").length;
  const isAtrasado = isPedidoAtrasado(pedido);

  const p = isAtrasado
    ? {
        bg: "rgba(255,136,129,0.2)",
        color: "var(--tertiary)",
        label: "ATRASADO",
      }
    : PRIORIDADE_STYLE[pedido.prioridade];

  const dragging = isDragging || isDraggingLocal;

  const handleDragStart = () => {
    setIsDraggingLocal(true);
    onDragStart();
  };

  const handleDragEnd = () => {
    setIsDraggingLocal(false);
    onDragEnd();
  };

  const handleCardClick = () => {
    if (!isDraggingLocal) onOpenDetail(pedido);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        margin: "0.375rem 0.5rem",
        padding: "0.875rem",
        paddingBottom: isHovered && !dragging ? "2.5rem" : "0.875rem",
        background: dragging
          ? "var(--surface-container-highest)"
          : isHovered
          ? "var(--surface-container-highest)"
          : "var(--surface-container-high)",
        cursor: dragging ? "grabbing" : "pointer",
        transition: "all 150ms ease",
        opacity: dragging ? 0.4 : 1,
        transform: dragging ? "rotate(2deg) scale(1.02)" : "none",
        outline: isHovered && !dragging ? "1px solid rgba(247,146,31,0.3)" : "1px solid transparent",
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* Top row: REF + priority */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.625rem", color: "var(--primary)", opacity: 0.8, letterSpacing: "0.04em" }}>
          {pedido.ref}
        </span>
        <span style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", padding: "0.125rem 0.375rem", background: p.bg, color: p.color }}>
          {p.label}
        </span>
      </div>

      {/* Model */}
      <div style={{ fontFamily: "var(--font-headline)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--on-surface)", marginBottom: "0.25rem", lineHeight: 1.2 }}>
        {pedido.modelo}
      </div>

      {/* Arma + cor */}
      <div style={{ fontSize: "0.6875rem", color: "var(--on-surface-variant)", marginBottom: "0.625rem", lineHeight: 1.4 }}>
        {pedido.arma}
        <br />
        <span style={{ opacity: 0.55 }}>{pedido.cor}</span>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid rgba(85,67,53,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {pedido.operador ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "var(--surface-container-highest)",
                padding: "0.125rem 0.375rem 0.125rem 0.125rem",
                borderRadius: "1rem",
                border: "1px solid rgba(85,67,53,0.15)",
              }}
              title={`Operador: ${pedido.operador}`}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  background: "var(--primary)",
                  color: "#000",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.45rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-headline)",
                }}
              >
                {pedido.operador.substring(0, 2).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: "0.5rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--on-surface)",
                }}
              >
                {pedido.operador.split(" ")[0]}
              </span>
            </div>
          ) : (
            <span className="label-sm" style={{ fontSize: "0.5rem", opacity: 0.35 }}>
              Não atribuído
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* Comment count badge */}
          {commentCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", opacity: 0.5 }}>
              <MessageSquare size={9} color="var(--on-surface-variant)" />
              <span className="label-sm" style={{ fontSize: "0.5rem" }}>{commentCount}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Clock size={10} color="var(--on-surface-variant)" />
            <span className="label-sm" style={{ fontSize: "0.5625rem" }}>{pedido.hora}</span>
          </div>
        </div>
      </div>

      {/* Cliente */}
      <div style={{ marginTop: "0.375rem", fontSize: "0.625rem", color: "var(--on-surface-variant)", opacity: 0.4, display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <Crosshair size={9} />
        {pedido.cliente}
      </div>

      {pedido.dataVencimento && (
        <div
          style={{
            marginTop: "0.2rem",
            fontSize: "0.5625rem",
            color: isAtrasado ? "var(--tertiary)" : "var(--on-surface-variant)",
            opacity: isAtrasado ? 0.95 : 0.55,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            letterSpacing: "0.03em",
          }}
        >
          <AlertTriangle size={9} />
          Vence em {new Date(pedido.dataVencimento).toLocaleDateString("pt-BR")}
        </div>
      )}

      {/* Hover action bar — prev / next only (click abriu modal) */}
      {isHovered && !dragging && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            background: "var(--surface-container-highest)",
            borderTop: "1px solid rgba(85,67,53,0.18)",
            animation: "fadeIn 0.1s ease",
          }}
        >
          {/* Recuar */}
          <button
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "MOVE_CARD_PREV", id: pedido.id }); }}
            disabled={!canPrev}
            title="Recuar etapa"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2rem",
              padding: "0.4rem 0.5rem",
              background: "none",
              border: "none",
              cursor: canPrev ? "pointer" : "not-allowed",
              color: canPrev ? "var(--on-surface-variant)" : "rgba(85,67,53,0.3)",
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              borderRight: "1px solid rgba(85,67,53,0.15)",
              transition: "all 120ms ease",
            }}
            onMouseEnter={(e) => { if (canPrev) { e.currentTarget.style.background = "rgba(85,67,53,0.1)"; e.currentTarget.style.color = "var(--on-surface)"; }}}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = canPrev ? "var(--on-surface-variant)" : "rgba(85,67,53,0.3)"; }}
          >
            <ChevronLeft size={11} />
            Recuar
          </button>

          {/* Avançar */}
          <button
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "MOVE_CARD_NEXT", id: pedido.id }); }}
            disabled={!canNext}
            title="Avançar etapa"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2rem",
              padding: "0.4rem 0.5rem",
              background: "none",
              border: "none",
              cursor: canNext ? "pointer" : "not-allowed",
              color: canNext ? "var(--primary)" : "rgba(85,67,53,0.3)",
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              transition: "all 120ms ease",
            }}
            onMouseEnter={(e) => { if (canNext) { e.currentTarget.style.background = "rgba(247,146,31,0.1)"; }}}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            Avançar
            <ChevronRight size={11} />
          </button>
        </div>
      )}
    </div>
  );
}
