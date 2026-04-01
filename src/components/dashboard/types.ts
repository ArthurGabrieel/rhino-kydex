// Dashboard — tipos compartilhados entre componentes
export type RangeKey = "7d" | "30d" | "90d" | "ytd";

export const DATE_RANGES: { key: RangeKey; label: string }[] = [
  { key: "7d",  label: "7D"  },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "ytd", label: "YTD" },
];

export const RANGE_LABEL: Record<RangeKey, string> = {
  "7d":  "Últimos 7 dias",
  "30d": "Últimas 4 semanas",
  "90d": "Últimos 3 meses",
  "ytd": "Ano atual",
};
