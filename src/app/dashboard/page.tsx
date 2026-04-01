"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Users,
  Target,
  Activity,
  ChevronUp,
  Bell,
} from "lucide-react";
import {
  kpis,
  operadores,
  vendasSemanais,
  alertas,
} from "@/lib/mock-data";

// ─── KPI Card ────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = false,
  warning = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className="card animate-fade-in"
      style={{
        position: "relative",
        overflow: "hidden",
        borderLeft: accent
          ? "2px solid var(--primary-container)"
          : warning
          ? "2px solid var(--tertiary-container)"
          : "2px solid transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <span className="label-sm">{label}</span>
        <div
          style={{
            width: 32,
            height: 32,
            background: accent
              ? "rgba(247,146,31,0.12)"
              : warning
              ? "rgba(255,136,129,0.12)"
              : "var(--surface-container-highest)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            size={15}
            color={
              accent
                ? "var(--primary)"
                : warning
                ? "var(--tertiary)"
                : "var(--on-surface-variant)"
            }
          />
        </div>
      </div>

      <div
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "2.25rem",
          fontWeight: 700,
          color: accent
            ? "var(--primary)"
            : warning
            ? "var(--tertiary)"
            : "var(--on-surface)",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}
      >
        {value}
      </div>

      {sub && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--on-surface-variant)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          {accent && <ChevronUp size={12} color="var(--primary)" />}
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--surface-container-highest)",
          border: "1px solid rgba(85,67,53,0.3)",
          padding: "0.75rem 1rem",
          fontSize: "0.75rem",
          fontFamily: "var(--font-body)",
        }}
      >
        <p
          style={{
            color: "var(--on-surface-variant)",
            marginBottom: "0.5rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        {payload.map((p: any) => (
          <div
            key={p.name}
            style={{ color: p.color, marginBottom: 2, display: "flex", gap: 8 }}
          >
            <span style={{ opacity: 0.7 }}>{p.name}:</span>
            <span style={{ fontWeight: 600 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Page ────────────────────────────────────────────────
export default function DashboardPage() {
  const metaPercent = Math.round((kpis.pedidosMes / kpis.metaMensal) * 100);
  const receitaGrowth = Math.round(
    ((kpis.receitaMes - kpis.receitaMesAnterior) / kpis.receitaMesAnterior) * 100
  );
  const pedidosGrowth = Math.round(
    ((kpis.pedidosMes - kpis.pedidosMesAnterior) / kpis.pedidosMesAnterior) * 100
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
              <h1 className="headline-md">Dashboard</h1>
              <span className="chip chip-active">Visão Estratégica</span>
            </div>
            <p className="label-sm">
              Visão Estratégica v.4.0.2 · Comparado ao mês anterior
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Alerts badge */}
            <div style={{ position: "relative" }}>
              <button
                className="btn-secondary"
                style={{ padding: "0.5rem 0.875rem", gap: "0.375rem" }}
              >
                <Bell size={14} />
                Alertas
              </button>
              {alertas.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    background: "var(--tertiary-container)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: "var(--on-tertiary)",
                  }}
                >
                  {alertas.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* KPI Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          <KpiCard
            label="Pedidos este mês"
            value={kpis.pedidosMes}
            sub={`+${pedidosGrowth}% vs. mês anterior`}
            icon={TrendingUp}
            accent
          />
          <KpiCard
            label="Meta mensal"
            value={`${metaPercent}%`}
            sub={`${kpis.pedidosMes} / ${kpis.metaMensal} unidades`}
            icon={Target}
            accent
          />
          <KpiCard
            label="Em produção"
            value={kpis.itensEmProducao}
            sub="Pedidos ativos no sistema"
            icon={Activity}
          />
          <KpiCard
            label="Alertas ativos"
            value={kpis.alertasAtivos}
            sub="Reposição imediata necessária"
            icon={AlertTriangle}
            warning
          />
        </div>

        {/* Segunda linha: Receita + Produção */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          <KpiCard
            label="Receita do mês (R$)"
            value={`R$ ${kpis.receitaMes.toLocaleString("pt-BR")}`}
            sub={`+${receitaGrowth}% vs. mês anterior`}
            icon={TrendingUp}
            accent
          />
          <KpiCard
            label="Tempo médio de produção"
            value={kpis.tempoMedioProducao}
            sub="Por pedido, média das últimas 4 semanas"
            icon={Activity}
          />
        </div>

        {/* Alertas Críticos */}
        {alertas.length > 0 && (
          <div
            style={{
              background: "rgba(255,136,129,0.06)",
              border: "1px solid rgba(255,136,129,0.15)",
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div className="label-sm" style={{ color: "var(--tertiary)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <AlertTriangle size={12} />
              Alertas de Estoque
            </div>
            {alertas.map((alerta) => (
              <div
                key={alerta.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
                  {alerta.mensagem}
                </span>
                <span
                  className="chip"
                  style={{
                    background: "rgba(255,136,129,0.1)",
                    color: "var(--tertiary)",
                    fontSize: "0.625rem",
                  }}
                >
                  {alerta.ref}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Grid: Chart + Operators */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem" }}>

          {/* Sales chart */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>
                  Tendências de Produção
                </h2>
                <p className="label-sm">Últimas 8 semanas · por fase</p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[
                  { label: "Moldagem", color: "var(--primary)" },
                  { label: "Acabamento", color: "var(--secondary)" },
                  { label: "Expedição", color: "#7ec88e" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        background: item.color,
                      }}
                    />
                    <span className="label-sm" style={{ fontSize: "0.625rem" }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={vendasSemanais}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="moldagem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb877" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ffb877" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="acabamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c7c6c6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#c7c6c6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expedicao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7ec88e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7ec88e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="none"
                  stroke="rgba(85,67,53,0.12)"
                  horizontal
                  vertical={false}
                />
                <XAxis
                  dataKey="semana"
                  tick={{ fontSize: 10, fill: "#a38d7b", fontFamily: "Inter", letterSpacing: "0.05em" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#a38d7b", fontFamily: "Inter" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="moldagem"
                  name="Moldagem"
                  stroke="#ffb877"
                  strokeWidth={2}
                  fill="url(#moldagem)"
                />
                <Area
                  type="monotone"
                  dataKey="acabamento"
                  name="Acabamento"
                  stroke="#c7c6c6"
                  strokeWidth={2}
                  fill="url(#acabamento)"
                />
                <Area
                  type="monotone"
                  dataKey="expedicao"
                  name="Expedição"
                  stroke="#7ec88e"
                  strokeWidth={2}
                  fill="url(#expedicao)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Operators */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h2 className="title-md">Performance</h2>
              <Users size={15} color="var(--on-surface-variant)" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {operadores.map((op, i) => (
                <div key={op.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          background: i === 0 ? "rgba(247,146,31,0.15)" : "var(--surface-container-highest)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-headline)",
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          color: i === 0 ? "var(--primary)" : "var(--on-surface-variant)",
                        }}
                      >
                        {op.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                          {op.nome}
                        </div>
                        <div className="label-sm" style={{ fontSize: "0.625rem" }}>
                          {op.nivel}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-headline)",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: i === 0 ? "var(--primary)" : "var(--on-surface)",
                          lineHeight: 1,
                        }}
                      >
                        {op.coldres}
                      </div>
                      <div className="label-sm" style={{ fontSize: "0.625rem" }}>
                        Coldres
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: 3,
                      background: "var(--surface-container-highest)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${op.eficiencia}%`,
                        background:
                          i === 0
                            ? "linear-gradient(90deg, #ffb877, #f7921f)"
                            : i === 1
                            ? "var(--secondary)"
                            : "var(--surface-bright)",
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                  <div
                    className="label-sm"
                    style={{
                      fontSize: "0.625rem",
                      marginTop: "0.25rem",
                      textAlign: "right",
                    }}
                  >
                    {op.eficiencia}% eficiência
                  </div>
                </div>
              ))}
            </div>

            {/* Meta progress */}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "var(--surface-container-lowest)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span className="label-sm">Meta do Mês</span>
                <span
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                  }}
                >
                  {metaPercent}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "var(--surface-container-highest)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${metaPercent}%`,
                    background: "linear-gradient(90deg, #ffb877, #f7921f)",
                  }}
                />
              </div>
              <div
                className="label-sm"
                style={{ marginTop: "0.375rem", textAlign: "right", fontSize: "0.625rem" }}
              >
                {kpis.pedidosMes} / {kpis.metaMensal} unidades
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
