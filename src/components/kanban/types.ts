// Kanban domain types — single source of truth

export type KanbanStatus =
  | "aberto"
  | "preparacao"
  | "moldagem"
  | "acabamento"
  | "expedicao";

export type Prioridade = "alta" | "media" | "normal";
export type LogKanbanTipo = "comentario" | "sistema";

export interface LogKanban {
  id: string;
  tipo: LogKanbanTipo;
  autor: string;
  avatar?: string;
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
  revisor?: string;
  tempoGarantia?: string;
  endereco?: string;
  numero?: string;
  email?: string;
  documento?: string;
  descricaoProduto?: string;
  foto?: string;
  dataVencimento?: string;
  observacoes?: string;
  logs?: LogKanban[];
}

export interface Coluna {
  id: KanbanStatus;
  label: string;
  cor: string;
}

export const COLUNAS: Coluna[] = [
  { id: "aberto", label: "Pedido Aberto", cor: "var(--on-surface-variant)" },
  { id: "preparacao", label: "Preparação", cor: "#7ec8e0" },
  { id: "moldagem", label: "Moldagem", cor: "var(--primary)" },
  { id: "acabamento", label: "Acabamento", cor: "var(--secondary)" },
  { id: "expedicao", label: "Expedição", cor: "#7ec88e" },
];

export const COLUNA_ORDER = COLUNAS.map((c) => c.id);

export const PRIORIDADE_ORDER: Record<Prioridade, number> = {
  alta: 0,
  media: 1,
  normal: 2,
};

export function isPedidoAtrasado(pedido: Pick<Pedido, "dataVencimento" | "status">, now = new Date()) {
  if (!pedido.dataVencimento) return false;
  if (pedido.status === "expedicao") return false;

  const hoje = new Date(now);
  hoje.setHours(0, 0, 0, 0);

  const vencimento = new Date(pedido.dataVencimento);
  vencimento.setHours(0, 0, 0, 0);

  return vencimento < hoje;
}
