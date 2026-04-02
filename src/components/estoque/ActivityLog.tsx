"use client";

import { useState, useEffect } from "react";

import { LogEntry } from "./types";
import { ArrowRight, ArrowDownRight, ArrowUpRight, AlertTriangle, User, Settings } from "lucide-react";

const LOG_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  saida:    { color: "var(--on-surface-variant)", icon: ArrowUpRight },
  entrada:  { color: "#7ec88e", icon: ArrowDownRight },
  alerta:   { color: "var(--tertiary)", icon: AlertTriangle },
  auth:     { color: "var(--secondary)", icon: User },
  producao: { color: "var(--primary)", icon: Settings },
};

interface ActivityLogProps {
  entries: LogEntry[];
}

export default function ActivityLog({ entries: initialEntries }: ActivityLogProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    // Simula um polling que puxa dados novos a cada 12 segundos
    const interval = setInterval(() => {
      setIsPolling(true);
      
      setTimeout(() => {
        setIsPolling(false);
        // Cria um log fictício baseado em um log aleatório para dar o efeito de sistema sempre em uso
        setEntries(prev => {
          if (initialEntries.length === 0) return prev;
          const randomIdx = Math.floor(Math.random() * initialEntries.length);
          const base = initialEntries[randomIdx];
          const now = new Date();
          const hora = now.toTimeString().split(' ')[0]; // HH:MM:SS
          
          const newLog = { 
            ...base, 
            id: Date.now().toString(), 
            hora 
          };
          // Mantém no máximo 20 itens para não pesar a DOM
          return [newLog, ...prev.slice(0, 19)];
        });
      }, 1200); // tempo que o "request" de polling demora pra concluir
    }, 12000);

    return () => clearInterval(interval);
  }, [initialEntries]);

  return (
    <div
      className="activity-log-panel"
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isPolling && (
            <span
              className="label-sm"
              style={{ fontSize: "0.5625rem", color: "var(--primary)", opacity: 0.85 }}
            >
              SYNC
            </span>
          )}
          <div
            title="Live Data Connection"
            className="live-dot"
            style={{
              width: 8,
              height: 8,
              background: "var(--primary)",
              borderRadius: "50%",
              boxShadow: "0 0 8px rgba(247, 146, 31, 0.4)" // glow de status laranja
            }}
          />
        </div>
      </div>

      {/* Entries */}
      <div
        className="activity-log-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxHeight: "calc(100vh - 280px)",
          overflowY: "auto",
          paddingRight: "0.5rem"
        }}
      >
        {entries.length === 0 ? (
          <div style={{ padding: "2rem 0", textAlign: "center", border: "1px dashed rgba(85,67,53,0.2)" }}>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-headline)", color: "var(--on-surface-variant)", opacity: 0.6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Nenhuma atividade recente
            </span>
          </div>
        ) : (
          entries.map((log) => {
            const config = LOG_CONFIG[log.tipo] || { color: "var(--on-surface-variant)", icon: ArrowRight };
            const Icon = config.icon;
            
            return (
              <div
                key={log.id}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  background: "var(--surface-container-low)",
                  borderLeft: `3px solid ${config.color}`,
                  animation: "fadeIn 0.2s ease",
                  alignItems: "flex-start"
                }}
              >
                <div style={{ marginTop: "0.125rem" }}>
                  <Icon size={14} color={config.color} />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
                  <span style={{ color: "var(--on-surface)", fontSize: "0.75rem", lineHeight: 1.4, wordBreak: "break-word", fontFamily: "var(--font-body)" }}>
                    {log.mensagem}
                  </span>
                  <span style={{ color: "var(--on-surface-variant)", opacity: 0.6, fontSize: "0.625rem", fontFamily: "var(--font-headline)", letterSpacing: "0.05em" }}>
                    HOJE, {log.hora}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
