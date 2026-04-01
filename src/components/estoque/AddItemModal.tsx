"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  ItemEstoque,
  CategoriaEstoque,
  CATEGORIA_LABEL,
  UNIDADES_COMUNS,
  LOCALIZACOES_COMUNS,
  calcularStatus,
} from "./types";
import { EstoqueAction } from "./estoque-reducer";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<EstoqueAction>;
  onSuccess?: (nome: string) => void;
}

const DEFAULT_FORM = {
  ref: "",
  nome: "",
  categoria: "material" as CategoriaEstoque,
  quantidade: 0,
  unidade: "UN",
  minimo: 10,
  localizacao: "A-01",
};

type FormState = typeof DEFAULT_FORM;

export default function AddItemModal({ open, onClose, dispatch, onSuccess }: AddItemModalProps) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.ref.trim())  e.ref  = "REF é obrigatório";
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (form.quantidade < 0) e.quantidade = "Quantidade não pode ser negativa";
    if (form.minimo <= 0)    e.minimo = "Mínimo deve ser maior que 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const item: ItemEstoque = {
      id: `EST-${Date.now()}`,
      ref: form.ref.toUpperCase().trim(),
      nome: form.nome.trim(),
      categoria: form.categoria,
      quantidade: Number(form.quantidade),
      unidade: form.unidade,
      minimo: Number(form.minimo),
      localizacao: form.localizacao,
      status: calcularStatus(Number(form.quantidade), Number(form.minimo)),
    };

    dispatch({ type: "ADD_ITEM", item });
    setForm(DEFAULT_FORM);
    setErrors({});
    onSuccess?.(item.nome);
    onClose();
  };

  const previewStatus = calcularStatus(Number(form.quantidade), Number(form.minimo));

  const STATUS_COLOR = {
    ok:      "#7ec88e",
    alerta:  "var(--primary)",
    critico: "var(--tertiary)",
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Item" subtitle="Cadastrar item no estoque" width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Row 1: REF + Categoria */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label className="input-label">REF *</label>
            <input
              className="input-field"
              placeholder="ex: KY-BLK-03"
              value={form.ref}
              onChange={(e) => set("ref", e.target.value.toUpperCase())}
              style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "monospace", ...(errors.ref ? { borderColor: "rgba(255,136,129,0.5)" } : {}) }}
            />
            {errors.ref && <p style={{ fontSize: "0.625rem", color: "var(--tertiary)", marginTop: "0.25rem" }}>{errors.ref}</p>}
          </div>

          <div>
            <label className="input-label">Categoria *</label>
            <select
              className="input-field"
              value={form.categoria}
              onChange={(e) => set("categoria", e.target.value as CategoriaEstoque)}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
            >
              {Object.entries(CATEGORIA_LABEL).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Nome */}
        <div>
          <label className="input-label">Nome *</label>
          <input
            className="input-field"
            placeholder="ex: Kydex Sheet - Tactical Black 2mm"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            style={errors.nome ? { borderColor: "rgba(255,136,129,0.5)" } : {}}
          />
          {errors.nome && <p style={{ fontSize: "0.625rem", color: "var(--tertiary)", marginTop: "0.25rem" }}>{errors.nome}</p>}
        </div>

        {/* Row 3: Qtd + Unidade + Mínimo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label className="input-label">Quantidade inicial</label>
            <input
              className="input-field"
              type="number"
              min={0}
              value={form.quantidade}
              onChange={(e) => set("quantidade", Number(e.target.value))}
              style={errors.quantidade ? { borderColor: "rgba(255,136,129,0.5)" } : {}}
            />
            {errors.quantidade && <p style={{ fontSize: "0.625rem", color: "var(--tertiary)", marginTop: "0.25rem" }}>{errors.quantidade}</p>}
          </div>

          <div>
            <label className="input-label">Unidade</label>
            <select
              className="input-field"
              value={form.unidade}
              onChange={(e) => set("unidade", e.target.value)}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)" }}
            >
              {UNIDADES_COMUNS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>

          <div>
            <label className="input-label">Mínimo *</label>
            <input
              className="input-field"
              type="number"
              min={1}
              value={form.minimo}
              onChange={(e) => set("minimo", Number(e.target.value))}
              style={errors.minimo ? { borderColor: "rgba(255,136,129,0.5)" } : {}}
            />
            {errors.minimo && <p style={{ fontSize: "0.625rem", color: "var(--tertiary)", marginTop: "0.25rem" }}>{errors.minimo}</p>}
          </div>
        </div>

        {/* Row 4: Localização */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label className="input-label">Localização</label>
            <select
              className="input-field"
              value={form.localizacao}
              onChange={(e) => set("localizacao", e.target.value)}
              style={{ background: "var(--surface-container-lowest)", color: "var(--on-surface)", fontFamily: "monospace" }}
            >
              {LOCALIZACOES_COMUNS.map((loc) => <option key={loc}>{loc}</option>)}
            </select>
          </div>

          {/* Status preview */}
          <div>
            <label className="input-label">Status estimado</label>
            <div style={{ paddingTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 8, height: 8, background: STATUS_COLOR[previewStatus], borderRadius: "50%" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: STATUS_COLOR[previewStatus], textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {previewStatus === "ok" ? "OK" : previewStatus === "alerta" ? "Atenção" : "Crítico"}
              </span>
              <span style={{ fontSize: "0.625rem", color: "var(--on-surface-variant)", opacity: 0.5 }}>
                ({form.quantidade}/{form.minimo})
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(85,67,53,0.15)" }}>
          <Button variant="secondary" onClick={onClose} style={{ padding: "0.5rem 1rem", fontSize: "0.6875rem" }}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} style={{ padding: "0.5rem 1.125rem", fontSize: "0.6875rem", gap: "0.375rem" }}>
            <Package size={13} />
            Cadastrar Item
          </Button>
        </div>
      </div>
    </Modal>
  );
}
