"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const BUILD = "2.4.1";
const DATA_BUILD = "01/04/2026";

// Simula uptime crescente
function useUptime() {
  const [seconds, setSeconds] = useState(14 * 3600 + 22 * 60 + 8);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${String(m).padStart(2, "0")}min ${String(s).padStart(2, "0")}s`;
}

function InfoRow({ label, value, mono = false, ok }: {
  label: string; value: string; mono?: boolean; ok?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      gap: "1rem",
      padding: "0.5rem 0",
      borderBottom: "1px solid rgba(85,67,53,0.1)",
      fontSize: "0.8125rem",
      alignItems: "center",
    }}>
      <span style={{ color: "var(--primary)", opacity: 0.7, minWidth: 200, flexShrink: 0, fontFamily: "monospace", fontSize: "0.75rem" }}>
        {label}
      </span>
      <span style={{ fontFamily: mono ? "monospace" : "var(--font-body)", color: "var(--on-surface-variant)", flex: 1 }}>
        {value}
      </span>
      {ok !== undefined && (
        <CheckCircle size={13} color={ok ? "#7ec88e" : "var(--tertiary)"} />
      )}
    </div>
  );
}

export function SistemaTab() {
  const uptime = useUptime();

  const now = new Date().toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Status geral */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          { label: "Status do sistema",  value: "OPERACIONAL",        color: "#7ec88e" },
          { label: "Versão do backoffice", value: `v${BUILD}`,        color: "var(--primary)" },
          { label: "Último deploy",       value: DATA_BUILD,          color: "var(--on-surface-variant)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: "1rem 1.25rem" }}>
            <div className="label-sm" style={{ marginBottom: "0.5rem" }}>{label}</div>
            <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Dados operacionais */}
      <div className="card">
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Informações Operacionais</h2>
          <p className="label-sm">Estado atual do sistema em tempo real</p>
        </div>

        <InfoRow label="SISTEMA"           value="Rhino Kydex Backoffice" mono   ok={true}  />
        <InfoRow label="VERSÃO"            value={`v${BUILD} (build ${DATA_BUILD})`} mono     />
        <InfoRow label="UPTIME"            value={uptime}                  mono             />
        <InfoRow label="DATA/HORA ATUAL"   value={now}                     mono             />
        <InfoRow label="OPERADOR_ATIVO"    value="Jorge Matos · Sessão #4821"      ok={true}  />
        <InfoRow label="PEDIDOS_HOJE"      value="34 processados"          mono             />
        <InfoRow label="ESTOQUE_CRÍTICO"   value="1 item abaixo do mínimo"         ok={false} />
        <InfoRow label="DADOS"             value="Em memória (mock)" mono                   />
      </div>

      {/* Log de eventos recentes */}
      <div className="card">
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Log de Eventos Recentes</h2>
          <p className="label-sm">Últimas ações registradas no sistema</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { hora: "14:32:18", msg: "PED-2380 concluído → Expedição por JORGE",               tipo: "ok"    },
            { hora: "14:21:05", msg: "Saída de estoque: FIN-GLK-17 (-2 UN) por JORGE",         tipo: "info"  },
            { hora: "14:18:22", msg: "ALERTA: KY-BLK-02 abaixo do mínimo (8/20 FLS)",          tipo: "warn"  },
            { hora: "14:10:45", msg: "Entrada de estoque: HW-CHI-025 (+1000 UN) — TAC SUPPLY", tipo: "ok"    },
            { hora: "13:55:12", msg: "Login: JORGE — Sessão SES-4821 iniciada",                tipo: "info"  },
            { hora: "13:22:10", msg: "PRÉ-AVISO: KY-GRN-02 próximo do mínimo (14/15 FLS)",    tipo: "warn"  },
          ].map(({ hora, msg, tipo }) => {
            const color = tipo === "ok" ? "#7ec88e" : tipo === "warn" ? "var(--tertiary)" : "var(--on-surface-variant)";
            return (
              <div key={hora + msg} className="log-entry">
                <span className="log-time">{hora}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color }}>{msg}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
