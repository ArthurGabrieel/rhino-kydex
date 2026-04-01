// Kanban domain types — single source of truth

export type KanbanStatus =
  | "aberto"
  | "preparacao"
  | "moldagem"
  | "acabamento"
  | "expedicao";

export type Prioridade = "alta" | "media" | "normal";

export interface Comentario {
  id: string;
  autor: string;
  avatar: string;
  texto: string;
  hora: string;
}

export interface Pedido {
  id: string;
  ref: string;
  cliente: string;
  modelo: string;
  arma: string;
  cor: string;
  prioridade: Prioridade;
  status: KanbanStatus;
  hora: string;
  operador?: string;
  observacoes?: string;
  comentarios?: Comentario[];
}

export interface Coluna {
  id: KanbanStatus;
  label: string;
  cor: string;
}

export const COLUNAS: Coluna[] = [
  { id: "aberto",      label: "Pedido Aberto", cor: "var(--on-surface-variant)" },
  { id: "preparacao",  label: "Preparação",    cor: "#7ec8e0" },
  { id: "moldagem",    label: "Moldagem",      cor: "var(--primary)" },
  { id: "acabamento",  label: "Acabamento",    cor: "var(--secondary)" },
  { id: "expedicao",   label: "Expedição",     cor: "#7ec88e" },
];

export const COLUNA_ORDER = COLUNAS.map((c) => c.id);
