"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Save,
  User,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Pedido, COLUNAS, COLUNA_ORDER, Prioridade } from "./types";
import { KanbanAction } from "./kanban-reducer";
import { operadores } from "@/lib/mock-data";

interface CardDetailModalProps {
  pedido: Pedido | null;
  onClose: () => void;
  dispatch: React.Dispatch<KanbanAction>;
}

export default function CardDetailModal({
  pedido,
  onClose,
  dispatch,
}: CardDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Pedido>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!pedido) return null;

  const merged = { ...pedido, ...form };
  const currentIdx = COLUNA_ORDER.indexOf(pedido.status);
  const coluna = COLUNAS.find((c) => c.id === pedido.status);

  const handleSave = () => {
    dispatch({ type: "UPDATE_ORDER", pedido: { id: pedido.id, ...form } });
    setEditing(false);
    setForm({});
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({});
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_ORDER", id: pedido.id });
    onClose();
  };

  const handleMove = (dir: "next" | "prev") => {
    dispatch({
      type: dir === "next" ? "MOVE_CARD_NEXT" : "MOVE_CARD_PREV",
      id: pedido.id,
    });
    onClose();
  };

  return (
    <Modal
      open={!!pedido}
      onClose={onClose}
      title={pedido.ref}
      subtitle={`${pedido.modelo} · ${pedido.cliente}`}
      width={520}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Status bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            background: "var(--surface-container-lowest)",
            padding: "0.125rem",
          }}
        >
          {COLUNAS.map((col, idx) => {
            const isCurrent = col.id === pedido.status;
            const isPast = idx < currentIdx;
            return (
              <div
                key={col.id}
                style={{
                  flex: 1,
                  padding: "0.5rem 0.25rem",
                  textAlign: "center",
                  background: isCurrent
                    ? col.cor.startsWith("var")
                      ? "rgba(255,184,119,0.15)"
                      : `rgba(${col.cor === "#7ec8e0" ? "126,200,224" : "126,200,142"},0.15)`
                    : "transparent",
                  borderBottom: isCurrent
                    ? `2px solid ${col.cor}`
                    : `2px solid ${isPast ? "rgba(126,200,142,0.3)" : "transparent"}`,
                  transition: "all 150ms ease",
                }}
              >
                <span
                  style={{
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isCurrent
                      ? col.cor
                      : isPast
                      ? "#7ec88e"
                      : "var(--on-surface-variant)",
                    opacity: isCurrent ? 1 : isPast ? 0.7 : 0.3,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {col.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Fields grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <Field label="Modelo">
            {editing ? (
              <input
                className="input-field"
                value={form.modelo ?? pedido.modelo}
                onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                style={{ fontSize: "0.8125rem" }}
              />
            ) : (
              <ValueText>{pedido.modelo}</ValueText>
            )}
          </Field>

          <Field label="Arma">
            {editing ? (
              <input
                className="input-field"
                value={form.arma ?? pedido.arma}
                onChange={(e) => setForm({ ...form, arma: e.target.value })}
                style={{ fontSize: "0.8125rem" }}
              />
            ) : (
              <ValueText>{pedido.arma}</ValueText>
            )}
          </Field>

          <Field label="Cor / Material">
            {editing ? (
              <input
                className="input-field"
                value={form.cor ?? pedido.cor}
                onChange={(e) => setForm({ ...form, cor: e.target.value })}
                style={{ fontSize: "0.8125rem" }}
              />
            ) : (
              <ValueText>{pedido.cor}</ValueText>
            )}
          </Field>

          <Field label="Cliente">
            {editing ? (
              <input
                className="input-field"
                value={form.cliente ?? pedido.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                style={{ fontSize: "0.8125rem" }}
              />
            ) : (
              <ValueText>{pedido.cliente}</ValueText>
            )}
          </Field>

          <Field label="Prioridade">
            {editing ? (
              <select
                className="input-field"
                value={form.prioridade ?? pedido.prioridade}
                onChange={(e) =>
                  setForm({ ...form, prioridade: e.target.value as Prioridade })
                }
                style={{
                  fontSize: "0.8125rem",
                  background: "var(--surface-container-lowest)",
                  color: "var(--on-surface)",
                }}
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="normal">Normal</option>
              </select>
            ) : (
              <PrioridadeBadge value={pedido.prioridade} />
            )}
          </Field>

          <Field label="Operador">
            {editing ? (
              <select
                className="input-field"
                value={form.operador ?? pedido.operador ?? ""}
                onChange={(e) =>
                  setForm({ ...form, operador: e.target.value || undefined })
                }
                style={{
                  fontSize: "0.8125rem",
                  background: "var(--surface-container-lowest)",
                  color: "var(--on-surface)",
                }}
              >
                <option value="">Não atribuído</option>
                {operadores.map((op) => (
                  <option key={op.id} value={op.nome}>
                    {op.nome} ({op.nivel})
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <User size={12} color="var(--on-surface-variant)" />
                <ValueText>
                  {pedido.operador ?? (
                    <span style={{ opacity: 0.4 }}>Não atribuído</span>
                  )}
                </ValueText>
              </div>
            )}
          </Field>
        </div>

        {/* Observações */}
        <Field label="Observações">
          {editing ? (
            <textarea
              className="input-field"
              value={form.observacoes ?? pedido.observacoes ?? ""}
              onChange={(e) =>
                setForm({ ...form, observacoes: e.target.value })
              }
              rows={3}
              style={{ fontSize: "0.8125rem", resize: "vertical" }}
              placeholder="Instruções especiais, acabamentos, etc..."
            />
          ) : (
            <ValueText>
              {pedido.observacoes ? (
                pedido.observacoes
              ) : (
                <span style={{ opacity: 0.35 }}>Nenhuma observação</span>
              )}
            </ValueText>
          )}
        </Field>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(85,67,53,0.15)",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {/* Move buttons */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn-secondary"
              onClick={() => handleMove("prev")}
              disabled={currentIdx === 0}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.6875rem",
                opacity: currentIdx === 0 ? 0.35 : 1,
                cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                gap: "0.25rem",
              }}
            >
              <ChevronLeft size={13} />
              Recuar
            </button>
            <button
              className="btn-primary"
              onClick={() => handleMove("next")}
              disabled={currentIdx === COLUNA_ORDER.length - 1}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.6875rem",
                opacity: currentIdx === COLUNA_ORDER.length - 1 ? 0.5 : 1,
                cursor: currentIdx === COLUNA_ORDER.length - 1 ? "not-allowed" : "pointer",
                gap: "0.25rem",
              }}
            >
              Avançar
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Edit / Delete */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {editing ? (
              <>
                <button
                  className="btn-secondary"
                  onClick={handleCancel}
                  style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem" }}
                >
                  Cancelar
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSave}
                  style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem", gap: "0.25rem" }}
                >
                  <Save size={13} />
                  Salvar
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-secondary"
                  onClick={() => setEditing(true)}
                  style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem" }}
                >
                  Editar
                </button>
                {confirmDelete ? (
                  <button
                    onClick={handleDelete}
                    style={{
                      padding: "0.5rem 0.875rem",
                      fontSize: "0.6875rem",
                      background: "var(--tertiary-container)",
                      color: "var(--on-tertiary)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-headline)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Trash2 size={13} />
                    Confirmar
                  </button>
                ) : (
                  <button
                    className="btn-secondary"
                    onClick={() => setConfirmDelete(true)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      fontSize: "0.6875rem",
                      color: "var(--tertiary)",
                      borderColor: "rgba(255,136,129,0.3)",
                      gap: "0.25rem",
                    }}
                  >
                    <Trash2 size={13} />
                    Excluir
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="input-label" style={{ marginBottom: "0.375rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ValueText({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.8125rem",
        color: "var(--on-surface)",
        lineHeight: 1.5,
        padding: "0.25rem 0",
      }}
    >
      {children}
    </div>
  );
}

function PrioridadeBadge({ value }: { value: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    alta:   { bg: "rgba(255,136,129,0.15)", color: "var(--tertiary)", label: "Alta" },
    media:  { bg: "rgba(255,184,119,0.12)", color: "var(--primary)",  label: "Média" },
    normal: { bg: "rgba(85,67,53,0.2)",     color: "var(--on-surface-variant)", label: "Normal" },
  };
  const s = map[value] ?? map["normal"];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.25rem 0.625rem",
        background: s.bg,
        color: s.color,
        fontSize: "0.6875rem",
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
      }}
    >
      {s.label}
    </div>
  );
}
