"use client";

import { useState } from "react";
import { TrendingUp, Target, Activity, AlertTriangle, ArrowUpRight, Clock, Download, Loader2 } from "lucide-react";
import { kpis, leadFlow7d, leadFlow30d, leadFlow90d, leadFlowYtd, slaData } from "@/lib/mock-data";
import { KpiCard } from "./primitives";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { AlertasBanner } from "./AlertasBanner";
import { ProductionCharts } from "./ProductionCharts";
import { RankingPanel } from "./RankingPanel";
import { DistribuicaoBarChart } from "./DistribuicaoBarChart";
import { ProductHighlightCard } from "./ProductHighlightCard";
import { DATE_RANGES } from "./types";
import type { RangeKey } from "./types";
import { useMediaQuery } from "@/lib/use-media-query";

const RANGE_DATA: Record<RangeKey, typeof leadFlow7d> = {
  "7d":  leadFlow7d,
  "30d": leadFlow30d,
  "90d": leadFlow90d,
  "ytd": leadFlowYtd,
};

export function DashboardBoard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();
  const chartData = RANGE_DATA[range];
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const metaPercent   = Math.round((kpis.pedidosMes / kpis.metaMensal) * 100);
  const receitaGrowth = Math.round(((kpis.receitaMes - kpis.receitaMesAnterior) / kpis.receitaMesAnterior) * 100);
  const pedidosGrowth = Math.round(((kpis.pedidosMes - kpis.pedidosMesAnterior) / kpis.pedidosMesAnterior) * 100);

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="dashboard-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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

          <div className="dashboard-header-actions" style={{ display: "flex", gap: "1rem", alignSelf: "center" }}>
            {/* Export button */}
            <Button
              variant="secondary"
              onClick={() => setIsExportModalOpen(true)}
              className="dashboard-export-btn"
              style={{
                padding: "0.625rem 1.125rem",
                fontSize: "0.6875rem",
                border: "1px solid var(--outline-variant)"
              }}
            >
              <Download size={14} />
              Exportar
            </Button>

            {/* Date range pill */}
            <div className="dashboard-range-pill" style={{ display: "flex", background: "var(--surface-container-low)", padding: "4px", gap: 0 }}>
              {DATE_RANGES.map(({ key, label }) => (
                <Button
                  key={key}
                  variant={range === key ? "primary" : "secondary"}
                  onClick={() => setRange(key)}
                  className="dashboard-range-btn"
                  style={{
                    padding: "0.625rem 1.125rem",
                    border: "none", cursor: "pointer",
                    fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em",
                    transition: "all 200ms ease",
                    minWidth: 48,
                    borderRadius: 0
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* ── KPI row 1 ── */}
        <div className="dashboard-kpis-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <KpiCard label="Pedidos este mês"    value={kpis.pedidosMes}      trend={pedidosGrowth} sub="vs. mês anterior"         icon={TrendingUp}   accent  delay={0}   />
          <KpiCard label="Meta mensal"          value={metaPercent}          suffix="%"            sub={`${kpis.pedidosMes} / ${kpis.metaMensal} un`} icon={Target}      accent  delay={80}  />
          <KpiCard label="Em produção agora"    value={kpis.itensEmProducao}                       sub="Pedidos ativos"           icon={Activity}             delay={160} />
          <KpiCard label="Alertas de estoque"   value={kpis.alertasAtivos}                         sub="Reposição necessária"     icon={AlertTriangle} warning delay={240} />
        </div>

        {/* ── KPI row 2 ── */}
        <div className="dashboard-kpis-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <KpiCard label="Receita do mês"             value={kpis.receitaMes} prefix="R$ " trend={receitaGrowth} sub="vs. mês anterior"              icon={ArrowUpRight} accent delay={300} />
          <KpiCard label="Tempo médio de produção"    value={138}             suffix=" min"                       sub="Por pedido · últimas 4 semanas" icon={Clock}               delay={360} />
        </div>

        {/* ── Alertas críticos ── */}
        <AlertasBanner />

        {/* ── Main Layout Split ── */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "66% 1fr", gap: "1.5rem", alignItems: "start" }}>
          
          {/* Left Column: Visualizações de Dados (Charts) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: 0 }}>
            <ProductionCharts range={range} chartData={chartData} />
            <DistribuicaoBarChart chartData={slaData} />
          </div>

          {/* Right Column: Produto e Pessoas (Wow factor + Gamification) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: 0 }}>
            <ProductHighlightCard />
            <RankingPanel />
          </div>

        </div>
      </div>

      {/* ── Export Modal ── */}
      <Modal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Confirmar Exportação"
        subtitle="Gerar relatório de atividades Excel"
        width={420}
      >
        <p className="body-md" style={{ marginBottom: "2rem" }}>
          Tem certeza de que deseja exportar os dados do período selecionado de <strong>{range}</strong>? Esta ação processará todo o histórico operacional e gerará um arquivo XLS formatado.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button
            variant="secondary"
            onClick={() => setIsExportModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? "wait" : "pointer" }}
            onClick={() => {
              setIsExporting(true);
              // TODO: Integração real da exportação aqui
              setTimeout(() => {
                setIsExporting(false);
                setIsExportModalOpen(false);
                showToast("Exportação de dados concluída com sucesso.", "success");
              }, 1500);
            }}
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isExporting ? "Processando..." : "Confirmar Exportação"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
