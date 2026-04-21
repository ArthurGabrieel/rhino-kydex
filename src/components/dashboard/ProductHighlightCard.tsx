"use client";

import { Target, Activity, Cpu } from "lucide-react";
import { FadeSection } from "./primitives";

export function ProductHighlightCard() {
  return (
    <FadeSection delay={400}>
      <div style={{ 
        position: "relative", 
        borderRadius: "8px", 
        overflow: "hidden", 
        border: "1px solid rgba(255, 184, 119, 0.15)",
        background: "#0c0a09",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "280px",
        height: "100%",
      }}>
        {/* Product Image Background */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/kydex_tactical.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
          filter: "contrast(1.1) brightness(0.9)",
          mixBlendMode: "luminosity",
          zIndex: 0
        }} />

        {/* Glowing Overlay Gradient */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(12,10,9,1) 0%, rgba(12,10,9,0.3) 50%, rgba(255,184,119,0.05) 100%)",
          zIndex: 1
        }} />

        {/* Telemetry Header */}
        <div style={{ position: "relative", zIndex: 2, padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Target size={14} color="var(--primary)" />
            <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Foco de Produção
            </span>
          </div>
        </div>

        {/* Telemetry Footer */}
        <div style={{ position: "relative", zIndex: 2, padding: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.25rem", fontFamily: "var(--font-headline)", color: "var(--on-surface)" }}>
              KY-BLK-20
            </span>
            <span style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
              Coldre Velado Kydex® Tactical
            </span>
          </div>
          
          {/* Tech Badges */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ padding: "0.375rem 0.625rem", background: "rgba(126, 200, 142, 0.1)", border: "1px solid rgba(126, 200, 142, 0.2)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <Activity size={12} color="#7ec88e" />
              <span style={{ fontSize: "0.6875rem", color: "#7ec88e", fontWeight: 600 }}>ALTA DEMANDA</span>
            </div>
            <div style={{ padding: "0.375rem 0.625rem", background: "rgba(255, 184, 119, 0.1)", border: "1px solid rgba(255, 184, 119, 0.2)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <Cpu size={12} color="var(--primary)" />
              <span style={{ fontSize: "0.6875rem", color: "var(--primary)", fontWeight: 600 }}>EM USINAGEM</span>
            </div>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}
