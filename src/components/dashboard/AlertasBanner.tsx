"use client";

import { AlertTriangle, Tag, ArrowRight, ShieldAlert } from "lucide-react";
import { alertas } from "@/lib/mock-data";
import { FadeSection } from "./primitives";

export function AlertasBanner() {
  if (!alertas.length) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
      {alertas.map((alerta, i) => {
        const isCritico = alerta.tipo === "critico" || alerta.tipo === "gargalo";
        const accent = isCritico ? "var(--tertiary)" : "var(--primary)";
        const bg = isCritico ? "rgba(255,136,129,0.05)" : "rgba(247,146,31,0.05)";
        const border = isCritico ? "rgba(255,136,129,0.2)" : "rgba(247,146,31,0.2)";

        return (
          <FadeSection delay={420 + i * 100} key={alerta.id}>
            <div className="card" style={{
              background: bg,
              border: `1px solid ${border}`,
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              height: "100%",
            }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                {isCritico ? (
                  <ShieldAlert size={18} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <AlertTriangle size={18} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface)", marginBottom: "0.25rem" }}>
                    {alerta.mensagem}
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", lineHeight: 1.4 }}>
                    {alerta.subtexto}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <span className="chip" style={{
                  fontFamily: "monospace",
                  fontSize: "0.625rem",
                  background: isCritico ? "rgba(255,136,129,0.1)" : "rgba(247,146,31,0.1)",
                  color: accent,
                  border: `1px solid ${border}`
                }}>
                  <Tag size={10} style={{ marginRight: 4, display: "inline-block" }} />
                  {alerta.ref}
                </span>

                <button style={{
                  background: "transparent",
                  border: "none",
                  color: accent,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                }}>
                  {alerta.acao}
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </FadeSection>
        );
      })}
    </div>
  );
}
