"use client";

import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import { ItemEstoque } from "./types";
import { EstoqueAction } from "./estoque-reducer";

interface EstoqueRowProps {
  item: ItemEstoque;
  dispatch: React.Dispatch<EstoqueAction>;
  onClick: (item: ItemEstoque) => void;
}

const STATUS_CONFIG = {
  ok:      { label: "OK",      Icon: CheckCircle,  color: "#7ec88e",            bg: "rgba(126,200,142,0.1)"  },
  alerta:  { label: "Atenção", Icon: TrendingDown,  color: "var(--primary)",    bg: "rgba(255,184,119,0.1)"  },
  critico: { label: "Crítico", Icon: AlertTriangle, color: "var(--tertiary)",   bg: "rgba(255,136,129,0.12)" },
} as const;

const CATEGORIA_LABEL: Record<string, string> = {
  material:      "Material",
  hardware:      "Hardware",
  produto_final: "Produto Final",
};

export default function EstoqueRow({ item, dispatch, onClick }: EstoqueRowProps) {
  const st = STATUS_CONFIG[item.status];
  const { Icon } = st;
  const pct = Math.min(100, Math.round((item.quantidade / item.minimo) * 100));

  return (
    <tr
      onClick={() => onClick(item)}
      style={{ cursor: "pointer" }}
    >
      {/* REF */}
      <td>
        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--primary)", opacity: 0.8 }}>
          {item.ref}
        </span>
      </td>

      {/* Nome + progress bar */}
      <td>
        <div style={{ fontWeight: 500, fontSize: "0.8125rem" }}>{item.nome}</div>
        <div style={{ height: 2, background: "var(--surface-container-highest)", marginTop: "0.375rem", overflow: "hidden", width: 140 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: st.color, transition: "width 300ms ease" }} />
        </div>
      </td>

      {/* Categoria */}
      <td>
        <span className="chip" style={{ fontSize: "0.625rem" }}>
          {CATEGORIA_LABEL[item.categoria]}
        </span>
      </td>

      {/* Quantidade */}
      <td style={{ textAlign: "right" }}>
        <span style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: st.color }}>
          {item.quantidade}
        </span>
        <span className="label-sm" style={{ marginLeft: "0.25rem", fontSize: "0.625rem" }}>
          {item.unidade}
        </span>
      </td>

      {/* Mínimo */}
      <td style={{ textAlign: "right" }}>
        <span style={{ color: "var(--on-surface-variant)", fontSize: "0.8125rem" }}>
          {item.minimo} {item.unidade}
        </span>
      </td>

      {/* Localização */}
      <td>
        <span className="chip" style={{ fontFamily: "monospace", fontSize: "0.625rem" }}>
          {item.localizacao}
        </span>
      </td>

      {/* Status badge */}
      <td>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.5rem", background: st.bg, color: st.color, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          <Icon size={10} />
          {st.label}
        </div>
      </td>
    </tr>
  );
}
