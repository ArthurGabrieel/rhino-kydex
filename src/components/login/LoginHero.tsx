"use client";

import Image from "next/image";

/**
 * Painel esquerdo da tela de login — hero com tagline e logo real.
 */
export function LoginHero() {
  return (
    <div
      className="tactical-grid"
      style={{
        width: "100%",
        height: "100%",
        background: "var(--background)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2.75rem clamp(2rem, 4vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Marca no topo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Image
          src="/favicon.webp"
          alt="Rhino Kydex"
          width={44}
          height={44}
          style={{ objectFit: "contain" }}
          priority
        />
        <div>
          <div style={{
            fontFamily: "var(--font-headline)",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--on-surface)",
          }}>
            Rhino Kydex
          </div>
          <div className="label-sm" style={{ marginTop: 2 }}>Tactical Ops</div>
        </div>
      </div>

      {/* Conteúdo central */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "1rem 0" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(247,146,31,0.1)",
            padding: "0.25rem 0.75rem",
            marginBottom: "1.5rem",
          }}>
            <div style={{
              width: 6, height: 6,
              background: "var(--primary)",
              borderRadius: "50%",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
            <span className="label-sm" style={{ color: "var(--primary)" }}>Sistema Operacional</span>
          </div>

          <h1 className="display-lg" style={{ marginBottom: "1.5rem", maxWidth: 520 }}>
            Proteção
            <br />
            <span style={{ color: "var(--primary)" }}>e</span>
            <br />
            Excelência
          </h1>

          <p style={{
            color: "var(--on-surface-variant)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            maxWidth: 430,
          }}>
            Sistema integrado de gerenciamento de produção para equipamentos
            táticos de precisão.
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <div>
        <div style={{
          width: "100%", height: 1,
          background: "linear-gradient(90deg, var(--primary-container) 0%, transparent 100%)",
          marginBottom: "1rem",
          opacity: 0.3,
        }} />
        <div className="label-sm">
          Uncompromising Precision · Industrial Standards · Rhino Kydex Systems
        </div>
      </div>

      {/* Acento laranja lateral */}
      <div style={{
        position: "absolute",
        right: 0, top: "20%",
        width: 4, height: "30%",
        background: "linear-gradient(180deg, var(--primary) 0%, transparent 100%)",
        opacity: 0.6,
      }} />
    </div>
  );
}
