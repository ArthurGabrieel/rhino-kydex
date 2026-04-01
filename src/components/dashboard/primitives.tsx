"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

// ─── useCountUp hook ──────────────────────────────────────────
export function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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

// ─── FadeSection ─────────────────────────────────────────────
export function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

// ─── KpiCard ─────────────────────────────────────────────────
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

export function KpiCard({
  label, value, prefix = "", suffix = "", sub, trend,
  icon: Icon, accent, warning, delay = 0,
}: KpiCardProps) {
  const animated = useCountUp(value, 900, delay);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const accentColor = accent ? "var(--primary)" : warning ? "var(--tertiary)" : "var(--on-surface)";

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

      <div className="kpi-value" style={{ color: accentColor, marginBottom: "0.5rem" }}>
        {prefix}{animated.toLocaleString("pt-BR")}{suffix}
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

// ─── CustomTooltip ───────────────────────────────────────────
export const CustomTooltip = ({
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
        <div key={p.name} style={{ color: p.color, marginBottom: 2, display: "flex", gap: 8, justifyContent: "space-between" }}>
          <span style={{ opacity: 0.7 }}>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};
