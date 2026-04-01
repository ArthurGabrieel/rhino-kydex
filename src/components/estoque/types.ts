// Estoque domain types — single source of truth

export type CategoriaEstoque = "material" | "hardware" | "produto_final";
export type StatusEstoque = "ok" | "alerta" | "critico";
export type FiltroStatus = "todos" | StatusEstoque;
export type FiltroCategoria = "todas" | CategoriaEstoque;

export interface ItemEstoque {
  id: string;
  ref: string;
  nome: string;
  categoria: CategoriaEstoque;
  quantidade: number;
  unidade: string;
  minimo: number;
  localizacao: string;
  status: StatusEstoque;
}

export interface LogEntry {
  id: string;
  hora: string;
  tipo: "saida" | "alerta" | "entrada" | "auth" | "producao";
  mensagem: string;
}

// ─── Helpers ───────────────────────────────────────────────────

export function calcularStatus(
  quantidade: number,
  minimo: number,
): StatusEstoque {
  if (quantidade <= 0) return "critico";
  const pct = quantidade / minimo;
  if (pct <= 0.5) return "critico";
  if (pct <= 1.0) return "alerta";
  return "ok";
}

export const CATEGORIA_LABEL: Record<CategoriaEstoque, string> = {
  material: "Material",
  hardware: "Hardware",
  produto_final: "Produto Final",
};

export const UNIDADES_COMUNS = ["UN", "FLS", "MT", "KG", "L", "CX", "PCT"];

export const LOCALIZACOES_COMUNS = [
  "A-01",
  "A-02",
  "A-03",
  "A-04",
  "B-01",
  "B-02",
  "B-03",
  "B-04",
  "C-01",
  "C-02",
  "C-03",
  "D-01",
  "D-02",
  "D-03",
];
