"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  TrendingUp, Package, AlertTriangle, Users,
  Target, Activity, ChevronUp, ChevronDown,
  Calendar, ArrowUpRight, Zap, Clock,
} from "lucide-react";
import {
  kpis, operadores, alertas,
  dados7d, dados30d, dados90d, dadosYtd,
} from "@/lib/mock-data";

// ─── Animated counter hook ────────────────────────────────────
function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return value;
}

// ─── Date range picker ────────────────────────────────────────
type RangeKey = "7d" | "30d" | "90d" | "ytd";

const DATE_RANGES: { key: RangeKey; label: string }[] = [
  { key: "7d",  label: "7D"  },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "ytd", label: "YTD" },
];

// One dataset per key — right granularity, no slicing
const RANGE_DATA: Record<RangeKey, typeof dados7d> = {
  "7d":  dados7d,
  "30d": dados30d,
  "90d": dados90d,
  "ytd": dadosYtd,
};

const RANGE_LABEL: Record<RangeKey, string> = {
  "7d":  "Últimos 7 dias",
  "30d": "Últimas 4 semanas",
  "90d": "Últimos 3 meses",
  "ytd": "Ano atual",
};

// ─── KPI Card ─────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  sub?: string;
  trend?: number;
  icon: React.ElementType;
  accent?: boolean;
  warning?: boolean;
  delay?: number;
}

function KpiCard({ label, value, prefix = "", suffix = "", sub, trend, icon: Icon, accent, warning, delay = 0 }: KpiCardProps) {
  const animated = useCountUp(value, 900, delay);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const accentColor = accent ? "var(--primary)" : warning ? "var(--tertiary)" : "var(--on-surface)";

  // Format the animated value: receita needs thousands separator
  const formatted = prefix === "R$ "
    ? animated.toLocaleString("pt-BR")
    : animated.toLocaleString("pt-BR");

  return (
    <div
      className="card"
      style={{
        position: "relative",
        overflow: "hidden",
        borderLeft: accent
          ? "2px solid var(--primary)"
          : warning
          ? "2px solid var(--tertiary)"
          : "2px solid transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 400ms ease-out, transform 400ms ease-out",
      }}
    >
      {/* Faint accent stripe */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 48, height: "100%",
        background: accent ? "rgba(247,146,31,0.04)" : warning ? "rgba(255,136,129,0.04)" : "transparent",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
        <span className="label-sm">{label}</span>
        <div style={{
          width: 28, height: 28,
          background: accent ? "rgba(247,146,31,0.12)" : warning ? "rgba(255,136,129,0.12)" : "var(--surface-container-highest)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={13} color={accentColor} />
        </div>
      </div>

      {/* Use design-system class kpi-value */}
      <div className="kpi-value" style={{ color: accentColor, marginBottom: "0.5rem" }}>
        {prefix}{formatted}{suffix}
      </div>

      {(sub || trend !== undefined) && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          {trend !== undefined && (
            <span
              className={trend >= 0 ? "trend-up" : "trend-down"}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.125rem", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.04em" }}
            >
              {trend >= 0 ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              {Math.abs(trend)}%
            </span>
          )}
          {sub && <span className="label-sm">{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
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
      <p style={{ color: "var(--on-surface-variant)", marginBottom: "0.5rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontSize: "0.5625rem" }}>
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2, display: "flex", gap: 8, justifyContent: "space-between" }}>
          <span style={{ opacity: 0.7 }}>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Section wrapper (fade-in on mount) ───────────────────────
function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 500ms ease-out, transform 500ms ease-out",
    }}>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function DashboardPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const chartData = RANGE_DATA[range];
  // Use linear for few points (7D/30D), monotone for many (90D/YTD)
  const curveType = chartData.length <= 4 ? "linear" as const : "monotone" as const;

  const metaPercent = Math.round((kpis.pedidosMes / kpis.metaMensal) * 100);
  const receitaGrowth = Math.round(((kpis.receitaMes - kpis.receitaMesAnterior) / kpis.receitaMesAnterior) * 100);
  const pedidosGrowth = Math.round(((kpis.pedidosMes - kpis.pedidosMesAnterior) / kpis.pedidosMesAnterior) * 100);

  // Meta progress bar animated width
  const [metaWidth, setMetaWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setMetaWidth(metaPercent), 600);
    return () => clearTimeout(t);
  }, [metaPercent]);

  // Operator bars
  const [opWidths, setOpWidths] = useState<number[]>(operadores.map(() => 0));
  useEffect(() => {
    const t = setTimeout(() => setOpWidths(operadores.map((o) => o.eficiencia)), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
              <h1 className="headline-md">Dashboard</h1>
              <span className="chip chip-active">
                {/* Use design-system live-dot class */}
                <span className="live-dot" style={{ width: 5, height: 5, background: "#7ec88e", borderRadius: "50%", display: "inline-block", marginRight: 5 }} />
                LIVE
              </span>
            </div>
            <p className="label-sm">
              Visão operacional em tempo real · Comparado ao mês anterior
            </p>
          </div>

          {/* Date range pill */}
          <div style={{
            display: "flex",
            background: "var(--surface-container-low)",
            padding: "3px",
            gap: 0,
          }}>
            {DATE_RANGES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                style={{
                  padding: "0.375rem 0.875rem",
                  background: range === key ? "var(--primary)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
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

        {/* ── KPI Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <KpiCard
            label="Pedidos este mês"
            value={kpis.pedidosMes}
            trend={pedidosGrowth}
            sub="vs. mês anterior"
            icon={TrendingUp}
            accent
            delay={0}
          />
          <KpiCard
            label="Meta mensal"
            value={metaPercent}
            suffix="%"
            sub={`${kpis.pedidosMes} / ${kpis.metaMensal} un`}
            icon={Target}
            accent
            delay={80}
          />
          <KpiCard
            label="Em produção agora"
            value={kpis.itensEmProducao}
            sub="Pedidos ativos"
            icon={Activity}
            delay={160}
          />
          <KpiCard
            label="Alertas de estoque"
            value={kpis.alertasAtivos}
            sub="Reposição necessária"
            icon={AlertTriangle}
            warning
            delay={240}
          />
        </div>

        {/* ── Segunda linha ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <KpiCard
            label="Receita do mês"
            value={kpis.receitaMes}
            prefix="R$ "
            trend={receitaGrowth}
            sub="vs. mês anterior"
            icon={ArrowUpRight}
            accent
            delay={300}
          />
          <KpiCard
            label="Tempo médio de produção"
            value={138}
            suffix=" min"
            sub="Por pedido · últimas 4 semanas"
            icon={Clock}
            delay={360}
          />
        </div>

        {/* ── Alertas Críticos ── */}
        {alertas.length > 0 && (
          <FadeSection delay={420}>
            <div style={{
              background: "rgba(255,136,129,0.05)",
              border: "1px solid rgba(255,136,129,0.15)",
              padding: "0.875rem 1.25rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}>
              <AlertTriangle size={14} color="var(--tertiary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1, display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {alertas.map((alerta) => (
                  <div key={alerta.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: alerta.tipo === "critico" ? "var(--tertiary)" : "var(--primary)",
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>{alerta.mensagem}</span>
                    <span className="chip" style={{
                      fontFamily: "monospace",
                      fontSize: "0.5625rem",
                      background: alerta.tipo === "critico" ? "rgba(255,136,129,0.1)" : "rgba(247,146,31,0.1)",
                      color: alerta.tipo === "critico" ? "var(--tertiary)" : "var(--primary)",
                    }}>
                      {alerta.ref}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeSection>
        )}

        {/* ── Chart + Operators ── */}
        <FadeSection delay={500}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem" }}>

            {/* Area Chart */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Tendências de Produção</h2>
                  <p className="label-sm">
                    {RANGE_LABEL[range]} · por fase
                  </p>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  {[
                    { label: "Moldagem",   color: "var(--primary)"  },
                    { label: "Acabamento", color: "#c7c6c6"          },
                    { label: "Expedição",  color: "#7ec88e"          },
                  ].map((s) => (
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
                    <linearGradient id="gMoldagem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ffb877" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#ffb877" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gAcabamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c7c6c6" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#c7c6c6" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gExpedicao" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7ec88e" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#7ec88e" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="none" stroke="rgba(85,67,53,0.1)" horizontal vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#a38d7b", fontFamily: "Inter", letterSpacing: "0.04em" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a38d7b", fontFamily: "Inter" }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type={curveType} dataKey="moldagem"   name="Moldagem"   stroke="#ffb877" strokeWidth={2} fill="url(#gMoldagem)"   animationDuration={800} />
                  <Area type={curveType} dataKey="acabamento" name="Acabamento" stroke="#c7c6c6" strokeWidth={2} fill="url(#gAcabamento)" animationDuration={900} />
                  <Area type={curveType} dataKey="expedicao"  name="Expedição"  stroke="#7ec88e" strokeWidth={2} fill="url(#gExpedicao)"  animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Operators panel */}
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
                          : i === 1
                          ? "var(--secondary)"
                          : "var(--surface-bright)",
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

                <div style={{ height: 5, background: "var(--surface-container-highest)", overflow: "hidden", position: "relative" }}>
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

        {/* ── Weekly bar chart ── */}
        <FadeSection delay={650}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2 className="title-md" style={{ marginBottom: "0.25rem" }}>Distribuição por Fase</h2>
                <p className="label-sm">Volume semanal comparado por etapa de produção</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={12} color="var(--primary)" />
                <span className="label-sm" style={{ color: "var(--primary)", fontSize: "0.625rem" }}>PERÍODO: {range.toUpperCase()}</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={chartData.length >= 10 ? 160 : 130}>
              <BarChart data={chartData} barCategoryGap={chartData.length <= 7 ? "40%" : "30%"} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
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

      </div>
    </div>
  );
}
