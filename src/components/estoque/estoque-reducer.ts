import { ItemEstoque, LogEntry } from "./types";

// ─── State ────────────────────────────────────────────────────
export interface EstoqueState {
  itens: ItemEstoque[];
  log: LogEntry[];
}

// ─── Actions ─────────────────────────────────────────────────
export type EstoqueAction =
  | { type: "ADD_ITEM"; item: ItemEstoque }
  | { type: "UPDATE_ITEM"; item: Partial<ItemEstoque> & { id: string } }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "ADJUST_QTY"; id: string; delta: number; motivo?: string };

// ─── Reducer ─────────────────────────────────────────────────
export function estoqueReducer(
  state: EstoqueState,
  action: EstoqueAction
): EstoqueState {
  const now = new Date();
  const hora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const addLog = (entrada: Omit<LogEntry, "id" | "hora">): LogEntry => ({
    id: `L-${Date.now()}`,
    hora,
    ...entrada,
  });

  const recalcStatus = (qtd: number, min: number) => {
    const pct = qtd / min;
    if (qtd <= 0 || pct <= 0.5) return "critico" as const;
    if (pct <= 1.0) return "alerta" as const;
    return "ok" as const;
  };

  switch (action.type) {
    case "ADD_ITEM": {
      const novoLog = addLog({
        tipo: "entrada",
        mensagem: `NOVO_ITEM: ${action.item.ref} "${action.item.nome}" (+${action.item.quantidade} ${action.item.unidade})`,
      });
      return {
        itens: [action.item, ...state.itens],
        log: [novoLog, ...state.log],
      };
    }

    case "UPDATE_ITEM": {
      const itens = state.itens.map((i) => {
        if (i.id !== action.item.id) return i;
        const updated = { ...i, ...action.item };
        return { ...updated, status: recalcStatus(updated.quantidade, updated.minimo) };
      });
      const updated = itens.find((i) => i.id === action.item.id);
      const log = updated
        ? [addLog({ tipo: "entrada", mensagem: `ATUALIZADO: ${updated.ref} — dados editados` }), ...state.log]
        : state.log;
      return { itens, log };
    }

    case "DELETE_ITEM": {
      const item = state.itens.find((i) => i.id === action.id);
      const novoLog = item
        ? addLog({ tipo: "saida", mensagem: `REMOVIDO: ${item.ref} "${item.nome}"` })
        : null;
      return {
        itens: state.itens.filter((i) => i.id !== action.id),
        log: novoLog ? [novoLog, ...state.log] : state.log,
      };
    }

    case "ADJUST_QTY": {
      const itens = state.itens.map((i) => {
        if (i.id !== action.id) return i;
        const novaQtd = Math.max(0, i.quantidade + action.delta);
        const novoStatus = recalcStatus(novaQtd, i.minimo);
        return { ...i, quantidade: novaQtd, status: novoStatus };
      });

      const item = itens.find((i) => i.id === action.id);
      const original = state.itens.find((i) => i.id === action.id);

      const logs: LogEntry[] = [];
      if (item && original) {
        const tipo = action.delta >= 0 ? "entrada" : "saida";
        const sinal = action.delta >= 0 ? "+" : "";
        logs.push(addLog({
          tipo,
          mensagem: `${tipo === "entrada" ? "INCOMING" : "OUTGOING"}: ${item.ref} (${sinal}${action.delta} ${item.unidade})${action.motivo ? ` · ${action.motivo}` : ""}`,
        }));
        if (item.status === "critico" && original.status !== "critico") {
          logs.push(addLog({ tipo: "alerta", mensagem: `ALERT: ${item.ref} BELOW MINIMUM (${item.quantidade}/${item.minimo} ${item.unidade})` }));
        }
      }
      return { itens, log: [...logs, ...state.log] };
    }

    default:
      return state;
  }
}
