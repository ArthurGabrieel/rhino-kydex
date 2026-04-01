"use client";

import { useState } from "react";
import { Pedido, Coluna, KanbanStatus } from "./types";
import { KanbanAction } from "./kanban-reducer";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  coluna: Coluna;
  pedidos: Pedido[];
  dispatch: React.Dispatch<KanbanAction>;
  onOpenDetail: (pedido: Pedido) => void;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export default function KanbanColumn({
  coluna,
  pedidos,
  dispatch,
  onOpenDetail,
  draggingId,
  onDragStart,
  onDragEnd,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (draggingId) {
      dispatch({ type: "MOVE_CARD", id: draggingId, to: coluna.id as KanbanStatus });
      onDragEnd(); // always clear dragging state after drop
    }
  };

  return (
    <div
      style={{
        width: 230,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--surface-container-lowest)",
        transition: "box-shadow 150ms ease",
        boxShadow: isDragOver
          ? `0 0 0 2px ${coluna.cor}, inset 0 0 20px rgba(0,0,0,0.1)`
          : "none",
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: "0.75rem 1rem",
          background: isDragOver
            ? "var(--surface-container)"
            : "var(--surface-container-low)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `2px solid ${isDragOver ? coluna.cor : "transparent"}`,
          transition: "all 150ms ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: 6,
              height: 6,
              background: coluna.cor,
              flexShrink: 0,
              transition: "transform 150ms ease",
              transform: isDragOver ? "scale(1.5)" : "scale(1)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: isDragOver ? "var(--on-surface)" : "var(--on-surface-variant)",
              transition: "color 150ms ease",
            }}
          >
            {coluna.label}
          </span>
        </div>

        <div
          style={{
            minWidth: 20,
            height: 20,
            padding: "0 5px",
            background: isDragOver ? coluna.cor : "var(--surface-container-highest)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.625rem",
            fontWeight: 700,
            color: isDragOver ? "#000" : "var(--on-surface-variant)",
            transition: "all 150ms ease",
          }}
        >
          {pedidos.length}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          flex: 1,
          minHeight: 180,
          transition: "background 150ms ease",
          background: isDragOver
            ? `rgba(${coluna.cor.startsWith("var") ? "85,67,53" : "126,200,142"},0.04)`
            : "transparent",
          paddingBottom: "0.5rem",
        }}
      >
        {pedidos.map((pedido) => (
          <KanbanCard
            key={pedido.id}
            pedido={pedido}
            dispatch={dispatch}
            onOpenDetail={onOpenDetail}
            isDragging={draggingId === pedido.id}
            onDragStart={() => onDragStart(pedido.id)}
            onDragEnd={onDragEnd}
          />
        ))}

        {/* Empty state */}
        {pedidos.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 120,
              gap: "0.5rem",
              opacity: isDragOver ? 0.6 : 0.25,
              transition: "opacity 150ms ease",
            }}
          >
            {isDragOver ? (
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: `2px dashed ${coluna.cor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: coluna.cor, fontSize: "1.25rem" }}>+</span>
              </div>
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--on-surface-variant)",
                }}
              >
                Sem pedidos
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
