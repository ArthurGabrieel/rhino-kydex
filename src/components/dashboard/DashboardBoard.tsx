"use client";

import { useState } from "react";
import { TrendingUp, Target, Activity, AlertTriangle, ArrowUpRight, Clock } from "lucide-react";
import { kpis, dados7d, dados30d, dados90d, dadosYtd } from "@/lib/mock-data";
import { KpiCard, FadeSection } from "./primitives";
import { AlertasBanner } from "./AlertasBanner";
import { ProductionCharts } from "./ProductionCharts";
import { DistribuicaoBarChart } from "./DistribuicaoBarChart";
import { DATE_RANGES, RANGE_LABEL } from "./types";
import type { RangeKey } from "./types";

const RANGE_DATA: Record<RangeKey, typeof dados7d> = {
  "7d":  dados7d,
  "30d": dados30d,
  "90d": dados90d,
  "ytd": dadosYtd,
};

export function DashboardBoard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const chartData = RANGE_DATA[range];

  const metaPercent   = Math.round((kpis.pedidosMes / kpis.metaMensal) * 100);
  const receitaGrowth = Math.round(((kpis.receitaMes - kpis.receitaMesAnterior) / kpis.receitaMesAnterior) * 100);
  const pedidosGrowth = Math.round(((kpis.pedidosMes - kpis.pedidosMesAnterior) / kpis.pedidosMesAnterior) * 100);

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
              <h1 className="headline-md">Dashboard</h1>
              <span className="chip chip-active">
                <span className="live-dot" style={{ width: 5, height: 5, background: "#7ec88e", borderRadius: "50%", display: "inline-block", marginRight: 5 }} />
                LIVE
              </span>
            </div>
            <p className="label-sm">Visão operacional em tempo real · Comparado ao mês anterior</p>
          </div>

          {/* Date range pill */}
          <div style={{ display: "flex", background: "var(--surface-container-low)", padding: "3px", gap: 0 }}>
            {DATE_RANGES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                style={{
                  padding: "0.375rem 0.875rem",
                  background: range === key ? "var(--primary)" : "transparent",
                  border: "none", cursor: "pointer",
                  fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.06em",
                  fontFamily: "var(--font-headline)",
                  color: range === key ? "var(--on-primary)" : "var(--on-surface-variant)",
                  transition: "all 200ms ease",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* ── KPI row 1 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <KpiCard label="Pedidos este mês"    value={kpis.pedidosMes}      trend={pedidosGrowth} sub="vs. mês anterior"         icon={TrendingUp}   accent  delay={0}   />
          <KpiCard label="Meta mensal"          value={metaPercent}          suffix="%"            sub={`${kpis.pedidosMes} / ${kpis.metaMensal} un`} icon={Target}      accent  delay={80}  />
          <KpiCard label="Em produção agora"    value={kpis.itensEmProducao}                       sub="Pedidos ativos"           icon={Activity}             delay={160} />
          <KpiCard label="Alertas de estoque"   value={kpis.alertasAtivos}                         sub="Reposição necessária"     icon={AlertTriangle} warning delay={240} />
        </div>

        {/* ── KPI row 2 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <KpiCard label="Receita do mês"             value={kpis.receitaMes} prefix="R$ " trend={receitaGrowth} sub="vs. mês anterior"              icon={ArrowUpRight} accent delay={300} />
          <KpiCard label="Tempo médio de produção"    value={138}             suffix=" min"                       sub="Por pedido · últimas 4 semanas" icon={Clock}               delay={360} />
        </div>

        {/* ── Alertas críticos ── */}
        <AlertasBanner />

        {/* ── Area chart + Operators ── */}
        <ProductionCharts range={range} chartData={chartData} />

        {/* ── Bar chart ── */}
        <DistribuicaoBarChart range={range} chartData={chartData} />

      </div>
    </div>
  );
}
