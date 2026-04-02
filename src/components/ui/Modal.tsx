"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number;
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 540,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="app-modal-overlay"
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "var(--z-modal)",
        padding: "1rem",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        className="app-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          width: "100%",
          maxWidth: width,
          background: "var(--surface-container)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          animation: "modalSlideIn 0.2s ease",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="app-modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(85,67,53,0.2)",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              id="modal-title"
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--on-surface)",
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="label-sm"
                style={{ marginTop: "0.25rem", opacity: 0.6 }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--on-surface-variant)",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
              transition: "opacity 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="app-modal-content" style={{ overflowY: "auto", flex: 1, padding: "1.5rem" }}>
          {children}
        </div>
      </div>

      <style jsx global>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
