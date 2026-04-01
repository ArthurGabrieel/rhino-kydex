"use client";

import { useState, useCallback, createContext, useContext, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastState {
  message: string;
  type: ToastType;
  id?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
}

export function ToastProvider({ children, durationMs = 3000 }: { children: ReactNode; durationMs?: number }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(7);
      setToast({ message, type, id });

      setTimeout(() => {
        setToast((prev) => (prev?.id === id ? null : prev));
      }, durationMs);
    },
    [durationMs]
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast toast={toast} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

function Toast({ toast, onClose }: { toast: ToastState | null; onClose?: () => void }) {
  if (!toast) return null;

  const typeConfig = {
    success: { icon: CheckCircle2, color: "#7ec88e", borderColor: "#7ec88e" },
    error: { icon: AlertTriangle, color: "var(--tertiary)", borderColor: "var(--tertiary)" },
    warning: { icon: AlertCircle, color: "#f59e0b", borderColor: "#f59e0b" },
    info: { icon: Info, color: "#3b82f6", borderColor: "#3b82f6" },
  };

  const config = typeConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      onClick={onClose}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        background: "var(--surface-container-highest)",
        borderLeft: `2px solid ${config.borderColor}`,
        padding: "1rem 1.5rem",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        animation: "slideInLeft 0.3s ease",
        cursor: onClose ? "pointer" : "default",
      }}
    >
      <Icon size={16} color={config.color} />
      <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--on-surface)", letterSpacing: "0.02em" }}>
        {toast.message}
      </span>
    </div>
  );
}
