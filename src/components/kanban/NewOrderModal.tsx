"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Pedido, KanbanStatus, Prioridade, COLUNAS } from "./types";
import { KanbanAction } from "./kanban-reducer";
import { operadores } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";

interface NewOrderModalProps {
  open: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<KanbanAction>;
  onSuccess?: (msg: string) => void;
}

const ARMAS_COMUNS = [
  "Glock G17 Gen5",
  "Glock G19",
  "Glock G43X",
  "Taurus PT92",
  "Taurus T9AF",
  "Sig Sauer P320",
  "Smith & Wesson M&P 9",
  "HK VP9",
  "Beretta 92FS",
  "CZ Shadow 2",
  "Walther PDP",
  "Outra",
];

const MODELOS = [
  "IWB Tático",
  "IWB Slim",
  "IWB Appendix",
  "OWB Duty",
  "OWB Tático",
  "OWB Competition",
];

const CORES = [
  "Preto Fosco",
  "Flat Dark Earth",
  "Coyote Brown",
  "Ranger Green",
  "Cinza OD",
];

const EMPTY_FORM = {
  cliente: "",
  modelo: MODELOS[0],
  arma: ARMAS_COMUNS[0],
  cor: CORES[0],
  prioridade: "normal" as Prioridade,
  status: "aberto" as KanbanStatus,
  operador: "",
  observacoes: "",
};

let mockOrderSequence = 2404;

function getNextMockOrderId() {
  const id = `P-${String(mockOrderSequence).padStart(4, "0")}`;
  mockOrderSequence += 1;
  return id;
}

export default function NewOrderModal({
  open,
  onClose,
  dispatch,
  onSuccess,
}: NewOrderModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.cliente.trim()) errs.cliente = "Cliente é obrigatório";
    if (!form.modelo) errs.modelo = "Modelo é obrigatório";
    if (!form.arma) errs.arma = "Arma é obrigatória";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const now = new Date();
    const hora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const id = getNextMockOrderId();

    const novoPedido: Pedido = {
      id,
      ref: `PED-${id.replace("P-", "")}`,
      cliente: form.cliente.trim(),
      modelo: form.modelo,
      arma: form.arma,
      cor: form.cor,
      prioridade: form.prioridade,
      status: form.status,
      hora,
      operador: form.operador || undefined,
      observacoes: form.observacoes.trim() || undefined,
    };

    dispatch({ type: "ADD_ORDER", pedido: novoPedido });
    onSuccess?.(novoPedido.ref);
    handleClose();
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Novo Pedido" subtitle="Preencha os dados para adicionar ao board" width={560}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* 2-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

          <FormField label="Cliente *" error={errors.cliente} colSpan={2}>
            <input
              className="input-field"
              placeholder="Ex: Sgto. Almeida"
              value={form.cliente}
              onChange={(e) => {
                setForm({ ...form, cliente: e.target.value });
                setErrors({ ...errors, cliente: "" });
              }}
            />
          </FormField>

          <FormField label="Modelo *" error={errors.modelo}>
            <select
              className="input-field"
              value={form.modelo}
              onChange={(e) => setForm({ ...form, modelo: e.target.value })}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
            >
              {MODELOS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </FormField>

          <FormField label="Prioridade">
            <select
              className="input-field"
              value={form.prioridade}
              onChange={(e) => setForm({ ...form, prioridade: e.target.value as Prioridade })}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
            >
              <option value="normal">Normal</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </FormField>

          <FormField label="Arma *" error={errors.arma} colSpan={2}>
            <select
              className="input-field"
              value={form.arma}
              onChange={(e) => setForm({ ...form, arma: e.target.value })}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
            >
              {ARMAS_COMUNS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </FormField>

          <FormField label="Cor / Material">
            <select
              className="input-field"
              value={form.cor}
              onChange={(e) => setForm({ ...form, cor: e.target.value })}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
            >
              {CORES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField label="Etapa inicial">
            <select
              className="input-field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as KanbanStatus })}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
            >
              {COLUNAS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </FormField>

          <FormField label="Operador responsável" colSpan={2}>
            <select
              className="input-field"
              value={form.operador}
              onChange={(e) => setForm({ ...form, operador: e.target.value })}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
            >
              <option value="">Não atribuído</option>
              {operadores.map((op) => (
                <option key={op.id} value={op.nome}>
                  {op.nome} ({op.nivel})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Observações" colSpan={2}>
            <textarea
              className="input-field"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              placeholder="Instruções especiais, acabamentos, urgências..."
              rows={3}
              style={{ resize: "vertical" }}
            />
          </FormField>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid rgba(85,67,53,0.15)",
          }}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            style={{ padding: "0.625rem 1.25rem" }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            style={{ padding: "0.625rem 1.5rem" }}
          >
            Criar Pedido
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Helper ───────────────────────────────────────────────────

function FormField({
  label,
  children,
  error,
  colSpan = 1,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  colSpan?: 1 | 2;
}) {
  return (
    <div style={{ gridColumn: `span ${colSpan}` }}>
      <label className="input-label" style={{ marginBottom: "0.375rem" }}>
        {label}
      </label>
      {children}
      {error && (
        <span
          style={{
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.6875rem",
            color: "var(--tertiary)",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
