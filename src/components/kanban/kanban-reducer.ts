import { Pedido, KanbanStatus, COLUNA_ORDER } from "./types";

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
  | { type: "ASSIGN_OPERATOR"; id: string; operador: string };

// ─── Reducer ─────────────────────────────────────────────────
export function kanbanReducer(
  state: KanbanState,
  action: KanbanAction
): KanbanState {
  switch (action.type) {
    case "MOVE_CARD": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) =>
          p.id === action.id ? { ...p, status: action.to } : p
        ),
      };
    }

    case "MOVE_CARD_NEXT": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) => {
          if (p.id !== action.id) return p;
          const idx = COLUNA_ORDER.indexOf(p.status);
          const next = COLUNA_ORDER[idx + 1];
          return next ? { ...p, status: next } : p;
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
          return prev ? { ...p, status: prev } : p;
        }),
      };
    }

    case "ADD_ORDER": {
      return { ...state, pedidos: [action.pedido, ...state.pedidos] };
    }

    case "UPDATE_ORDER": {
      return {
        ...state,
        pedidos: state.pedidos.map((p) =>
          p.id === action.pedido.id ? { ...p, ...action.pedido } : p
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
        pedidos: state.pedidos.map((p) =>
          p.id === action.id ? { ...p, operador: action.operador } : p
        ),
      };
    }

    default:
      return state;
  }
}
