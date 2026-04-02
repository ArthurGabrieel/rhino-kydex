import {
  Pedido,
  KanbanStatus,
  COLUNA_ORDER,
  COLUNAS,
  LogKanban,
} from "./types";

// ─── State ────────────────────────────────────────────────────
export interface KanbanState {
  pedidos: Pedido[];
}

// ─── Actions ─────────────────────────────────────────────────
export type KanbanAction =
  | { type: "MOVE_CARD"; id: string; to: KanbanStatus }
  | { type: "MOVE_CARD_NEXT"; id: string }
  | { type: "MOVE_CARD_PREV"; id: string }
  | { type: "ADD_ORDER"; pedido: Pedido }
  | { type: "UPDATE_ORDER"; pedido: Partial<Pedido> & { id: string } }
  | { type: "DELETE_ORDER"; id: string }
  | { type: "ASSIGN_OPERATOR"; id: string; operador: string }
  | { type: "ADD_COMMENT"; id: string; comentario: LogKanban };

function nowHora() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function createSystemLog(autor: string, texto: string): LogKanban {
  return {
    id: `SYS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    tipo: "sistema",
    autor,
    texto,
    hora: nowHora(),
  };
}

function appendLog(pedido: Pedido, log: LogKanban) {
  return {
    ...pedido,
    logs: [...(pedido.logs ?? []), log],
  };
}

function getStatusLabel(status: KanbanStatus) {
  return COLUNAS.find((col) => col.id === status)?.label ?? status;
}

// ─── Reducer ─────────────────────────────────────────────────
export function kanbanReducer(
  state: KanbanState,
  action: KanbanAction,
): KanbanState {
  switch (action.type) {
    case "MOVE_CARD": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) => {
          if (p.id !== action.id || p.status === action.to) return p;
          const toLabel = getStatusLabel(action.to);
          return appendLog(
            { ...p, status: action.to },
            createSystemLog("Sistema", `Card movido para ${toLabel}`),
          );
        }),
      };
    }

    case "MOVE_CARD_NEXT": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) => {
          if (p.id !== action.id) return p;
          const idx = COLUNA_ORDER.indexOf(p.status);
          const next = COLUNA_ORDER[idx + 1];
          if (!next) return p;
          const toLabel = getStatusLabel(next);
          return appendLog(
            { ...p, status: next },
            createSystemLog("Sistema", `Card movido para ${toLabel}`),
          );
        }),
      };
    }

    case "MOVE_CARD_PREV": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) => {
          if (p.id !== action.id) return p;
          const idx = COLUNA_ORDER.indexOf(p.status);
          const prev = COLUNA_ORDER[idx - 1];
          if (!prev) return p;
          const toLabel = getStatusLabel(prev);
          return appendLog(
            { ...p, status: prev },
            createSystemLog("Sistema", `Card movido para ${toLabel}`),
          );
        }),
      };
    }

    case "ADD_ORDER": {
      const pedidoComLog = appendLog(
        action.pedido,
        createSystemLog("Sistema", "Pedido criado no Kanban"),
      );
      return { ...state, pedidos: [pedidoComLog, ...state.pedidos] };
    }

    case "UPDATE_ORDER": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) =>
          p.id === action.pedido.id ? { ...p, ...action.pedido } : p,
        ),
      };
    }

    case "DELETE_ORDER": {
      return {
        ...state,
        pedidos: state.pedidos.filter((p) => p.id !== action.id),
      };
    }

    case "ASSIGN_OPERATOR": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) => {
          if (p.id !== action.id) return p;
          return appendLog(
            { ...p, operador: action.operador },
            createSystemLog("Sistema", `Operador atribuído: ${action.operador}`),
          );
        }),
      };
    }

    case "ADD_COMMENT": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) =>
          p.id === action.id
            ? {
                ...p,
                logs: [...(p.logs ?? []), action.comentario],
              }
            : p,
        ),
      };
    }

    default:
      return state;
  }
}
