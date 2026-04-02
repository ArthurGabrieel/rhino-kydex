"use client";

import { useState } from "react";
import {
  Edit2, Trash2, Save, Plus, Minus,
  AlertTriangle, CheckCircle, TrendingDown,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  ItemEstoque,
  CategoriaEstoque,
  CATEGORIA_LABEL,
  UNIDADES_COMUNS,
  LOCALIZACOES_COMUNS,
} from "./types";
import { EstoqueAction } from "./estoque-reducer";
import { useMediaQuery } from "@/lib/use-media-query";

interface ItemDetailModalProps {
  item: ItemEstoque | null;
  onClose: () => void;
  dispatch: React.Dispatch<EstoqueAction>;
  isReadOnly?: boolean;
}

const STATUS_CONFIG = {
  ok:      { label: "OK",      Icon: CheckCircle,  color: "#7ec88e",          bg: "rgba(126,200,142,0.1)"  },
  alerta:  { label: "Atenção", Icon: TrendingDown,  color: "var(--primary)",  bg: "rgba(255,184,119,0.1)"  },
  critico: { label: "Crítico", Icon: AlertTriangle, color: "var(--tertiary)", bg: "rgba(255,136,129,0.12)" },
} as const;

type Tab = "info" | "ajuste";
type PreviewTarget = "saida" | "entrada" | null;

export default function ItemDetailModal({ item, onClose, dispatch, isReadOnly }: ItemDetailModalProps) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [tab, setTab] = useState<Tab>("info");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<ItemEstoque>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<PreviewTarget>(null);
  const { showToast } = useToast();

  // Ajuste de quantidade
  const [delta, setDelta] = useState(0);
  const [motivo, setMotivo] = useState("");

  if (!item) return null;

  const st = STATUS_CONFIG[item.status];
  const { Icon } = st;

  const handleSave = () => {
    dispatch({ type: "UPDATE_ITEM", item: { id: item.id, ...form } });
    setEditing(false);
    setForm({});
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_ITEM", id: item.id });
    onClose();
  };

  const handleAdjust = (sign: 1 | -1) => {
    if (delta <= 0) return;
    const ajuste = sign * delta;
    const novaQuantidade = Math.max(0, item.quantidade + ajuste);

    dispatch({ type: "ADJUST_QTY", id: item.id, delta: ajuste, motivo });
    showToast(
      `Estoque atualizado: ${item.ref} agora com ${novaQuantidade} ${item.unidade}.`,
      "success"
    );

    setDelta(0);
    setMotivo("");
    onClose();
  };

  const qtdSaidaPreview = Math.max(0, item.quantidade - delta);
  const qtdEntradaPreview = item.quantidade + delta;
  const saidaInvalida = delta > item.quantidade;

  const getQtdPreviewColor = (qtd: number) =>
    qtd < item.minimo ? "var(--tertiary)" : "#7ec88e";

  return (
    <Modal
      open={!!item}
      onClose={onClose}
      title={item.ref}
      subtitle={item.nome}
      width={500}
    >
      {/* Status banner */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", padding: "0.75rem 1rem", background: st.bg, flexWrap: isMobile ? "wrap" : undefined }}>
        <Icon size={16} color={st.color} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: st.color }}>
            {st.label}
          </div>
          <div style={{ fontSize: "0.625rem", color: "var(--on-surface-variant)", marginTop: "0.125rem" }}>
            {item.quantidade} / {item.minimo} {item.unidade} · Local: <span style={{ fontFamily: "monospace" }}>{item.localizacao}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.75rem", fontWeight: 700, lineHeight: 1, color: st.color }}>
            {item.quantidade}
          </div>
          <div style={{ fontSize: "0.5625rem", color: "var(--on-surface-variant)", opacity: 0.6 }}>{item.unidade}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(85,67,53,0.15)", marginBottom: "1.25rem" }}>
        {([
          { id: "info", label: "Dados" },
          ...(isReadOnly ? [] : [{ id: "ajuste", label: "Ajustar Quantidade" } as { id: Tab; label: string }]),
        ]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            style={{
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
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: INFO / EDIÇÃO ── */}
      {tab === "info" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
            <Field label="Categoria">
              {editing ? (
                <select
                  className="input-field"
                  value={form.categoria ?? item.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaEstoque })}
                  style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
                >
                  {Object.entries(CATEGORIA_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              ) : <Value>{CATEGORIA_LABEL[item.categoria]}</Value>}
            </Field>

            <Field label="Localização">
              {editing ? (
                <select
                  className="input-field"
                  value={form.localizacao ?? item.localizacao}
                  onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
                  style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)", fontFamily: "monospace" }}
                >
                  {LOCALIZACOES_COMUNS.map((l) => <option key={l}>{l}</option>)}
                </select>
              ) : <Value mono>{item.localizacao}</Value>}
            </Field>

            <Field label="Quantidade mínima">
              {editing ? (
                <input
                  className="input-field"
                  type="number"
                  min={1}
                  value={form.minimo ?? item.minimo}
                  onChange={(e) => setForm({ ...form, minimo: Number(e.target.value) })}
                />
              ) : <Value>{item.minimo} {item.unidade}</Value>}
            </Field>

            <Field label="Unidade">
              {editing ? (
                <select
                  className="input-field"
                  value={form.unidade ?? item.unidade}
                  onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                  style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
                >
                  {UNIDADES_COMUNS.map((u) => <option key={u}>{u}</option>)}
                </select>
              ) : <Value>{item.unidade}</Value>}
            </Field>
          </div>

          <Field label="Nome completo">
            {editing ? (
              <input
                className="input-field"
                value={form.nome ?? item.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            ) : <Value>{item.nome}</Value>}
          </Field>

          {/* Actions */}
          {!isReadOnly && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid rgba(85,67,53,0.15)", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {editing ? (
                  <>
                    <Button variant="secondary" onClick={() => { setEditing(false); setForm({}); }} style={{ padding: "0.5rem 0.875rem", fontSize: "0.6875rem" }}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSave} style={{ padding: "0.5rem 0.875rem", fontSize: "0.6875rem", gap: "0.25rem" }}><Save size={13} /> Salvar</Button>
                  </>
                ) : (
                  <Button variant="secondary" onClick={() => setEditing(true)} style={{ padding: "0.5rem 0.875rem", fontSize: "0.6875rem", gap: "0.25rem" }}><Edit2 size={12} /> Editar</Button>
                )}
              </div>

              {!editing && (
                confirmDelete ? (
                  <button
                    onClick={handleDelete}
                    style={{ padding: "0.5rem 0.875rem", fontSize: "0.6875rem", background: "var(--tertiary-container)", color: "var(--on-tertiary)", border: "none", cursor: "pointer", fontFamily: "var(--font-headline)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.25rem" }}
                  >
                    <Trash2 size={13} /> Confirmar remoção
                  </button>
                ) : (
                  <Button variant="secondary" onClick={() => setConfirmDelete(true)} style={{ padding: "0.5rem 0.875rem", fontSize: "0.6875rem", color: "var(--tertiary)", borderColor: "rgba(255,136,129,0.3)", gap: "0.25rem" }}>
                    <Trash2 size={13} /> Remover
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: AJUSTAR QUANTIDADE ── */}
      {tab === "ajuste" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Delta control */}
          <div>
            <label className="input-label">Quantidade a movimentar</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem", flexWrap: isMobile ? "wrap" : undefined }}>
              <Button
                variant="secondary"
                onClick={() => setDelta((d) => Math.max(0, d - 1))}
                style={{ padding: "0.5rem", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Minus size={13} />
              </Button>

              <input
                className="input-field"
                type="number"
                min={0}
                value={delta}
                onChange={(e) => setDelta(Math.max(0, Number(e.target.value)))}
                style={{ textAlign: "center", fontSize: "1.25rem", fontFamily: "var(--font-headline)", fontWeight: 700, maxWidth: isMobile ? "100%" : 100 }}
              />

              <Button
                variant="secondary"
                onClick={() => setDelta((d) => d + 1)}
                style={{ padding: "0.5rem", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Plus size={13} />
              </Button>

              <span className="label-sm" style={{ fontSize: "0.75rem" }}>{item.unidade}</span>
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="input-label">Motivo (opcional)</label>
            <input
              className="input-field"
              placeholder="ex: Pedido fornecedor, saída para produção..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          {/* Preview */}
          <div style={{ background: "var(--surface-container-low)", padding: "1rem" }}>
            <div style={{ fontSize: "0.625rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginBottom: "0.75rem" }}>
              Preview da operação
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "0.875rem" }}>
              <div style={{ background: "var(--surface-container-lowest)", padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: "var(--on-surface-variant)", opacity: 0.7 }}>
                  {item.quantidade}
                </div>
                <div style={{ fontSize: "0.5625rem", opacity: 0.45 }}>Atual</div>
              </div>

              <div
                style={{
                  background: previewTarget === "saida" ? "rgba(255,136,129,0.12)" : "var(--surface-container-lowest)",
                  border: previewTarget === "saida" ? "1px solid rgba(255,136,129,0.35)" : "1px solid transparent",
                  padding: "0.75rem",
                  textAlign: "center",
                  transition: "all 150ms ease",
                }}
              >
                <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: getQtdPreviewColor(qtdSaidaPreview), opacity: saidaInvalida ? 0.45 : 1 }}>
                  {qtdSaidaPreview}
                </div>
                <div style={{ fontSize: "0.5625rem", opacity: 0.45 }}>Após saída</div>
              </div>

              <div
                style={{
                  background: previewTarget === "entrada" ? "rgba(255,184,119,0.12)" : "var(--surface-container-lowest)",
                  border: previewTarget === "entrada" ? "1px solid rgba(255,184,119,0.35)" : "1px solid transparent",
                  padding: "0.75rem",
                  textAlign: "center",
                  transition: "all 150ms ease",
                }}
              >
                <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: getQtdPreviewColor(qtdEntradaPreview) }}>
                  {qtdEntradaPreview}
                </div>
                <div style={{ fontSize: "0.5625rem", opacity: 0.45 }}>Após entrada</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.625rem" }}>
              <div style={{ fontSize: "0.625rem", color: saidaInvalida ? "var(--tertiary)" : "var(--on-surface-variant)", opacity: 0.8 }}>
                {saidaInvalida ? "Saída maior que o estoque atual." : ""}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--on-surface-variant)" }}>Mín: {item.minimo} {item.unidade}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
            <Button
              variant="secondary"
              disabled={delta <= 0 || item.quantidade - delta < 0}
              onClick={() => handleAdjust(-1)}
              onMouseEnter={() => setPreviewTarget("saida")}
              onMouseLeave={() => setPreviewTarget(null)}
              onFocus={() => setPreviewTarget("saida")}
              onBlur={() => setPreviewTarget(null)}
              style={{ padding: "0.625rem", fontSize: "0.6875rem", gap: "0.375rem", justifyContent: "center", display: "flex", alignItems: "center", opacity: delta <= 0 ? 0.4 : 1, cursor: delta <= 0 ? "not-allowed" : "pointer", color: "var(--tertiary)" }}
            >
              <Minus size={13} />
              Saída / Consumo
            </Button>

            <Button
              variant="primary"
              disabled={delta <= 0}
              onClick={() => handleAdjust(1)}
              onMouseEnter={() => setPreviewTarget("entrada")}
              onMouseLeave={() => setPreviewTarget(null)}
              onFocus={() => setPreviewTarget("entrada")}
              onBlur={() => setPreviewTarget(null)}
              style={{ padding: "0.625rem", fontSize: "0.6875rem", gap: "0.375rem", justifyContent: "center", display: "flex", alignItems: "center", opacity: delta <= 0 ? 0.5 : 1, cursor: delta <= 0 ? "not-allowed" : "pointer" }}
            >
              <Plus size={13} />
              Entrada / Reposição
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="input-label" style={{ marginBottom: "0.375rem" }}>{label}</label>
      {children}
    </div>
  );
}

function Value({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ fontSize: "0.8125rem", color: "var(--on-surface)", lineHeight: 1.5, padding: "0.25rem 0", fontFamily: mono ? "monospace" : undefined }}>
      {children}
    </div>
  );
}
