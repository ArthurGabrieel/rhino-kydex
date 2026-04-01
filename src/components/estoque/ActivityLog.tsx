"use client";

import { LogEntry } from "./types";

const LOG_COLORS: Record<string, string> = {
  saida:    "var(--on-surface-variant)",
  alerta:   "var(--tertiary)",
  entrada:  "#7ec88e",
  auth:     "var(--secondary)",
  producao: "var(--primary)",
};

interface ActivityLogProps {
  entries: LogEntry[];
}

export default function ActivityLog({ entries }: ActivityLogProps) {
  return (
    <div
      style={{
        background: "var(--surface-container-lowest)",
        padding: "1.25rem",
        height: "100%",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--on-surface)",
          }}
        >
          Log de Atividades
        </h2>
        <div
          style={{
            width: 8,
            height: 8,
            background: "var(--primary)",
            borderRadius: "50%",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Entries */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.6875rem",
          maxHeight: "calc(100vh - 280px)",
          overflowY: "auto",
        }}
      >
        {entries.length === 0 ? (
          <div style={{ opacity: 0.3, padding: "1rem 0" }}>
            <span style={{ fontSize: "0.625rem", letterSpacing: "0.05em" }}>AWAIT_ACTIVITY...</span>
          </div>
        ) : (
          entries.map((log) => (
            <div
              key={log.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.125rem",
                padding: "0.5rem 0",
                borderBottom: "1px solid rgba(85,67,53,0.08)",
                animation: "fadeIn 0.2s ease",
              }}
            >
              <span style={{ color: "var(--on-surface-variant)", opacity: 0.4, fontSize: "0.5625rem", letterSpacing: "0.04em" }}>
                [{log.hora}]
              </span>
              <span style={{ color: LOG_COLORS[log.tipo] ?? "var(--on-surface-variant)", opacity: 0.9, lineHeight: 1.5, wordBreak: "break-word" }}>
                {log.mensagem}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
