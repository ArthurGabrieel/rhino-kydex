"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";
import { operadores, kpis } from "@/lib/mock-data";
import { CustomTooltip, FadeSection } from "./primitives";
import type { RangeKey } from "./types";
import { RANGE_LABEL } from "./types";

const SERIES = [
  { label: "Moldagem",   color: "var(--primary)", dataKey: "moldagem",   gradId: "gMoldagem",   stopColor: "#ffb877", opacity: 0.28 },
  { label: "Acabamento", color: "#c7c6c6",         dataKey: "acabamento", gradId: "gAcabamento", stopColor: "#c7c6c6", opacity: 0.18 },
  { label: "Expedição",  color: "#7ec88e",         dataKey: "expedicao",  gradId: "gExpedicao",  stopColor: "#7ec88e", opacity: 0.18 },
];

interface Props {
  range: RangeKey;
  chartData: { label: string; moldagem: number; acabamento: number; expedicao: number }[];
}

export function ProductionCharts({ range, chartData }: Props) {
  const curveType = chartData.length <= 4 ? "linear" as const : "monotone" as const;

  const metaPercent = Math.round((kpis.pedidosMes / kpis.metaMensal) * 100);
  const [metaWidth, setMetaWidth] = useState(0);
  const [opWidths, setOpWidths] = useState<number[]>(operadores.map(() => 0));

  useEffect(() => {
    const t1 = setTimeout(() => setMetaWidth(metaPercent), 600);
    const t2 = setTimeout(() => setOpWidths(operadores.map((o) => o.eficiencia)), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [metaPercent]);

  return (
    <FadeSection delay={500}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem" }}>

        {/* ── Area chart ── */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Tendências de Produção</h2>
              <p className="label-sm">{RANGE_LABEL[range]} · por fase</p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              {SERIES.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <div style={{ width: 8, height: 2, background: s.color }} />
                  <span className="label-sm" style={{ fontSize: "0.5625rem" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.gradId} id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={s.stopColor} stopOpacity={s.opacity} />
                    <stop offset="95%" stopColor={s.stopColor} stopOpacity={0}         />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="none" stroke="rgba(85,67,53,0.1)" horizontal vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#a38d7b", fontFamily: "Inter", letterSpacing: "0.04em" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#a38d7b", fontFamily: "Inter" }} axisLine={false} tickLine={false} />
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

        {/* ── Operators panel ── */}
        <div className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 className="title-md">Performance</h2>
            <Users size={14} color="var(--on-surface-variant)" />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {operadores.map((op, i) => (
              <div key={op.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{
                      width: 28, height: 28,
                      background: i === 0 ? "rgba(247,146,31,0.15)" : "var(--surface-container-highest)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-headline)", fontSize: "0.5625rem", fontWeight: 700,
                      color: i === 0 ? "var(--primary)" : "var(--on-surface-variant)",
                    }}>
                      {op.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{op.nome}</div>
                      <div className="label-sm" style={{ fontSize: "0.6rem" }}>{op.nivel} · {op.coldres} coldres</div>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-headline)", fontSize: "0.9375rem", fontWeight: 700,
                    color: i === 0 ? "var(--primary)" : "var(--on-surface)",
                  }}>
                    {op.eficiencia}%
                  </span>
                </div>

                <div style={{ height: 3, background: "var(--surface-container-highest)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${opWidths[i]}%`,
                    background: i === 0
                      ? "linear-gradient(90deg, #ffb877, #f7921f)"
                      : i === 1 ? "var(--secondary)" : "var(--surface-bright)",
                    transition: `width ${700 + i * 150}ms cubic-bezier(0.4,0,0.2,1)`,
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Meta block */}
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--surface-container-lowest)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.625rem" }}>
              <span className="label-sm">Meta do Mês</span>
              <span style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--primary)" }}>
                {metaPercent}%
              </span>
            </div>
            <div style={{ height: 5, background: "var(--surface-container-highest)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${metaWidth}%`,
                background: "linear-gradient(90deg, #ffb877, #f7921f)",
                transition: "width 1200ms cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.375rem" }}>
              <span className="label-sm" style={{ fontSize: "0.5625rem" }}>{kpis.pedidosMes} concluídos</span>
              <span className="label-sm" style={{ fontSize: "0.5625rem" }}>Meta: {kpis.metaMensal}</span>
            </div>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}
