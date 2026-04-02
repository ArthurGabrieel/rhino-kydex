"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Factory,
  Filter,
  Package,
  Settings2,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { logAtividades, pedidos } from "@/lib/mock-data";
import { useMediaQuery } from "@/lib/use-media-query";

type AuditSection =
  | "dashboard"
  | "producao"
  | "estoque"
  | "configuracoes"
  | "acesso";

type AuditSeverity = "info" | "warn";

interface AuditEntry {
  id: string;
  hora: string;
  section: AuditSection;
  severity: AuditSeverity;
  actor: string;
  message: string;
  source: string;
}

const SECTION_ORDER: AuditSection[] = [
  "dashboard",
  "producao",
  "estoque",
  "configuracoes",
  "acesso",
];

const SECTION_META: Record<
  AuditSection,
  { label: string; color: string; icon: LucideIcon }
> = {
  dashboard: {
    label: "Dashboard",
    color: "var(--secondary)",
    icon: BarChart3,
  },
  producao: {
    label: "Produção",
    color: "var(--primary)",
    icon: Factory,
  },
  estoque: {
    label: "Estoque",
    color: "#7ec88e",
    icon: Package,
  },
  configuracoes: {
    label: "Configurações",
    color: "var(--on-surface-variant)",
    icon: Settings2,
  },
  acesso: {
    label: "Acesso",
    color: "var(--tertiary)",
    icon: Shield,
  },
};

const SEVERITY_META: Record<
  AuditSeverity,
  { label: string; color: string; bg: string }
> = {
  info: {
    label: "Informativo",
    color: "var(--on-surface-variant)",
    bg: "var(--surface-container-high)",
  },
  warn: {
    label: "Atenção",
    color: "var(--tertiary)",
    bg: "rgba(255,136,129,0.14)",
  },
};

const DASHBOARD_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "dash-1",
    hora: "14:39:12",
    section: "dashboard",
    severity: "info",
    actor: "Sistema",
    message: "Atualização automática dos KPIs do dashboard concluída.",
    source: "Dashboard",
  },
  {
    id: "dash-2",
    hora: "14:17:40",
    section: "dashboard",
    severity: "info",
    actor: "Jorge",
    message: "Painel aberto no range de 30 dias para análise operacional.",
    source: "Dashboard",
  },
  {
    id: "dash-3",
    hora: "13:58:03",
    section: "dashboard",
    severity: "info",
    actor: "Jorge",
    message: "Exportação de relatório solicitada.",
    source: "Dashboard",
  },
];

const CONFIG_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "cfg-1",
    hora: "14:26:18",
    section: "configuracoes",
    severity: "info",
    actor: "Administrador",
    message: "Limites de alertas de estoque ajustados para materiais críticos.",
    source: "Configurações",
  },
  {
    id: "cfg-2",
    hora: "14:05:27",
    section: "configuracoes",
    severity: "warn",
    actor: "Administrador",
    message: "Usuário Marcos marcado como inativo no cadastro de operadores.",
    source: "Configurações",
  },
  {
    id: "cfg-3",
    hora: "13:33:09",
    section: "configuracoes",
    severity: "info",
    actor: "Administrador",
    message: "Perfil de acesso de Ricardo atualizado para Gerente.",
    source: "Configurações",
  },
];

function normalizeHora(value: string) {
  const match = value.match(/(\d{2}:\d{2}(?::\d{2})?)/);
  if (!match) return "00:00:00";
  return match[1].length === 5 ? `${match[1]}:00` : match[1];
}

function horaToWeight(hora: string) {
  const [hh, mm, ss] = normalizeHora(hora)
    .split(":")
    .map((part) => Number(part));
  return hh * 3600 + mm * 60 + ss;
}

function getSectionFromAtividade(tipo: string): AuditSection {
  if (tipo === "auth") return "acesso";
  if (tipo === "producao") return "producao";
  return "estoque";
}

function getSeverityFromAtividade(tipo: string): AuditSeverity {
  return tipo === "alerta" ? "warn" : "info";
}

function parseActorFromMessage(message: string, fallback: string) {
  const opMatch = message.match(/Operador\s+([A-Za-zÀ-ÿ]+)/i);
  if (opMatch?.[1]) return opMatch[1];

  const porMatch = message.match(/por:\s*([A-Za-zÀ-ÿ]+)/i);
  if (porMatch?.[1]) return porMatch[1];

  const porEspacoMatch = message.match(/por\s+([A-Za-zÀ-ÿ]+)/i);
  if (porEspacoMatch?.[1]) return porEspacoMatch[1];

  return fallback;
}

function formatSource(tipo: string) {
  if (tipo === "auth") return "Acesso";
  if (tipo === "producao") return "Produção";
  if (tipo === "alerta") return "Estoque";
  if (tipo === "entrada" || tipo === "saida") return "Estoque";
  return "Sistema";
}

export function AuditoriaTab() {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [sectionFilter, setSectionFilter] = useState<AuditSection | "todas">(
    "todas"
  );
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | "todas">(
    "todas"
  );

  const atividadeEntries = useMemo<AuditEntry[]>(
    () =>
      logAtividades.map((log) => ({
        id: `atividade-${log.id}`,
        hora: normalizeHora(log.hora),
        section: getSectionFromAtividade(log.tipo),
        severity: getSeverityFromAtividade(log.tipo),
        actor: parseActorFromMessage(log.mensagem, "Sistema"),
        message: log.mensagem,
        source: formatSource(log.tipo),
      })),
    []
  );

  const kanbanEntries = useMemo<AuditEntry[]>(
    () =>
      pedidos.flatMap((pedido) =>
        (pedido.logs ?? []).map((log, index) => ({
          id: `kanban-${pedido.id}-${log.id}-${index}`,
          hora: normalizeHora(log.hora),
          section: "producao" as const,
          severity: "info" as const,
          actor: log.autor || "Sistema",
          message: `${pedido.ref}: ${log.texto}`,
          source: "Kanban",
        }))
      ),
    []
  );

  const allEntries = useMemo(
    () =>
      [
        ...DASHBOARD_AUDIT_LOGS,
        ...CONFIG_AUDIT_LOGS,
        ...atividadeEntries,
        ...kanbanEntries,
      ].sort((a, b) => horaToWeight(b.hora) - horaToWeight(a.hora)),
    [atividadeEntries, kanbanEntries]
  );

  const filteredEntries = useMemo(
    () =>
      allEntries.filter((entry) => {
        const sectionOk =
          sectionFilter === "todas" || entry.section === sectionFilter;
        const severityOk =
          severityFilter === "todas" || entry.severity === severityFilter;
        return sectionOk && severityOk;
      }),
    [allEntries, sectionFilter, severityFilter]
  );

  const summaryBySection = useMemo(
    () =>
      SECTION_ORDER.map((section) => {
        const entries = allEntries.filter((entry) => entry.section === section);
        const warningCount = entries.filter((entry) => entry.severity === "warn").length;
        return {
          section,
          total: entries.length,
          latest: entries[0]?.hora ?? "--:--:--",
          warningCount,
        };
      }),
    [allEntries]
  );

  const clearFilters = () => {
    setSectionFilter("todas");
    setSeverityFilter("todas");
  };

  const hasFilters = sectionFilter !== "todas" || severityFilter !== "todas";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          padding: "0.875rem 1.25rem",
          background: "rgba(247,146,31,0.06)",
          border: "1px solid rgba(247,146,31,0.15)",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
        }}
      >
        <Activity size={14} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--on-surface-variant)",
            lineHeight: 1.5,
          }}
        >
          Trilha unificada de auditoria com eventos de dashboard, produção, estoque,
          configurações e acesso. Todos os dados desta visão estão em modo mock,
          pensados para demonstração de governança operacional ao cliente.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        {summaryBySection.map(({ section, total, latest, warningCount }) => {
          const meta = SECTION_META[section];
          const Icon = meta.icon;
          return (
            <button
              key={section}
              onClick={() =>
                setSectionFilter((current) => (current === section ? "todas" : section))
              }
              style={{
                padding: "1rem",
                background:
                  sectionFilter === section
                    ? "var(--surface-container)"
                    : "var(--surface-container-low)",
                border:
                  sectionFilter === section
                    ? `1px solid ${meta.color}`
                    : "1px solid rgba(85,67,53,0.12)",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icon size={14} color={meta.color} />
                <span className="label-sm" style={{ fontSize: "0.625rem" }}>
                  {meta.label}
                </span>
              </div>
              <div
                style={{
                  marginTop: "0.625rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--on-surface)",
                    lineHeight: 1,
                  }}
                >
                  {total}
                </span>
                <span
                  style={{
                    fontSize: "0.625rem",
                    color: "var(--on-surface-variant)",
                    opacity: 0.8,
                  }}
                >
                  Último: {latest}
                </span>
              </div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.625rem", opacity: 0.8 }}>
                {warningCount > 0 ? (
                  <span style={{ color: "var(--tertiary)" }}>
                    {warningCount} evento(s) de atenção
                  </span>
                ) : (
                  <span style={{ color: "#7ec88e" }}>Sem alertas nesta seção</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span className="label-sm" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Filter size={12} /> Filtros
          </span>

          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            <FilterChip
              active={sectionFilter === "todas"}
              label="Todas as seções"
              onClick={() => setSectionFilter("todas")}
            />
            {SECTION_ORDER.map((section) => (
              <FilterChip
                key={section}
                active={sectionFilter === section}
                label={SECTION_META[section].label}
                onClick={() => setSectionFilter(section)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
          <FilterChip
            active={severityFilter === "todas"}
            label="Todos os níveis"
            onClick={() => setSeverityFilter("todas")}
          />
          {(Object.keys(SEVERITY_META) as AuditSeverity[]).map((severity) => (
            <FilterChip
              key={severity}
              active={severityFilter === severity}
              label={SEVERITY_META[severity].label}
              onClick={() => setSeverityFilter(severity)}
            />
          ))}

          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{
                marginLeft: "0.25rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.6875rem",
                color: "var(--tertiary)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {!isMobile && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "92px 130px 120px 1fr 98px",
              gap: "0.75rem",
              padding: "0.625rem 1rem",
              background: "var(--surface-container)",
            }}
          >
            {[
              "Hora",
              "Seção",
              "Ator",
              "Evento",
              "Nível",
            ].map((header) => (
              <span key={header} className="label-sm" style={{ fontSize: "0.5625rem" }}>
                {header}
              </span>
            ))}
          </div>
        )}

        <div style={{ maxHeight: 430, overflowY: "auto" }}>
          {filteredEntries.map((entry) => {
            const sectionMeta = SECTION_META[entry.section];
            const severityMeta = SEVERITY_META[entry.severity];
            const SectionIcon = sectionMeta.icon;

            if (isMobile) {
              return (
                <div
                  key={entry.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    borderTop: "1px solid rgba(85,67,53,0.1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        width: "fit-content",
                        padding: "0.2rem 0.45rem",
                        background: "var(--surface-container-low)",
                        color: sectionMeta.color,
                        fontSize: "0.625rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                      }}
                    >
                      <SectionIcon size={11} /> {sectionMeta.label}
                    </span>

                    <span
                      style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0.2rem 0.45rem",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: severityMeta.color,
                        background: severityMeta.bg,
                        width: "fit-content",
                      }}
                    >
                      {severityMeta.label}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                      {entry.hora}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--on-surface)", fontWeight: 600 }}>
                      {entry.actor}
                    </span>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8125rem",
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.45,
                      }}
                    >
                      {entry.message}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "0.25rem",
                        fontSize: "0.625rem",
                        color: "var(--on-surface-variant)",
                        opacity: 0.7,
                      }}
                    >
                      Origem: {entry.source}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={entry.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px 130px 120px 1fr 98px",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderTop: "1px solid rgba(85,67,53,0.1)",
                  alignItems: "start",
                }}
              >
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                  {entry.hora}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    width: "fit-content",
                    padding: "0.2rem 0.45rem",
                    background: "var(--surface-container-low)",
                    color: sectionMeta.color,
                    fontSize: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 700,
                  }}
                >
                  <SectionIcon size={11} /> {sectionMeta.label}
                </span>

                <span style={{ fontSize: "0.75rem", color: "var(--on-surface)", fontWeight: 600 }}>
                  {entry.actor}
                </span>

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8125rem",
                      color: "var(--on-surface-variant)",
                      lineHeight: 1.45,
                    }}
                  >
                    {entry.message}
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "0.25rem",
                      fontSize: "0.625rem",
                      color: "var(--on-surface-variant)",
                      opacity: 0.7,
                    }}
                  >
                    Origem: {entry.source}
                  </span>
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0.2rem 0.45rem",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: severityMeta.color,
                    background: severityMeta.bg,
                    width: "fit-content",
                  }}
                >
                  {severityMeta.label}
                </span>
              </div>
            );
          })}

          {filteredEntries.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--on-surface-variant)", opacity: 0.55 }}>
              Nenhum evento encontrado para os filtros selecionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        padding: "0.25rem 0.625rem",
        fontSize: "0.6875rem",
        cursor: "pointer",
        background: active ? "var(--surface-container-high)" : "transparent",
        color: active ? "var(--on-surface)" : "var(--on-surface-variant)",
        fontFamily: "var(--font-body)",
        fontWeight: active ? 600 : 500,
        letterSpacing: "0.02em",
        transition: "all 120ms ease",
      }}
    >
      {label}
    </button>
  );
}