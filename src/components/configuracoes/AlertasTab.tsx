"use client";

import { useState } from "react";
import { Bell, BellOff, Save, Check } from "lucide-react";
import type { AlertaConfig } from "./types";
import { useMediaQuery } from "@/lib/use-media-query";

const INITIAL_ALERTAS: AlertaConfig[] = [
  { id: "mat",    categoria: "Material",      label: "Kydex Sheets (todos os tipos)",  limiteMinimo: 15, emailAtivo: true,  sobreAviso: 20 },
  { id: "hw",     categoria: "Hardware",      label: "Parafusos e ilhós",              limiteMinimo: 300, emailAtivo: true, sobreAviso: 15 },
  { id: "rebite", categoria: "Hardware",      label: "Rebites",                        limiteMinimo: 200, emailAtivo: false, sobreAviso: 10 },
  { id: "foam",   categoria: "Acessório",     label: "Foam Padding",                   limiteMinimo: 10,  emailAtivo: true,  sobreAviso: 30 },
  { id: "fin",    categoria: "Produto Final", label: "Coldres prontos (qualquer modelo)", limiteMinimo: 5, emailAtivo: true, sobreAviso: 40 },
];

export function AlertasTab() {
  const [alertas, setAlertas] = useState<AlertaConfig[]>(INITIAL_ALERTAS);
  const [saved, setSaved] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const update = (id: string, field: keyof AlertaConfig, value: unknown) =>
    setAlertas((prev) => prev.map((a) => a.id === id ? { ...a, [field]: value } : a));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Info banner */}
      <div style={{
        padding: "0.875rem 1.25rem",
        background: "rgba(247,146,31,0.06)",
        border: "1px solid rgba(247,146,31,0.15)",
        display: "flex", alignItems: "flex-start", gap: "0.75rem",
      }}>
        <Bell size={14} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
        <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)", lineHeight: 1.5 }}>
          Configure os limiares de alerta por categoria de insumo. Quando o estoque cair abaixo
          do <strong style={{ color: "var(--on-surface)" }}>mínimo</strong>, o sistema exibe um alerta no dashboard.
          O campo <strong style={{ color: "var(--on-surface)" }}>pré-aviso</strong> dispara antes, quando o estoque
          estiver dentro da margem configurada acima do mínimo.
        </p>
      </div>

      {/* Tabela de alertas */}
      {isMobile ? (
        <div className="card" style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {alertas.map((alerta) => (
            <div
              key={alerta.id}
              style={{
                border: "1px solid rgba(85,67,53,0.16)",
                background: "var(--surface-container-high)",
                padding: "0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{alerta.label}</div>
                <span className="chip" style={{ marginTop: "0.25rem", fontSize: "0.5625rem" }}>{alerta.categoria}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span className="label-sm" style={{ fontSize: "0.5625rem" }}>MÍNIMO</span>
                  <input
                    type="number"
                    min={1}
                    className="input-field"
                    value={alerta.limiteMinimo}
                    onChange={(e) => update(alerta.id, "limiteMinimo", Number(e.target.value))}
                    style={{ fontFamily: "monospace", textAlign: "center", fontSize: "0.875rem", padding: "0.5rem" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span className="label-sm" style={{ fontSize: "0.5625rem" }}>PRÉ-AVISO (%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="input-field"
                    value={alerta.sobreAviso}
                    onChange={(e) => update(alerta.id, "sobreAviso", Number(e.target.value))}
                    style={{ fontFamily: "monospace", textAlign: "center", fontSize: "0.875rem", padding: "0.5rem" }}
                  />
                </div>
              </div>

              <button
                onClick={() => update(alerta.id, "emailAtivo", !alerta.emailAtivo)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  minHeight: 36,
                  padding: "0.5rem 0.875rem",
                  background: alerta.emailAtivo ? "rgba(126,200,142,0.1)" : "var(--surface-container-highest)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-headline)",
                  color: alerta.emailAtivo ? "#7ec88e" : "var(--on-surface-variant)",
                  transition: "all 150ms ease",
                }}
              >
                {alerta.emailAtivo
                  ? <><Bell size={12} /> Notificação ativa</>
                  : <><BellOff size={12} /> Notificação inativa</>
                }
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 100px 100px 140px",
            gap: "1rem",
            padding: "0.625rem 1.25rem",
            background: "var(--surface-container)",
          }}>
            {["INSUMO / CATEGORIA", "MÍNIMO", "PRÉ-AVISO", "NOTIF. E-MAIL"].map((h) => (
              <span key={h} className="label-sm" style={{ fontSize: "0.5625rem" }}>{h}</span>
            ))}
          </div>

          {alertas.map((alerta) => (
            <div
              key={alerta.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 100px 140px",
                gap: "1rem",
                padding: "0.875rem 1.25rem",
                alignItems: "center",
                borderBottom: "1px solid rgba(85,67,53,0.1)",
              }}
            >
              {/* Label + categoria */}
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{alerta.label}</div>
                <span className="chip" style={{ marginTop: "0.25rem", fontSize: "0.5625rem" }}>{alerta.categoria}</span>
              </div>

              {/* Mínimo */}
              <div>
                <input
                  type="number"
                  min={1}
                  className="input-field"
                  value={alerta.limiteMinimo}
                  onChange={(e) => update(alerta.id, "limiteMinimo", Number(e.target.value))}
                  style={{ fontFamily: "monospace", textAlign: "center", fontSize: "0.875rem", padding: "0.5rem" }}
                />
              </div>

              {/* Pré-aviso % */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <input
                  type="number"
                  min={0} max={100}
                  className="input-field"
                  value={alerta.sobreAviso}
                  onChange={(e) => update(alerta.id, "sobreAviso", Number(e.target.value))}
                  style={{ fontFamily: "monospace", textAlign: "center", fontSize: "0.875rem", padding: "0.5rem", flex: 1 }}
                />
                <span className="label-sm" style={{ textTransform: "none", letterSpacing: 0 }}>%</span>
              </div>

              {/* Toggle e-mail */}
              <button
                onClick={() => update(alerta.id, "emailAtivo", !alerta.emailAtivo)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 0.875rem",
                  background: alerta.emailAtivo ? "rgba(126,200,142,0.1)" : "var(--surface-container-highest)",
                  border: "none", cursor: "pointer",
                  fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.04em",
                  textTransform: "uppercase", fontFamily: "var(--font-headline)",
                  color: alerta.emailAtivo ? "#7ec88e" : "var(--on-surface-variant)",
                  transition: "all 150ms ease",
                }}
              >
                {alerta.emailAtivo
                  ? <><Bell size={12} /> Ativo</>
                  : <><BellOff size={12} /> Inativo</>
                }
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: isMobile ? "stretch" : "flex-end" }}>
        <button className="btn-primary" onClick={handleSave} style={{ gap: "0.5rem", width: isMobile ? "100%" : undefined, justifyContent: isMobile ? "center" : undefined }}>
          {saved
            ? <><Check size={14} /> Salvo!</>
            : <><Save size={14} /> Salvar configurações</>
          }
        </button>
      </div>
    </div>
  );
}
