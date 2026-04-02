"use client";

import { useState } from "react";
import { Plus, Power, KeyRound, Settings2 } from "lucide-react";
import type { OperadorConfig } from "./types";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import { OperadorModal } from "./OperadorModal";
import { useMediaQuery } from "@/lib/use-media-query";

const INITIAL_OPERADORES: OperadorConfig[] = [
  { id: 1, email: "jorge.matos@rhino.com",  nome: "Jorge",   sobrenome: "Matos",     nivel: "Sênior", avatar: "JM", ativo: true,  funcao: "Moldagem",     turno: "Manhã", role: "Gerente",       modulos: ["Dashboard", "Estoque", "Produção", "Kanban"] },
  { id: 2, email: "ricardo.f@rhino.com",    nome: "Ricardo", sobrenome: "Ferreira",  nivel: "Pleno",  avatar: "RF", ativo: true,  funcao: "Moldagem",     turno: "Manhã", role: "Colaborador",   modulos: ["Produção", "Kanban"] },
  { id: 3, email: "marcos.o@rhino.com",     nome: "Marcos",  sobrenome: "Oliveira",  nivel: "Júnior", avatar: "MO", ativo: false, funcao: "Acabamento",   turno: "Tarde", role: "Colaborador",   modulos: ["Kanban"] },
];

const NIVEL_COLOR: Record<string, string> = {
  "Sênior": "var(--primary)",
  "Pleno":  "var(--secondary)",
  "Júnior": "var(--on-surface-variant)",
};

const ROLE_COLOR: Record<string, string> = {
  "Administrador": "var(--tertiary)",
  "Gerente": "var(--primary)",
  "Colaborador": "var(--on-surface-variant)",
};

function OperadorRow({
  op,
  onToggle,
  onEdit,
  isMobile,
}: {
  op: OperadorConfig;
  onToggle: (id: number) => void;
  onEdit: (op: OperadorConfig) => void;
  isMobile: boolean;
}) {
  const { showToast } = useToast();

  const handleResetPassword = () => {
    showToast(`Um link seguro foi gerado para o operador ${op.nome}.`, "success");
  };

  if (isMobile) {
    return (
      <div
        style={{
          padding: "0.875rem",
          borderBottom: "1px solid rgba(85,67,53,0.1)",
          opacity: op.ativo ? 1 : 0.45,
          transition: "opacity 200ms ease",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: op.ativo ? "rgba(247,146,31,0.12)" : "var(--surface-container-highest)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-headline)",
              fontSize: "0.625rem",
              fontWeight: 700,
              color: op.ativo ? "var(--primary)" : "var(--on-surface-variant)",
              flexShrink: 0,
            }}
          >
            {op.avatar}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--on-surface)",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {op.nome} {op.sobrenome}
              <div
                style={{
                  fontSize: "0.625rem",
                  color: NIVEL_COLOR[op.nivel],
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {op.nivel}
              </div>
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--on-surface-variant)",
                marginTop: "0.125rem",
                overflowWrap: "anywhere",
              }}
            >
              {op.email}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip" style={{ fontSize: "0.625rem" }}>{op.funcao}</span>
          <span className="chip" style={{ fontSize: "0.625rem" }}>{op.turno}</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.2rem 0.5rem",
              background: "var(--surface-container-high)",
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--on-surface)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ROLE_COLOR[op.role] }} />
            {op.role}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
          <button
            onClick={() => onEdit(op)}
            title="Editar configurações e acessos"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 34,
              background: "transparent",
              border: "1px solid rgba(85, 67, 53, 0.4)",
              color: "var(--on-surface-variant)",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            <Settings2 size={14} />
          </button>
          <button
            onClick={handleResetPassword}
            title="Resetar senha de acesso"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 34,
              background: "transparent",
              border: "1px solid rgba(85, 67, 53, 0.4)",
              color: "var(--on-surface-variant)",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            <KeyRound size={13} />
          </button>
          <button
            onClick={() => onToggle(op.id)}
            title={op.ativo ? "Desativar operador" : "Ativar operador"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem",
              minHeight: 34,
              background: op.ativo ? "rgba(126,200,142,0.1)" : "rgba(255,136,129,0.1)",
              border: "none",
              cursor: "pointer",
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontFamily: "var(--font-headline)",
              color: op.ativo ? "#7ec88e" : "var(--tertiary)",
              transition: "all 150ms ease",
            }}
          >
            <Power size={11} />
            {op.ativo ? "Ativo" : "Inativo"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "40px 1.5fr 1fr 1fr 1fr auto",
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

      {/* Nome + e-mail + nível */}
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {op.nome} {op.sobrenome}
          <div style={{ fontSize: "0.625rem", color: NIVEL_COLOR[op.nivel], fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {op.nivel}
          </div>
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.125rem" }}>
          {op.email}
        </div>
      </div>

      {/* Função */}
      <div className="label-sm" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
        {op.funcao}
      </div>

      {/* Role */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: ROLE_COLOR[op.role] }} />
        <span className="label-sm" style={{ textTransform: "none", fontSize: "0.75rem", color: "var(--on-surface)" }}>
          {op.role}
        </span>
      </div>

      {/* Turno */}
      <span className="chip" style={{ justifySelf: "start" }}>{op.turno}</span>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifySelf: "end" }}>
        <button
          onClick={() => onEdit(op)}
          title="Editar configurações e acessos"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32,
            background: "transparent",
            border: "1px solid rgba(85, 67, 53, 0.4)",
            color: "var(--on-surface-variant)",
            cursor: "pointer",
            transition: "all 150ms ease",
            borderRadius: "0px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface-container-high)";
            e.currentTarget.style.color = "var(--on-surface)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--on-surface-variant)";
          }}
        >
          <Settings2 size={14} />
        </button>
        <button
          onClick={handleResetPassword}
          title="Resetar senha de acesso"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32,
            background: "transparent",
            border: "1px solid rgba(85, 67, 53, 0.4)",
            color: "var(--on-surface-variant)",
            cursor: "pointer",
            transition: "all 150ms ease",
            borderRadius: "0px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface-container-high)";
            e.currentTarget.style.color = "var(--on-surface)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--on-surface-variant)";
          }}
        >
          <KeyRound size={13} />
        </button>
        <button
          onClick={() => onToggle(op.id)}
          title={op.ativo ? "Desativar operador" : "Ativar operador"}
          style={{
            display: "flex", alignItems: "center", gap: "0.375rem",
            padding: "0.375rem 0.75rem", height: 32,
            background: op.ativo ? "rgba(126,200,142,0.1)" : "rgba(255,136,129,0.1)",
            border: "none", cursor: "pointer",
            fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.04em",
            textTransform: "uppercase", fontFamily: "var(--font-headline)",
            color: op.ativo ? "#7ec88e" : "var(--tertiary)",
            transition: "all 150ms ease",
            borderRadius: "0px"
          }}
        >
          <Power size={11} />
          {op.ativo ? "Ativo" : "Inativo"}
        </button>
      </div>
    </div>
  );
}

export function OperadoresTab() {
  const [operadores, setOperadores] = useState<OperadorConfig[]>(INITIAL_OPERADORES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperador, setEditingOperador] = useState<OperadorConfig | undefined>(undefined);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const toggleAtivo = (id: number) =>
    setOperadores((prev) => prev.map((o) => o.id === id ? { ...o, ativo: !o.ativo } : o));

  const handleSaveOperador = (opData: Partial<OperadorConfig>) => {
    if (editingOperador) {
      // Editar existente
      setOperadores(prev => prev.map(o => o.id === editingOperador.id ? { ...o, ...opData } as OperadorConfig : o));
    } else {
      // Criar novo
      const initials = `${opData.nome?.[0] || "?"}${opData.sobrenome?.[0] || "?"}`.toUpperCase();
      setOperadores(prev => [
        ...prev,
        {
          id: Date.now(),
          email: opData.email || "",
          nome: opData.nome || "",
          sobrenome: opData.sobrenome || "",
          nivel: opData.nivel || "Júnior",
          avatar: initials,
          ativo: typeof opData.ativo === "boolean" ? opData.ativo : true,
          funcao: opData.funcao || "Moldagem",
          turno: opData.turno || "Manhã",
          role: opData.role || "Colaborador",
          modulos: opData.modulos || ["Dashboard"]
        }
      ]);
    }
  };

  const openAddModal = () => {
    setEditingOperador(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (op: OperadorConfig) => {
    setEditingOperador(op);
    setIsModalOpen(true);
  };

  const ativos   = operadores.filter((o) => o.ativo).length;
  const inativos = operadores.length - ativos;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1rem" }}>
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
        {!isMobile && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "40px 1.5fr 1fr 1fr 1fr auto",
            gap: "1rem",
            padding: "0.625rem 1rem",
            background: "var(--surface-container)",
          }}>
            {["", "OPERADOR", "FUNÇÃO", "PERFIL (ROLE)", "TURNO", "STATUS"].map((h) => (
              <span key={h} className="label-sm" style={{ fontSize: "0.5625rem" }}>{h}</span>
            ))}
          </div>
        )}

        {operadores.map((op) => (
          <OperadorRow key={op.id} op={op} onToggle={toggleAtivo} onEdit={openEditModal} isMobile={isMobile} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: isMobile ? "stretch" : "flex-end", marginTop: "0.5rem" }}>
        <Button variant="secondary" onClick={openAddModal} style={{ width: isMobile ? "100%" : undefined, justifyContent: isMobile ? "center" : undefined }}>
          <Plus size={16} /> NOVO OPERADOR
        </Button>
      </div>

      {isModalOpen && (
        <OperadorModal
          operador={editingOperador}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveOperador}
        />
      )}
    </div>
  );
}
