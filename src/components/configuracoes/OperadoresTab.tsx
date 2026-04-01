"use client";

import { useState } from "react";
import { Plus, Power, Edit2, Check, X } from "lucide-react";
import type { OperadorConfig } from "./types";

const INITIAL_OPERADORES: OperadorConfig[] = [
  { id: 1, nome: "Jorge",   sobrenome: "Matos",     nivel: "Sênior", avatar: "JM", ativo: true,  funcao: "Moldagem e Acabamento", turno: "Manhã" },
  { id: 2, nome: "Ricardo", sobrenome: "Ferreira",  nivel: "Pleno",  avatar: "RF", ativo: true,  funcao: "Moldagem",              turno: "Manhã" },
  { id: 3, nome: "Marcos",  sobrenome: "Oliveira",  nivel: "Júnior", avatar: "MO", ativo: true,  funcao: "Acabamento e Expedição", turno: "Tarde" },
];

const NIVEL_COLOR: Record<string, string> = {
  "Sênior": "var(--primary)",
  "Pleno":  "var(--secondary)",
  "Júnior": "var(--on-surface-variant)",
};

function OperadorRow({
  op,
  onToggle,
}: {
  op: OperadorConfig;
  onToggle: (id: number) => void;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "40px 1fr 1fr 1fr auto",
      alignItems: "center",
      gap: "1rem",
      padding: "0.875rem 1rem",
      borderBottom: "1px solid rgba(85,67,53,0.1)",
      opacity: op.ativo ? 1 : 0.45,
      transition: "opacity 200ms ease",
    }}>
      {/* Avatar */}
      <div style={{
        width: 36, height: 36,
        background: op.ativo ? "rgba(247,146,31,0.12)" : "var(--surface-container-highest)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-headline)", fontSize: "0.625rem", fontWeight: 700,
        color: op.ativo ? "var(--primary)" : "var(--on-surface-variant)",
      }}>
        {op.avatar}
      </div>

      {/* Nome + nível */}
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
          {op.nome} {op.sobrenome}
        </div>
        <div style={{ fontSize: "0.625rem", color: NIVEL_COLOR[op.nivel], fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {op.nivel}
        </div>
      </div>

      {/* Função */}
      <div className="label-sm" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
        {op.funcao}
      </div>

      {/* Turno */}
      <span className="chip" style={{ justifySelf: "start" }}>{op.turno}</span>

      {/* Toggle ativo */}
      <button
        onClick={() => onToggle(op.id)}
        title={op.ativo ? "Desativar operador" : "Ativar operador"}
        style={{
          display: "flex", alignItems: "center", gap: "0.375rem",
          padding: "0.375rem 0.75rem",
          background: op.ativo ? "rgba(126,200,142,0.1)" : "rgba(255,136,129,0.1)",
          border: "none", cursor: "pointer",
          fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.04em",
          textTransform: "uppercase", fontFamily: "var(--font-headline)",
          color: op.ativo ? "#7ec88e" : "var(--tertiary)",
          transition: "all 150ms ease",
        }}
      >
        <Power size={11} />
        {op.ativo ? "Ativo" : "Inativo"}
      </button>
    </div>
  );
}

export function OperadoresTab() {
  const [operadores, setOperadores] = useState<OperadorConfig[]>(INITIAL_OPERADORES);
  const [showAdd, setShowAdd] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newSobre, setNewSobre] = useState("");
  const [newFuncao, setNewFuncao] = useState("Moldagem");
  const [newTurno, setNewTurno] = useState("Manhã");

  const toggleAtivo = (id: number) =>
    setOperadores((prev) => prev.map((o) => o.id === id ? { ...o, ativo: !o.ativo } : o));

  const addOperador = () => {
    if (!newNome.trim()) return;
    const initials = `${newNome[0] ?? "?"}${newSobre[0] ?? "?"}`.toUpperCase();
    setOperadores((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome: newNome.trim(),
        sobrenome: newSobre.trim(),
        nivel: "Júnior",
        avatar: initials,
        ativo: true,
        funcao: newFuncao,
        turno: newTurno,
      },
    ]);
    setNewNome(""); setNewSobre(""); setShowAdd(false);
  };

  const ativos   = operadores.filter((o) => o.ativo).length;
  const inativos = operadores.length - ativos;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          { label: "Total de operadores",  value: operadores.length, color: "var(--on-surface)"       },
          { label: "Ativos agora",          value: ativos,            color: "#7ec88e"                  },
          { label: "Inativos",              value: inativos,          color: "var(--on-surface-variant)"},
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: "1rem 1.25rem" }}>
            <div className="label-sm" style={{ marginBottom: "0.5rem" }}>{label}</div>
            <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.75rem", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 1fr 1fr auto",
          gap: "1rem",
          padding: "0.625rem 1rem",
          background: "var(--surface-container)",
        }}>
          {["", "OPERADOR", "FUNÇÃO", "TURNO", "STATUS"].map((h) => (
            <span key={h} className="label-sm" style={{ fontSize: "0.5625rem" }}>{h}</span>
          ))}
        </div>

        {operadores.map((op) => (
          <OperadorRow key={op.id} op={op} onToggle={toggleAtivo} />
        ))}

        {/* Add form inline */}
        {showAdd && (
          <div style={{
            padding: "1rem",
            background: "var(--surface-container-lowest)",
            borderTop: "1px solid rgba(85,67,53,0.1)",
            display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap",
          }}>
            <div style={{ flex: "1 1 140px" }}>
              <label className="input-label">Nome</label>
              <input className="input-field" value={newNome} onChange={(e) => setNewNome(e.target.value)} placeholder="João" />
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <label className="input-label">Sobrenome</label>
              <input className="input-field" value={newSobre} onChange={(e) => setNewSobre(e.target.value)} placeholder="Silva" />
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <label className="input-label">Função</label>
              <select className="input-field" value={newFuncao} onChange={(e) => setNewFuncao(e.target.value)} style={{ cursor: "pointer" }}>
                {["Moldagem", "Acabamento", "Expedição", "Moldagem e Acabamento", "Acabamento e Expedição"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: "1 1 120px" }}>
              <label className="input-label">Turno</label>
              <select className="input-field" value={newTurno} onChange={(e) => setNewTurno(e.target.value)} style={{ cursor: "pointer" }}>
                {["Manhã", "Tarde", "Noite"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-primary" onClick={addOperador} style={{ padding: "0.75rem 1rem" }}>
                <Check size={14} />
              </button>
              <button className="btn-secondary" onClick={() => setShowAdd(false)} style={{ padding: "0.75rem 1rem" }}>
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {!showAdd && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={() => setShowAdd(true)} style={{ gap: "0.5rem" }}>
            <Plus size={14} /> Adicionar Operador
          </button>
        </div>
      )}
    </div>
  );
}
