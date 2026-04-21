"use client";

import { useMemo } from "react";
import { User, Trophy, Flame } from "lucide-react";
import { metasPorPessoa } from "@/lib/mock-data";
import { useMediaQuery } from "@/lib/use-media-query";

export function RankingPanel() {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  // Sort by highest realizadoMes
  const ranking = useMemo(() => {
    return [...metasPorPessoa].sort((a, b) => b.realizadoMes - a.realizadoMes);
  }, []);

  return (
    <div className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Trophy size={16} color="var(--primary)" />
          <h2 className="title-md">Ranking de Operadores</h2>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {ranking.map((op, index) => {
          const isTop = index === 0;
          const percent = Math.min(Math.round((op.realizadoMes / op.metaMensal) * 100), 100);
          
          return (
            <div 
              key={op.operadorId} 
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                padding: "0.875rem",
                background: isTop ? "rgba(247,146,31,0.06)" : "var(--surface-container-lowest)",
                border: isTop ? "1px solid rgba(247,146,31,0.2)" : "1px solid rgba(85,67,53,0.1)",
                borderRadius: "6px",
                position: "relative",
              }}
            >
              {isTop && (
                <div style={{ position: "absolute", top: -8, right: 12, background: "var(--primary)", padding: "2px 6px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 2px 4px rgba(247,146,31,0.3)" }}>
                  <Flame size={10} color="#000" />
                  <span style={{ fontSize: "0.5rem", fontWeight: 800, color: "#000", textTransform: "uppercase", letterSpacing: "0.05em" }}>Líder</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: 28, height: 28, flexShrink: 0,
                    background: isTop ? "var(--primary)" : "var(--surface-container-highest)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-headline)", fontSize: "0.625rem", fontWeight: 700,
                    color: isTop ? "#000" : "var(--on-surface)",
                    borderRadius: "4px"
                  }}>
                    {op.avatar}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isTop ? "var(--primary)" : "var(--on-surface)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.6875rem", opacity: 0.5 }}>#{index + 1}</span> {op.nome}
                    </span>
                    <span style={{ fontSize: "0.625rem", color: "var(--on-surface-variant)" }}>
                      Meta: {op.metaMensal} un
                    </span>
                  </div>
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.125rem", fontWeight: 700, color: isTop ? "var(--primary)" : "var(--on-surface)", lineHeight: 1 }}>
                    {op.realizadoMes}
                  </div>
                  <span style={{ fontSize: "0.625rem", color: "var(--on-surface-variant)" }}>produzidos</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.5625rem", fontWeight: 600, color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progresso Mensal</span>
                  <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: percent >= 100 ? "#7ec88e" : "var(--on-surface)" }}>{percent}%</span>
                </div>
                <div style={{ height: 4, background: "var(--surface-container-highest)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${percent}%`,
                    background: percent >= 100 ? "#7ec88e" : isTop ? "linear-gradient(90deg, #ffb877, #f7921f)" : "var(--on-surface)",
                    transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
