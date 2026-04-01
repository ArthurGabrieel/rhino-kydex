"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import type { Empresa } from "./types";

const INITIAL: Empresa = {
  nome:         "Rhino Kydex Indústria Ltda.",
  cnpj:         "38.421.900/0001-12",
  responsavel:  "Jorge Matos",
  telefone:     "(31) 98821-4400",
  email:        "contato@rhinokydex.com.br",
  endereco:     "Rua das Indústrias, 480 — Galpão B",
  cidade:       "Belo Horizonte",
  estado:       "MG",
  cep:          "31.270-020",
  site:         "rhinokydex.com.br",
};

function Field({
  label, value, onChange, mono = false, half = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  mono?: boolean; half?: boolean;
}) {
  return (
    <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
      <label className="input-label">{label}</label>
      <input
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontFamily: mono ? "monospace" : "var(--font-body)", fontSize: "0.875rem" }}
      />
    </div>
  );
}

export function EmpresaTab() {
  const [form, setForm] = useState<Empresa>(INITIAL);
  const [saved, setSaved] = useState(false);

  const update = (field: keyof Empresa) => (v: string) =>
    setForm((prev) => ({ ...prev, [field]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Dados da empresa */}
      <div className="card">
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Dados da Empresa</h2>
          <p className="label-sm">Informações cadastrais da operação</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem 1.5rem" }}>
          <Field label="Razão Social"    value={form.nome}        onChange={update("nome")}        />
          <Field label="CNPJ"            value={form.cnpj}        onChange={update("cnpj")}        mono half />
          <Field label="Responsável"     value={form.responsavel} onChange={update("responsavel")} half />
          <Field label="Telefone"        value={form.telefone}    onChange={update("telefone")}    mono half />
          <Field label="E-mail"          value={form.email}       onChange={update("email")}       half />
          <Field label="Endereço"        value={form.endereco}    onChange={update("endereco")}    />
          <Field label="Cidade"          value={form.cidade}      onChange={update("cidade")}      half />
          <Field label="Estado"          value={form.estado}      onChange={update("estado")}      half />
          <Field label="CEP"             value={form.cep}         onChange={update("cep")}         mono half />
          <Field label="Website"         value={form.site}        onChange={update("site")}        half />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" onClick={handleSave} style={{ gap: "0.5rem" }}>
          {saved
            ? <><Check size={14} /> Salvo!</>
            : <><Save size={14} /> Salvar alterações</>
          }
        </button>
      </div>
    </div>
  );
}
