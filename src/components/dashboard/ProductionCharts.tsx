"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { CustomTooltip, FadeSection } from "./primitives";
import type { RangeKey } from "./types";
import { RANGE_LABEL } from "./types";
import { useMediaQuery } from "@/lib/use-media-query";

// ─── Chart series config ──────────────────────────────────────
const SERIES = [
  { label: "Capacidade F.",    color: "var(--surface-border)", dataKey: "capacidade", gradId: "gCap",       stopColor: "#a38d7b", opacity: 0.1 },
  { label: "Demanda (Rec.)",   color: "var(--on-surface-variant)", dataKey: "recebidos", gradId: "gRecebidos", stopColor: "#c7c6c6", opacity: 0.2 },
  { label: "Produzido (Exp.)", color: "var(--primary)",        dataKey: "expedidos",  gradId: "gExpedidos", stopColor: "#f7921f", opacity: 0.35 },
];

interface Props {
  range: RangeKey;
  chartData: { label: string; recebidos: number; expedidos: number; capacidade: number }[];
}

export function ProductionCharts({ range, chartData }: Props) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const curveType = chartData.length <= 4 ? "linear" as const : "monotone" as const;

  return (
    <FadeSection delay={500}>
      <div className="card" style={{ padding: "1.5rem", height: "100%" }}>
        <div className="production-chart-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "0.75rem", flexWrap: isMobile ? "wrap" : undefined }}>
          <div>
            <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Lead Flow (Sobrecarga)</h2>
            <p className="label-sm">{RANGE_LABEL[range]} · Backlog vs Entrega</p>
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

        <ResponsiveContainer width="100%" height={isMobile ? 190 : 255}>
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
                stroke={s.color}
                strokeWidth={i === 0 ? 1 : 2.5}
                strokeDasharray={i === 0 ? "4 4" : undefined}
                fill={`url(#${s.gradId})`}
                animationDuration={800 + i * 150}
                opacity={1}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </FadeSection>
  );
}
