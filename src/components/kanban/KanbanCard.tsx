"use client";

import { useState } from "react";
import {
  Clock,
  User,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
} from "lucide-react";
import { Pedido, COLUNA_ORDER } from "./types";
import { KanbanAction } from "./kanban-reducer";

interface KanbanCardProps {
  pedido: Pedido;
  dispatch: React.Dispatch<KanbanAction>;
  onOpenDetail: (pedido: Pedido) => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const PRIORIDADE_STYLE: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  alta:   { bg: "rgba(255,136,129,0.15)", color: "var(--tertiary)",  label: "ALTA" },
  media:  { bg: "rgba(255,184,119,0.12)", color: "var(--primary)",   label: "MÉDIA" },
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

  const currentIdx = COLUNA_ORDER.indexOf(pedido.status);
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < COLUNA_ORDER.length - 1;

  const p = PRIORIDADE_STYLE[pedido.prioridade];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        margin: "0.375rem 0.5rem",
        padding: "0.875rem",
        background: isDragging
          ? "var(--surface-container-highest)"
          : "var(--surface-container-high)",
        cursor: "grab",
        transition: "all 150ms ease",
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? "rotate(2deg)" : "none",
        boxShadow: isHovered && !isDragging
          ? "0 0 0 1px rgba(247,146,31,0.25), inset 0 0 0 0 transparent"
          : "none",
        position: "relative",
      }}
    >
      {/* Top row: REF + priority */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.625rem",
            color: "var(--primary)",
            opacity: 0.8,
            letterSpacing: "0.04em",
          }}
        >
          {pedido.ref}
        </span>
        <span
          style={{
            fontSize: "0.5625rem",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            padding: "0.125rem 0.375rem",
            background: p.bg,
            color: p.color,
          }}
        >
          {p.label}
        </span>
      </div>

      {/* Model */}
      <div
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--on-surface)",
          marginBottom: "0.25rem",
          lineHeight: 1.2,
        }}
      >
        {pedido.modelo}
      </div>

      {/* Arma + cor */}
      <div
        style={{
          fontSize: "0.6875rem",
          color: "var(--on-surface-variant)",
          marginBottom: "0.625rem",
          lineHeight: 1.4,
        }}
      >
        {pedido.arma}
        <br />
        <span style={{ opacity: 0.55 }}>{pedido.cor}</span>
      </div>

      {/* Footer: operador + hora */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "0.5rem",
          borderTop: "1px solid rgba(85,67,53,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {pedido.operador ? (
            <>
              <User size={10} color="var(--on-surface-variant)" />
              <span className="label-sm" style={{ fontSize: "0.5625rem" }}>
                {pedido.operador}
              </span>
            </>
          ) : (
            <span className="label-sm" style={{ fontSize: "0.5rem", opacity: 0.35 }}>
              Não atribuído
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <Clock size={10} color="var(--on-surface-variant)" />
          <span className="label-sm" style={{ fontSize: "0.5625rem" }}>
            {pedido.hora}
          </span>
        </div>
      </div>

      {/* Cliente */}
      <div
        style={{
          marginTop: "0.375rem",
          fontSize: "0.625rem",
          color: "var(--on-surface-variant)",
          opacity: 0.4,
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        <Crosshair size={9} />
        {pedido.cliente}
      </div>

      {/* Hover action bar */}
      {isHovered && !isDragging && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            background: "var(--surface-container-highest)",
            borderTop: "1px solid rgba(85,67,53,0.2)",
            animation: "fadeIn 0.12s ease",
          }}
        >
          {/* Recuar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "MOVE_CARD_PREV", id: pedido.id });
            }}
            disabled={!canPrev}
            title="Recuar"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.4rem",
              background: "none",
              border: "none",
              cursor: canPrev ? "pointer" : "not-allowed",
              color: canPrev ? "var(--on-surface-variant)" : "var(--surface-bright)",
              transition: "background 150ms",
              borderRight: "1px solid rgba(85,67,53,0.15)",
            }}
            onMouseEnter={(e) => {
              if (canPrev) e.currentTarget.style.background = "var(--surface-container-low)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            <ChevronLeft size={13} />
          </button>

          {/* Ver detalhes */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(pedido);
            }}
            title="Ver detalhes"
            style={{
              flex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              padding: "0.4rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--on-surface-variant)",
              fontSize: "0.5625rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              transition: "background 150ms",
              borderRight: "1px solid rgba(85,67,53,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface-container-low)";
              e.currentTarget.style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "var(--on-surface-variant)";
            }}
          >
            <Eye size={11} />
            Detalhes
          </button>

          {/* Avançar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "MOVE_CARD_NEXT", id: pedido.id });
            }}
            disabled={!canNext}
            title="Avançar"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.4rem",
              background: "none",
              border: "none",
              cursor: canNext ? "pointer" : "not-allowed",
              color: canNext ? "var(--primary)" : "var(--surface-bright)",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) => {
              if (canNext) e.currentTarget.style.background = "rgba(247,146,31,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
