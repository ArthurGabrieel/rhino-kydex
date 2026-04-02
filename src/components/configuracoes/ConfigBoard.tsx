"use client";

import { useState } from "react";
import {
  Users, Bell, Activity, User
} from "lucide-react";
import type { ConfigTab } from "./types";
import { PerfilTab } from "./PerfilTab";
import { OperadoresTab } from "./OperadoresTab";
import { AlertasTab } from "./AlertasTab";
import { SistemaTab } from "./SistemaTab";

const TABS: { key: ConfigTab; label: string; icon: React.ElementType }[] = [
  { key: "perfil",     label: "Meu Perfil", icon: User      },
  { key: "operadores", label: "Operadores", icon: Users     },
  { key: "alertas",    label: "Alertas",    icon: Bell      },
  { key: "sistema",    label: "Sistema",    icon: Activity  },
];

export function ConfigBoard() {
  const [tab, setTab] = useState<ConfigTab>("perfil");

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
          <h1 className="headline-md">Configurações</h1>
          <span className="chip">Backoffice</span>
        </div>
        <p className="label-sm">Gestão da operação · Rhino Kydex Indústria</p>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Tab bar */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid rgba(85,67,53,0.2)",
          gap: 0,
        }}>
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  background: "transparent",
                  border: "none",
                  borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                  marginBottom: -1,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--primary)" : "var(--on-surface-variant)",
                  transition: "all 150ms ease",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div>
          {tab === "perfil"     && <PerfilTab />}
          {tab === "operadores" && <OperadoresTab />}
          {tab === "alertas"    && <AlertasTab />}
          {tab === "sistema"    && <SistemaTab />}
        </div>
      </div>
    </div>
  );
}
