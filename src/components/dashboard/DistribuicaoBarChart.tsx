"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Zap } from "lucide-react";
import { CustomTooltip, FadeSection } from "./primitives";
import type { RangeKey } from "./types";

interface Props {
  range: RangeKey;
  chartData: { label: string; moldagem: number; acabamento: number; expedicao: number }[];
}

export function DistribuicaoBarChart({ range, chartData }: Props) {
  return (
    <FadeSection delay={650}>
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Distribuição por Fase</h2>
            <p className="label-sm">Volume comparado por etapa de produção</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={12} color="var(--primary)" />
            <span className="label-sm" style={{ color: "var(--primary)", fontSize: "0.625rem" }}>
              PERÍODO: {range.toUpperCase()}
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={chartData.length >= 10 ? 160 : 130}>
          <BarChart
            data={chartData}
            barCategoryGap={chartData.length <= 7 ? "40%" : "30%"}
            margin={{ top: 0, right: 0, left: -24, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="none" stroke="rgba(85,67,53,0.08)" horizontal vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#a38d7b", fontFamily: "Inter", letterSpacing: "0.04em" }}
              axisLine={false} tickLine={false}
              interval={chartData.length > 8 ? 1 : 0}
            />
            <YAxis tick={{ fontSize: 9, fill: "#a38d7b" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="moldagem"   name="Moldagem"   fill="#ffb877" radius={[0,0,0,0]} animationDuration={800}  />
            <Bar dataKey="acabamento" name="Acabamento" fill="#c7c6c6" radius={[0,0,0,0]} animationDuration={900}  />
            <Bar dataKey="expedicao"  name="Expedição"  fill="#7ec88e" radius={[0,0,0,0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </FadeSection>
  );
}
