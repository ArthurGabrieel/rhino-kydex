"use client";

import { AlertTriangle, Tag, ShieldAlert } from "lucide-react";
import { alertas } from "@/lib/mock-data";
import { FadeSection } from "./primitives";

export function AlertasBanner() {
  if (!alertas.length) return null;

  return (
    <FadeSection delay={420}>
      <div 
        style={{ 
          display: "flex", 
          gap: "0.75rem", 
          overflowX: "auto", 
          paddingBottom: "0.5rem",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
        className="hide-scrollbar"
      >
        {alertas.map((alerta) => {
          const isCritico = alerta.tipo === "critico" || alerta.tipo === "gargalo";
          const color = isCritico ? "var(--tertiary)" : "var(--primary)";
          const bg = isCritico ? "rgba(255,136,129,0.05)" : "rgba(247,146,31,0.05)";
          const border = isCritico ? "rgba(255,136,129,0.15)" : "rgba(247,146,31,0.15)";

          return (
            <div 
              key={alerta.id}
              style={{
                flexShrink: 0,
                minWidth: "280px",
                maxWidth: "340px",
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: isCritico ? "rgba(255,136,129,0.1)" : "rgba(247,146,31,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {isCritico ? (
                  <ShieldAlert size={16} color={color} />
                ) : (
                  <AlertTriangle size={16} color={color} />
                )}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.125rem" }}>
                  <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {alerta.mensagem}
                  </h4>
                  <span className="label-sm" style={{ fontSize: "0.625rem", color: color, opacity: 0.8, fontFamily: "monospace" }}>
                    {alerta.ref}
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {alerta.subtexto}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </FadeSection>
  );
}
