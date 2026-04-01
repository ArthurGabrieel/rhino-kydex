"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

// Glitch flicker — randomly shifts the "404" text by a few px
function useGlitch() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const tick = () => {
      const active = Math.random() > 0.85;
      setOffset({ x: active ? (Math.random() - 0.5) * 6 : 0, y: active ? (Math.random() - 0.5) * 4 : 0 });
    };
    const id = setInterval(tick, 80);
    return () => clearInterval(id);
  }, []);
  return offset;
}

export default function NotFound() {
  const glitch = useGlitch();

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--background)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Tactical grid overlay */}
      <div className="tactical-grid" style={{
        position: "fixed", inset: 0,
        zIndex: 0, pointerEvents: "none",
      }} />

      {/* Corner decorations */}
      {[
        { top: "1.5rem", left: "1.5rem", borderTop: "2px solid", borderLeft: "2px solid" },
        { top: "1.5rem", right: "1.5rem", borderTop: "2px solid", borderRight: "2px solid" },
        { bottom: "1.5rem", left: "1.5rem", borderBottom: "2px solid", borderLeft: "2px solid" },
        { bottom: "1.5rem", right: "1.5rem", borderBottom: "2px solid", borderRight: "2px solid" },
      ].map((style, i) => (
        <div key={i} style={{
          position: "fixed", width: 24, height: 24,
          borderColor: "rgba(247,146,31,0.2)",
          ...style,
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 520 }}>

        {/* Error chip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <AlertTriangle size={12} color="var(--tertiary)" />
          <span className="chip" style={{
            background: "rgba(255,136,129,0.1)",
            color: "var(--tertiary)",
            fontSize: "0.625rem",
          }}>
            ERRO · ROTA_NAO_ENCONTRADA
          </span>
        </div>

        {/* 404 glitch number */}
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          {/* Ghost layer behind */}
          <div style={{
            position: "absolute", inset: 0,
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(7rem, 20vw, 12rem)",
            fontWeight: 900,
            color: "var(--tertiary)",
            opacity: 0.08,
            letterSpacing: "-0.04em",
            transform: `translate(${glitch.x * 2}px, ${glitch.y}px)`,
            userSelect: "none",
            lineHeight: 1,
          }}>
            404
          </div>

          {/* Main number */}
          <div style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(7rem, 20vw, 12rem)",
            fontWeight: 900,
            color: "var(--on-surface)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            transform: `translate(${glitch.x}px, ${glitch.y}px)`,
            transition: "transform 40ms linear",
            userSelect: "none",
          }}>
            <span style={{ color: "var(--primary)" }}>4</span>
            0
            <span style={{ color: "var(--primary)" }}>4</span>
          </div>
        </div>

        {/* Message */}
        <h1 style={{
          fontFamily: "var(--font-headline)",
          fontSize: "1.125rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--on-surface)",
          marginBottom: "0.75rem",
        }}>
          Recurso não encontrado
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--on-surface-variant)",
          lineHeight: 1.7,
          marginBottom: "2.5rem",
        }}>
          A rota solicitada não existe ou foi movida.
          <br />Verifique o endereço ou volte para o painel de operações.
        </p>

        {/* Monospace error block */}
        <div style={{
          fontFamily: "monospace",
          fontSize: "0.6875rem",
          color: "var(--on-surface-variant)",
          background: "var(--surface-container-low)",
          border: "1px solid rgba(85,67,53,0.2)",
          padding: "1rem 1.25rem",
          textAlign: "left",
          marginBottom: "2rem",
          lineHeight: 1.8,
        }}>
          <span style={{ color: "var(--primary)", opacity: 0.7 }}>STATUS:</span>{"        "}404 Not Found<br />
          <span style={{ color: "var(--primary)", opacity: 0.7 }}>SISTEMA:</span>{"       "}Rhino Kydex Backoffice<br />
          <span style={{ color: "var(--tertiary)", opacity: 0.8 }}>MENSAGEM:</span>{"      "}Rota não registrada<br />
          <span style={{ color: "var(--primary)", opacity: 0.7 }}>SUGESTÃO:</span>{"      "}Retornar ao /dashboard
        </div>

        {/* CTA */}
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button className="btn-primary" style={{ gap: "0.625rem", padding: "0.875rem 1.75rem" }}>
            <ArrowLeft size={14} />
            Voltar ao Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
