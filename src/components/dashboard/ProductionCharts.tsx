"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, Cell,
} from "recharts";
import { Users, User, Target, ChevronUp, ChevronDown, TrendingUp } from "lucide-react";
import { metasPorPessoa, metasEquipe } from "@/lib/mock-data";
import { CustomTooltip, FadeSection, useCountUp } from "./primitives";
import type { RangeKey } from "./types";
import { RANGE_LABEL } from "./types";
import { useMediaQuery } from "@/lib/use-media-query";
import Modal from "@/components/ui/Modal";

// ─── Chart series config ──────────────────────────────────────
const SERIES = [
  { label: "Moldagem",   color: "var(--primary)", dataKey: "moldagem",   gradId: "gMoldagem",   stopColor: "#ffb877", opacity: 0.28 },
  { label: "Acabamento", color: "#c7c6c6",         dataKey: "acabamento", gradId: "gAcabamento", stopColor: "#c7c6c6", opacity: 0.18 },
  { label: "Expedição",  color: "#7ec88e",         dataKey: "expedicao",  gradId: "gExpedicao",  stopColor: "#7ec88e", opacity: 0.18 },
];

// ─── Custom tooltip for the team bar chart ───────────────────
const MetaTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface-container-highest)",
      border: "1px solid rgba(85,67,53,0.25)",
      padding: "0.75rem 1rem",
      fontSize: "0.75rem",
      fontFamily: "var(--font-body)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    }}>
      <p style={{
        color: "var(--on-surface-variant)", marginBottom: "0.5rem",
        fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontSize: "0.5625rem",
      }}>
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} style={{ marginBottom: 2, display: "flex", gap: 8, justifyContent: "space-between" }}>
          <span style={{ color: p.color, opacity: 0.8 }}>{p.name}</span>
          <span style={{ color: p.color, fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Team view (compact — lives in the sidebar panel) ────────
function EquipeView() {
  const [animated, setAnimated] = useState(false);
  const realizadoMesAnim = useCountUp(metasEquipe.realizadoMes, 900, 200);
  const realizadoHojeAnim = useCountUp(metasEquipe.realizadoHoje, 900, 300);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const mesPercent  = Math.round((metasEquipe.realizadoMes  / metasEquipe.metaMensal) * 100);
  const diaPercent  = Math.round((metasEquipe.realizadoHoje / metasEquipe.metaDiaria) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── KPI cards: hoje + mês ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
        {/* Hoje */}
        <div style={{ padding: "0.875rem", background: "var(--surface-container-lowest)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
            <span className="label-sm" style={{ fontSize: "0.5rem" }}>Hoje</span>
            <span style={{
              fontFamily: "var(--font-headline)", fontSize: "0.625rem", fontWeight: 700,
              color: diaPercent >= 100 ? "#7ec88e" : diaPercent >= 70 ? "var(--primary)" : "var(--tertiary)",
            }}>{diaPercent}%</span>
          </div>
          <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, lineHeight: 1, marginBottom: "0.5rem" }}>
            {realizadoHojeAnim}
            <span style={{ fontSize: "0.6875rem", color: "var(--on-surface-variant)", fontWeight: 400, marginLeft: "0.2rem" }}>
              /{metasEquipe.metaDiaria}
            </span>
          </div>
          <div style={{ height: 3, background: "var(--surface-container-highest)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: animated ? `${Math.min(diaPercent, 100)}%` : "0%",
              background: diaPercent >= 100 ? "#7ec88e" : "linear-gradient(90deg, #ffb877, #f7921f)",
              transition: "width 1000ms cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
          <div className="label-sm" style={{ marginTop: "0.3rem", fontSize: "0.4375rem" }}>coldres hoje</div>
        </div>

        {/* Mês */}
        <div style={{ padding: "0.875rem", background: "var(--surface-container-lowest)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
            <span className="label-sm" style={{ fontSize: "0.5rem" }}>Mês</span>
            <span style={{
              fontFamily: "var(--font-headline)", fontSize: "0.625rem", fontWeight: 700,
              color: mesPercent >= 100 ? "#7ec88e" : mesPercent >= 70 ? "var(--primary)" : "var(--tertiary)",
            }}>{mesPercent}%</span>
          </div>
          <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, lineHeight: 1, marginBottom: "0.5rem" }}>
            {realizadoMesAnim}
            <span style={{ fontSize: "0.6875rem", color: "var(--on-surface-variant)", fontWeight: 400, marginLeft: "0.2rem" }}>
              /{metasEquipe.metaMensal}
            </span>
          </div>
          <div style={{ height: 3, background: "var(--surface-container-highest)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: animated ? `${Math.min(mesPercent, 100)}%` : "0%",
              background: mesPercent >= 100 ? "#7ec88e" : "linear-gradient(90deg, #ffb877, #f7921f)",
              transition: "width 1200ms cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
          <div className="label-sm" style={{ marginTop: "0.3rem", fontSize: "0.4375rem" }}>meta: {metasEquipe.metaMensal}</div>
        </div>
      </div>

      {/* ── Realizado vs Meta — últimos 7 dias ── */}
      <div>
        <p className="label-sm" style={{ marginBottom: "0.625rem", fontSize: "0.5rem" }}>Realizado vs Meta — últimos 7 dias</p>
        <ResponsiveContainer width="100%" height={82}>
          <BarChart data={metasEquipe.tendenciaSemana} barGap={2} barCategoryGap="32%">
            <XAxis
              dataKey="label"
              tick={{ fontSize: 8, fill: "#a38d7b", fontFamily: "Inter", letterSpacing: "0.03em" }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<MetaTooltip />} />
            <ReferenceLine y={metasEquipe.metaDiaria} stroke="rgba(255,184,119,0.2)" strokeDasharray="3 3" />
            <Bar dataKey="realizado" name="Realizado" radius={0} maxBarSize={20}>
              {metasEquipe.tendenciaSemana.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.realizado >= entry.meta ? "#7ec88e"
                    : entry.label === "Hoje" ? "#f7921f"
                    : "rgba(255,184,119,0.45)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Per-person modal content ─────────────────────────────────
function PessoaModalContent() {
  const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Hoje"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Summary totals row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "0.75rem",
        marginBottom: "1.5rem",
      }}>
        {[
          { label: "Total hoje", value: metasEquipe.realizadoHoje, meta: metasEquipe.metaDiaria,  suffix: ` / ${metasEquipe.metaDiaria}` },
          { label: "Meta diária", value: metasEquipe.metaDiaria,   meta: metasEquipe.metaDiaria,  suffix: " coldres/dia" },
          { label: "Total mês",   value: metasEquipe.realizadoMes,  meta: metasEquipe.metaMensal, suffix: ` / ${metasEquipe.metaMensal}` },
          { label: "Meta mensal", value: metasEquipe.metaMensal,    meta: metasEquipe.metaMensal, suffix: " coldres" },
        ].map((stat) => {
          const pct = Math.round((stat.value / stat.meta) * 100);
          return (
            <div key={stat.label} style={{ padding: "0.875rem", background: "var(--surface-container-lowest)" }}>
              <div className="label-sm" style={{ fontSize: "0.5rem", marginBottom: "0.375rem" }}>{stat.label}</div>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1, color: "var(--primary)" }}>
                {stat.value}
              </div>
              <div className="label-sm" style={{ marginTop: "0.25rem", fontSize: "0.5rem", color: "var(--on-surface-variant)" }}>
                {stat.suffix}
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-person table */}
      <table className="table" style={{ tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "160px" }} />
          <col style={{ width: "60px" }} />
          <col style={{ width: "60px" }} />
          {/* 7 day cols */}
          {DAYS.map((d) => <col key={d} />)}
          <col style={{ width: "80px" }} />
          <col style={{ width: "80px" }} />
          <col style={{ width: "52px" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Operador</th>
            <th style={{ textAlign: "center" }}>Meta / dia</th>
            <th style={{ textAlign: "center" }}>Meta / mês</th>
            {DAYS.map((d) => (
              <th key={d} style={{ textAlign: "center", fontSize: "0.5rem", color: d === "Hoje" ? "var(--primary)" : undefined }}>
                {d}
              </th>
            ))}
            <th style={{ textAlign: "right" }}>Mês atual</th>
            <th style={{ textAlign: "right" }}>% mensal</th>
          </tr>
        </thead>
        <tbody>
          {metasPorPessoa.map((op, i) => {
            const mesPercent = Math.round((op.realizadoMes / op.metaMensal) * 100);
            const diaPercent = Math.round((op.realizadoHoje / op.metaDiaria) * 100);
            const isLead = i === 0;

            const diaColor =
              diaPercent >= 100 ? "#7ec88e"
              : diaPercent >= 70 ? "var(--primary)"
              : "var(--tertiary)";

            const mesColor =
              mesPercent >= 100 ? "#7ec88e"
              : mesPercent >= 70 ? "var(--on-surface)"
              : "var(--tertiary)";

            return (
              <tr key={op.operadorId} style={{
                background: isLead ? "rgba(247,146,31,0.04)" : undefined,
              }}>
                {/* Name */}
                <td style={{ borderLeft: isLead ? "2px solid var(--primary-container)" : "2px solid transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{
                      width: 26, height: 26, flexShrink: 0,
                      background: isLead ? "rgba(247,146,31,0.15)" : "var(--surface-container-highest)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-headline)", fontSize: "0.5rem", fontWeight: 700,
                      color: isLead ? "var(--primary)" : "var(--on-surface-variant)",
                    }}>
                      {op.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{op.nome}</div>
                      <div className="label-sm" style={{ fontSize: "0.5rem" }}>{op.nivel}</div>
                    </div>
                  </div>
                </td>

                {/* Meta diária */}
                <td style={{ textAlign: "center", fontFamily: "var(--font-headline)", fontWeight: 700 }}>
                  {op.metaDiaria}
                </td>

                {/* Meta mensal */}
                <td style={{ textAlign: "center", fontFamily: "var(--font-headline)", fontWeight: 700 }}>
                  {op.metaMensal}
                </td>

                {/* 7 day sparkbar cells */}
                {op.tendenciaSemana.map((v, di) => {
                  const pct = Math.round((v / op.metaDiaria) * 100);
                  const isToday = di === 6;
                  const barColor =
                    isToday ? "var(--primary)"
                    : pct >= 100 ? "#7ec88e"
                    : pct >= 70 ? "rgba(255,184,119,0.7)"
                    : "rgba(255,100,100,0.5)";
                  return (
                    <td key={di} style={{ textAlign: "center", padding: "0.5rem 0.25rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                        {/* mini bar */}
                        <div style={{ width: "100%", height: 28, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                          <div style={{
                            width: "70%",
                            height: `${Math.min(pct, 100)}%`,
                            minHeight: v > 0 ? 4 : 0,
                            background: barColor,
                            transition: "height 600ms ease",
                          }} />
                        </div>
                        <span style={{
                          fontSize: "0.5rem", fontWeight: isToday ? 700 : 400,
                          color: isToday ? "var(--primary)" : "var(--on-surface-variant)",
                        }}>
                          {v}
                        </span>
                      </div>
                    </td>
                  );
                })}

                {/* Mês realizado */}
                <td style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: "var(--font-headline)", fontWeight: 700, color: mesColor, fontSize: "0.9375rem" }}>
                    {op.realizadoMes}
                  </span>
                  <span style={{ color: "var(--on-surface-variant)", fontSize: "0.6875rem" }}>
                    /{op.metaMensal}
                  </span>
                </td>

                {/* % mensal com mini progress */}
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                    <span style={{
                      fontFamily: "var(--font-headline)", fontWeight: 700,
                      fontSize: "0.8125rem", color: mesColor,
                      display: "flex", alignItems: "center", gap: "0.2rem",
                    }}>
                      {mesPercent >= 100
                        ? <ChevronUp size={11} color="#7ec88e" />
                        : mesPercent < 60
                        ? <ChevronDown size={11} color="var(--tertiary)" />
                        : null
                      }
                      {mesPercent}%
                    </span>
                    <div style={{ width: 52, height: 3, background: "var(--surface-container-highest)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min(mesPercent, 100)}%`,
                        background: mesColor,
                        transition: "width 800ms ease",
                      }} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────
interface Props {
  range: RangeKey;
  chartData: { label: string; moldagem: number; acabamento: number; expedicao: number }[];
}

// ─── Main component ──────────────────────────────────────────
export function ProductionCharts({ range, chartData }: Props) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const curveType = chartData.length <= 4 ? "linear" as const : "monotone" as const;

  const [pessoaModalOpen, setPessoaModalOpen] = useState(false);

  return (
    <>
      <FadeSection delay={500}>
        <div className="production-charts-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: "1rem" }}>

          {/* ── Area chart ── */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <div className="production-chart-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "0.75rem", flexWrap: isMobile ? "wrap" : undefined }}>
              <div>
                <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Tendências de Produção</h2>
                <p className="label-sm">{RANGE_LABEL[range]} · por fase</p>
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {SERIES.map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <div style={{ width: 8, height: 2, background: s.color }} />
                    <span className="label-sm" style={{ fontSize: "0.5625rem" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={isMobile ? 190 : 220}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: isMobile ? -10 : -24, bottom: 0 }}>
                <defs>
                  {SERIES.map((s) => (
                    <linearGradient key={s.gradId} id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={s.stopColor} stopOpacity={s.opacity} />
                      <stop offset="95%" stopColor={s.stopColor} stopOpacity={0}         />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="none" stroke="rgba(85,67,53,0.1)" horizontal vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: isMobile ? 9 : 10, fill: "#a38d7b", fontFamily: "Inter", letterSpacing: "0.04em" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: isMobile ? 9 : 10, fill: "#a38d7b", fontFamily: "Inter" }} axisLine={false} tickLine={false} width={isMobile ? 20 : 28} />
                <Tooltip content={<CustomTooltip />} />
                {SERIES.map((s, i) => (
                  <Area
                    key={s.dataKey}
                    type={curveType}
                    dataKey={s.dataKey}
                    name={s.label}
                    stroke={s.stopColor}
                    strokeWidth={2}
                    fill={`url(#${s.gradId})`}
                    animationDuration={800 + i * 100}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── Metas panel (team view only — compact) ── */}
          <div className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Target size={14} color="var(--primary)" />
                <h2 className="title-md">Metas</h2>
              </div>

              {/* Ver por pessoa → abre modal */}
              <button
                onClick={() => setPessoaModalOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.3125rem 0.625rem",
                  background: "var(--surface-container-lowest)",
                  border: "1px solid rgba(85,67,53,0.25)",
                  color: "var(--on-surface-variant)",
                  cursor: "pointer",
                  fontFamily: "var(--font-headline)", fontSize: "0.5rem",
                  fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(85,67,53,0.25)";
                  e.currentTarget.style.color = "var(--on-surface-variant)";
                }}
              >
                <User size={10} />
                Por pessoa
                <TrendingUp size={10} />
              </button>
            </div>

            {/* Team compact view */}
            <div style={{ flex: 1 }}>
              <EquipeView />
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ── Modal: detalhamento por pessoa ── */}
      <Modal
        open={pessoaModalOpen}
        onClose={() => setPessoaModalOpen(false)}
        title="Metas por Pessoa"
        subtitle={`Detalhamento individual — diária e mensal · ${metasPorPessoa.length} operadores`}
        width={920}
      >
        <PessoaModalContent />
      </Modal>
    </>
  );
}
