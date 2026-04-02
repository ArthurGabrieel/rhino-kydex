"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Save,
  User,
  MessageSquare,
  Send,
  Settings2,
  Activity,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import {
  Pedido,
  COLUNAS,
  COLUNA_ORDER,
  Prioridade,
  LogKanban,
  isPedidoAtrasado,
} from "./types";
import { KanbanAction } from "./kanban-reducer";
import { operadores, operadorAtivo } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";

interface CardDetailModalProps {
  pedido: Pedido | null;
  onClose: () => void;
  dispatch: React.Dispatch<KanbanAction>;
  onDelete?: (msg: string) => void;
}

type Tab = "dados" | "atividade";

export default function CardDetailModal({
  pedido,
  onClose,
  dispatch,
  onDelete,
}: CardDetailModalProps) {
  const [tab, setTab] = useState<Tab>("dados");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Pedido>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Comments
  const [commentText, setCommentText] = useState("");
  const commentEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest comment
  useEffect(() => {
    if (tab === "atividade") {
      commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pedido?.logs?.length, tab]);

  if (!pedido) return null;

  const currentIdx = COLUNA_ORDER.indexOf(pedido.status);
  const logs = pedido.logs ?? [];
  const isAtrasado = isPedidoAtrasado(pedido);

  const handleSave = () => {
    dispatch({ type: "UPDATE_ORDER", pedido: { id: pedido.id, ...form } });
    setEditing(false);
    setForm({});
  };

  const handleCancel = () => { setEditing(false); setForm({}); };

  const handleDelete = () => {
    dispatch({ type: "DELETE_ORDER", id: pedido.id });
    onDelete?.(pedido.ref);
    onClose();
  };

  const handleMove = (dir: "next" | "prev") => {
    dispatch({ type: dir === "next" ? "MOVE_CARD_NEXT" : "MOVE_CARD_PREV", id: pedido.id });
    onClose();
  };

  const handleAddComment = () => {
    const texto = commentText.trim();
    if (!texto) return;

    const now = new Date();
    const hora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const comentario: LogKanban = {
      id: `C-${Date.now()}`,
      tipo: "comentario",
      autor: operadorAtivo.nome,
      avatar: operadorAtivo.avatar,
      texto,
      hora,
    };

    dispatch({ type: "ADD_COMMENT", id: pedido.id, comentario });
    setCommentText("");
    textareaRef.current?.focus();
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <Modal
      open={!!pedido}
      onClose={onClose}
      title={pedido.ref}
      subtitle={`${pedido.modelo} · ${pedido.cliente}`}
      width={560}
    >
      {/* Status pipeline */}
      <div style={{ display: "flex", marginBottom: "1.25rem", background: "var(--surface-container-lowest)", padding: "0.125rem" }}>
        {COLUNAS.map((col, idx) => {
          const isCurrent = col.id === pedido.status;
          const isPast = idx < currentIdx;
          const color = col.cor;
          return (
            <div
              key={col.id}
              style={{
                flex: 1,
                padding: "0.5rem 0.25rem",
                textAlign: "center",
                borderBottom: isCurrent ? `2px solid ${color}` : isPast ? "2px solid rgba(126,200,142,0.4)" : "2px solid transparent",
                transition: "all 150ms",
              }}
            >
              <span style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-body)", color: isCurrent ? color : isPast ? "#7ec88e" : "var(--on-surface-variant)", opacity: isCurrent ? 1 : isPast ? 0.7 : 0.3 }}>
                {col.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: "1.25rem", borderBottom: "1px solid rgba(85,67,53,0.15)" }}>
        {([
          { id: "dados", label: "Dados do Pedido", icon: Settings2 },
          { id: "atividade", label: `Atividade e Comentários${logs.length > 0 ? ` (${logs.length})` : ""}`, icon: Activity },
        ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.625rem 1rem",
              background: "none",
              border: "none",
              borderBottom: tab === id ? "2px solid var(--primary)" : "2px solid transparent",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: tab === id ? 600 : 400,
              color: tab === id ? "var(--on-surface)" : "var(--on-surface-variant)",
              fontFamily: "var(--font-body)",
              marginBottom: "-1px",
              transition: "all 150ms ease",
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: DADOS ── */}
      {tab === "dados" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {pedido.dataVencimento && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 0.75rem",
                background: isAtrasado ? "rgba(255,136,129,0.12)" : "rgba(255,184,119,0.08)",
                border: `1px solid ${isAtrasado ? "rgba(255,136,129,0.25)" : "rgba(255,184,119,0.2)"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: isAtrasado ? "var(--tertiary)" : "var(--primary)" }}>
                <AlertTriangle size={13} />
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {isAtrasado ? "Pedido Atrasado" : "Prazo em dia"}
                </span>
              </div>
              <span className="label-sm" style={{ fontSize: "0.625rem", opacity: 0.9 }}>
                Vencimento: {new Date(pedido.dataVencimento).toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Modelo">
              {editing ? (
                <input className="input-field" value={form.modelo ?? pedido.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} />
              ) : <Value>{pedido.modelo}</Value>}
            </Field>

            <Field label="Arma">
              {editing ? (
                <input className="input-field" value={form.arma ?? pedido.arma} onChange={(e) => setForm({ ...form, arma: e.target.value })} />
              ) : <Value>{pedido.arma}</Value>}
            </Field>

            <Field label="Cor / Material">
              {editing ? (
                <input className="input-field" value={form.cor ?? pedido.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} />
              ) : <Value>{pedido.cor}</Value>}
            </Field>

            <Field label="Cliente">
              {editing ? (
                <input className="input-field" value={form.cliente ?? pedido.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
              ) : <Value>{pedido.cliente}</Value>}
            </Field>

            <Field label="Prioridade">
              {editing ? (
                <select className="input-field" value={form.prioridade ?? pedido.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value as Prioridade })} style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="normal">Normal</option>
                </select>
              ) : <PrioridadeBadge value={pedido.prioridade} />}
            </Field>

            <Field label="Operador">
              {editing ? (
                <select className="input-field" value={form.operador ?? pedido.operador ?? ""} onChange={(e) => setForm({ ...form, operador: e.target.value || undefined })} style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}>
                  <option value="">Não atribuído</option>
                  {operadores.map((op) => (
                    <option key={op.id} value={op.nome}>{op.nome} ({op.nivel})</option>
                  ))}
                </select>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <User size={12} color="var(--on-surface-variant)" />
                  <Value>{pedido.operador ?? <span style={{ opacity: 0.35 }}>Não atribuído</span>}</Value>
                </div>
              )}
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Documento">
              <Value>{pedido.documento ?? "---"}</Value>
            </Field>

            <Field label="E-mail">
              <Value>{pedido.email ?? "---"}</Value>
            </Field>

            <Field label="Endereço" >
              <Value>{pedido.endereco ?? "---"}</Value>
            </Field>

            <Field label="Número">
              <Value>{pedido.numero ?? "---"}</Value>
            </Field>

            <Field label="Revisor">
              <Value>{pedido.revisor ?? "Não definido"}</Value>
            </Field>

            <Field label="Garantia">
              <Value>{pedido.tempoGarantia ?? "Não definida"}</Value>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 128px", gap: "1rem", alignItems: "start" }}>
            <Field label="Descrição do Produto">
              <Value>{pedido.descricaoProduto ?? "Sem descrição detalhada."}</Value>
            </Field>

            <div>
              <label className="input-label" style={{ marginBottom: "0.375rem" }}>
                Foto
              </label>
              <div
                style={{
                  width: 128,
                  height: 128,
                  background: "var(--surface-container-low)",
                  border: "1px solid rgba(85,67,53,0.2)",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={pedido.foto ?? "/assets/mock_holster.png"}
                  alt={`Produto ${pedido.ref}`}
                  width={128}
                  height={128}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          <Field label="Observações">
            {editing ? (
              <textarea className="input-field" value={form.observacoes ?? pedido.observacoes ?? ""} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={3} style={{ resize: "vertical" }} placeholder="Instruções especiais..." />
            ) : (
              <Value>{pedido.observacoes ? pedido.observacoes : <span style={{ opacity: 0.35 }}>Nenhuma observação</span>}</Value>
            )}
          </Field>
          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid rgba(85,67,53,0.15)", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button variant="secondary" onClick={() => handleMove("prev")} disabled={currentIdx === 0} style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem", opacity: currentIdx === 0 ? 0.35 : 1, cursor: currentIdx === 0 ? "not-allowed" : "pointer", gap: "0.25rem" }}>
                <ChevronLeft size={13} /> Recuar
              </Button>
              <Button variant="primary" onClick={() => handleMove("next")} disabled={currentIdx === COLUNA_ORDER.length - 1} style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem", opacity: currentIdx === COLUNA_ORDER.length - 1 ? 0.5 : 1, cursor: currentIdx === COLUNA_ORDER.length - 1 ? "not-allowed" : "pointer", gap: "0.25rem" }}>
                Avançar <ChevronRight size={13} />
              </Button>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {editing ? (
                <>
                  <Button variant="secondary" onClick={handleCancel} style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem" }}>Cancelar</Button>
                  <Button variant="primary" onClick={handleSave} style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem", gap: "0.25rem" }}><Save size={13} /> Salvar</Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => setEditing(true)} style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem" }}>Editar</Button>
                  {confirmDelete ? (
                    <button onClick={handleDelete} style={{ padding: "0.5rem 0.875rem", fontSize: "0.6875rem", background: "var(--tertiary-container)", color: "var(--on-tertiary)", border: "none", cursor: "pointer", fontFamily: "var(--font-headline)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Trash2 size={13} /> Confirmar
                    </button>
                  ) : (
                     <Button variant="secondary" onClick={() => setConfirmDelete(true)} style={{ padding: "0.5rem 0.75rem", fontSize: "0.6875rem", color: "var(--tertiary)", borderColor: "rgba(255,136,129,0.3)", gap: "0.25rem" }}>
                      <Trash2 size={13} /> Excluir
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: ATIVIDADE E COMENTÁRIOS ── */}
      {tab === "atividade" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Comment list */}
          <div style={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {logs.length === 0 ? (
              <div style={{ padding: "2.5rem 1rem", textAlign: "center" }}>
                <MessageSquare size={28} color="var(--on-surface-variant)" style={{ margin: "0 auto 0.75rem", opacity: 0.25 }} />
                <p className="label-sm" style={{ opacity: 0.35 }}>Nenhuma atividade registrada ainda.</p>
                <p className="label-sm" style={{ opacity: 0.2, marginTop: "0.25rem" }}>Use a área abaixo para adicionar o primeiro comentário.</p>
              </div>
            ) : (
              logs.map((c) => (
                <div key={c.id} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", animation: "fadeIn 0.2s ease" }}>
                  {/* Avatar */}
                  <div style={{ width: 28, height: 28, background: c.tipo === "sistema" ? "rgba(255,184,119,0.15)" : "var(--surface-container-highest)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-headline)", fontSize: "0.5625rem", fontWeight: 700, color: c.tipo === "sistema" ? "var(--primary)" : "var(--primary)", flexShrink: 0 }}>
                    {c.tipo === "sistema" ? "SYS" : c.avatar}
                  </div>
                  {/* Bubble */}
                  <div style={{ flex: 1, background: c.tipo === "sistema" ? "rgba(255,184,119,0.07)" : "var(--surface-container-low)", padding: "0.625rem 0.875rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--on-surface)" }}>{c.autor}</span>
                      <span className="label-sm" style={{ fontSize: "0.5625rem", opacity: 0.45 }}>{c.hora}</span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)", lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{c.texto}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={commentEndRef} />
          </div>

          {/* Comment input */}
          <div style={{ borderTop: "1px solid rgba(85,67,53,0.15)", paddingTop: "0.875rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
              {/* Current user avatar */}
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #ffb877, #f7921f)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-headline)", fontSize: "0.5625rem", fontWeight: 700, color: "#4b2700", flexShrink: 0 }}>
                {operadorAtivo.avatar}
              </div>

              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  ref={textareaRef}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  placeholder="Adicionar comentário... (Enter para enviar, Shift+Enter para nova linha)"
                  rows={2}
                  style={{
                    width: "100%",
                    resize: "none",
                    background: "var(--surface-container-lowest)",
                    border: "1px solid rgba(85,67,53,0.2)",
                    color: "var(--on-surface)",
                    padding: "0.625rem 2.75rem 0.625rem 0.75rem",
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-body)",
                    lineHeight: 1.5,
                    outline: "none",
                    transition: "border-color 150ms ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(247,146,31,0.4)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(85,67,53,0.2)"; }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  title="Enviar (Enter)"
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    bottom: "0.5rem",
                    background: commentText.trim() ? "var(--primary)" : "transparent",
                    border: "none",
                    cursor: commentText.trim() ? "pointer" : "not-allowed",
                    padding: "0.375rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: commentText.trim() ? "#000" : "var(--on-surface-variant)",
                    opacity: commentText.trim() ? 1 : 0.3,
                    transition: "all 150ms ease",
                  }}
                >
                  <Send size={13} />
                </button>
              </div>
            </div>

            <p className="label-sm" style={{ marginTop: "0.5rem", opacity: 0.3, fontSize: "0.625rem", marginLeft: "2.25rem" }}>
              Enter para enviar · Shift+Enter para quebra de linha
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="input-label" style={{ marginBottom: "0.375rem" }}>{label}</label>
      {children}
    </div>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.8125rem", color: "var(--on-surface)", lineHeight: 1.5, padding: "0.25rem 0" }}>
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
    <div style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.625rem", background: s.bg, color: s.color, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
      {s.label}
    </div>
  );
}
