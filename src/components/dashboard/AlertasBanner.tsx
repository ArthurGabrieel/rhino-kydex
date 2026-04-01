"use client";

import { AlertTriangle } from "lucide-react";
import { alertas } from "@/lib/mock-data";
import { FadeSection } from "./primitives";

export function AlertasBanner() {
  if (!alertas.length) return null;

  return (
    <FadeSection delay={420}>
      <div style={{
        background: "rgba(255,136,129,0.05)",
        border: "1px solid rgba(255,136,129,0.15)",
        padding: "0.875rem 1.25rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
      }}>
        <AlertTriangle size={14} color="var(--tertiary)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1, display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {alertas.map((alerta) => (
            <div key={alerta.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: alerta.tipo === "critico" ? "var(--tertiary)" : "var(--primary)",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>{alerta.mensagem}</span>
              <span className="chip" style={{
                fontFamily: "monospace",
                fontSize: "0.5625rem",
                background: alerta.tipo === "critico" ? "rgba(255,136,129,0.1)" : "rgba(247,146,31,0.1)",
                color: alerta.tipo === "critico" ? "var(--tertiary)" : "var(--primary)",
              }}>
                {alerta.ref}
              </span>
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  );
}
