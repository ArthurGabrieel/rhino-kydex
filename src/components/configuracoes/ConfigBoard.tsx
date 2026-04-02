"use client";

import { useMemo, useState } from "react";
import {
  Users, Bell, Activity, User
} from "lucide-react";
import type { ConfigTab } from "./types";
import { PerfilTab } from "./PerfilTab";
import { OperadoresTab } from "./OperadoresTab";
import { AlertasTab } from "./AlertasTab";
import { AuditoriaTab } from "./AuditoriaTab";
import { useSession } from "@/components/auth/SessionProvider";

const TABS: { key: ConfigTab; label: string; icon: React.ElementType }[] = [
  { key: "perfil",     label: "Meu Perfil", icon: User      },
  { key: "operadores", label: "Operadores", icon: Users     },
  { key: "alertas",    label: "Alertas",    icon: Bell      },
  { key: "auditoria",  label: "Auditoria",  icon: Activity  },
];

export function ConfigBoard() {
  const { user } = useSession();
  const [tab, setTab] = useState<ConfigTab>("perfil");

  const visibleTabs = useMemo(() => {
    if (user.role === "Colaborador") {
      return TABS.filter((item) => item.key === "perfil");
    }
    return TABS;
  }, [user.role]);

  const activeTab: ConfigTab = visibleTabs.some((item) => item.key === tab)
    ? tab
    : "perfil";

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="config-header-row" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
          <h1 className="headline-md">Configurações</h1>
          <span className="chip">Backoffice</span>
          {user.role === "Colaborador" && (
            <span className="chip" style={{ background: "rgba(255,184,119,0.12)", color: "var(--primary)" }}>
              ACESSO LIMITADO
            </span>
          )}
        </div>
        <p className="label-sm">Gestão da operação · Rhino Kydex Indústria</p>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Tab bar */}
        <div className="config-tabs-bar" style={{
          display: "flex",
          borderBottom: "1px solid rgba(85,67,53,0.2)",
          gap: 0,
        }}>
          {visibleTabs.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="config-tab-btn"
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
          {activeTab === "perfil"     && <PerfilTab />}
          {activeTab === "operadores" && <OperadoresTab />}
          {activeTab === "alertas"    && <AlertasTab />}
          {activeTab === "auditoria"  && <AuditoriaTab />}
        </div>
      </div>
    </div>
  );
}
