"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from "recharts";
import { Zap } from "lucide-react";
import { CustomTooltip, FadeSection } from "./primitives";
import type { RangeKey } from "./types";
import { useMediaQuery } from "@/lib/use-media-query";

interface Props {
  range?: RangeKey;
  chartData: { label: string; tempoMedio: number; meta: number }[];
}

export function DistribuicaoBarChart({ range, chartData }: Props) {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <FadeSection delay={650}>
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", gap: "0.75rem", flexWrap: isMobile ? "wrap" : undefined }}>
          <div>
            <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>OEE & Gargalos Setoriais (SLA)</h2>
            <p className="label-sm">Tempo médio de ciclo (horas) vs Meta máxima permitida</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={12} color="var(--tertiary)" />
            <span className="label-sm" style={{ color: "var(--tertiary)", fontSize: "0.625rem", fontWeight: 600 }}>
              ACABAMENTO EM ALERTA
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={isMobile ? 180 : 160}>
          <BarChart
            data={chartData}
            layout="vertical"
            barCategoryGap="25%"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="none" stroke="rgba(85,67,53,0.08)" horizontal={false} vertical={true} />
            <XAxis
              type="number"
              tick={{ fontSize: isMobile ? 8 : 9, fill: "#a38d7b", fontFamily: "Inter" }}
              axisLine={false} tickLine={false}
              domain={[0, 'dataMax + 2']}
            />
            <YAxis 
              type="category" 
              dataKey="label" 
              tick={{ fontSize: isMobile ? 8 : 9, fill: "#a38d7b", fontFamily: "Inter", fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false} 
              width={isMobile ? 70 : 85} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="tempoMedio" name="Tempo Real (Horas)">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.tempoMedio > entry.meta ? "var(--tertiary)" : "var(--primary)"} 
                />
              ))}
            </Bar>
            <Bar dataKey="meta" name="Target SLA (Horas)" fill="var(--surface-border)" barSize={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </FadeSection>
  );
}
