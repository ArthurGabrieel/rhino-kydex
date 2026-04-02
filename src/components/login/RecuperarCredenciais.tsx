"use client";

import { useState } from "react";
import { ArrowLeft, Send, Key, CheckCircle, Shield, RefreshCw } from "lucide-react";

type Step = "id" | "code" | "success";

interface Props {
  onBack: () => void;
}

// ─── Step indicator ───────────────────────────────────────────
function StepDots({ current }: { current: Step }) {
  const steps: Step[] = ["id", "code", "success"];
  const idx = steps.indexOf(current);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "2.5rem" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <div style={{
            width: i <= idx ? 20 : 6,
            height: 6,
            background: i <= idx ? "var(--primary)" : "var(--surface-container-highest)",
            transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      ))}
      <span className="label-sm" style={{ marginLeft: "0.25rem", fontSize: "0.5625rem" }}>
        {idx + 1}/3
      </span>
    </div>
  );
}

// ─── Step 1 — Informar e-mail ────────────────────────────────
function StepId({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onNext(email.trim().toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Informe seu e-mail corporativo. Se ele estiver cadastrado no sistema,
          um código de verificação será gerado pelo administrador.
        </p>

        <label htmlFor="recover-email" className="input-label">E-mail Corporativo</label>
        <div style={{ position: "relative" }}>
          <Shield size={15} style={{
            position: "absolute", left: "0.875rem", top: "50%",
            transform: "translateY(-50%)",
            color: "var(--on-surface-variant)", opacity: 0.5,
          }} />
          <input
            id="recover-email"
            type="email"
            className="input-field"
            placeholder="operador@rhino.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: "2.5rem" }}
            autoComplete="email"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading || !email.trim()}
        style={{
          width: "100%", justifyContent: "center",
          opacity: loading || !email.trim() ? 0.6 : 1,
          cursor: loading || !email.trim() ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: 13, height: 13,
              border: "2px solid rgba(75,39,0,0.3)", borderTopColor: "#4b2700",
              borderRadius: "50%", animation: "spin 0.6s linear infinite",
            }} />
            Verificando...
          </>
        ) : (
          <><Send size={13} /> Solicitar Código</>
        )}
      </button>
    </form>
  );
}

// ─── Step 2 — Código de verificação ──────────────────────────
function StepCode({ email, onNext }: { email: string; onNext: () => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    // Mock: "000000" simula código errado, qualquer outro aceita
    if (code === "000000") {
      setError(true);
      setLoading(false);
      return;
    }
    onNext();
  };

  const handleResend = async () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <div style={{
          background: "rgba(247,146,31,0.06)",
          border: "1px solid rgba(247,146,31,0.15)",
          padding: "0.875rem 1rem",
          marginBottom: "1.5rem",
          fontSize: "0.8125rem",
          color: "var(--on-surface-variant)",
          lineHeight: 1.5,
        }}>
          Código enviado para o administrador do sistema relativo ao e-mail{" "}
          <strong style={{ color: "var(--on-surface)", fontFamily: "monospace" }}>
            {email}
          </strong>.
          Solicite o código de 6 dígitos ao responsável.
        </div>

        <label htmlFor="recover-code" className="input-label">Código de Verificação</label>
        <div style={{ position: "relative" }}>
          <Key size={15} style={{
            position: "absolute", left: "0.875rem", top: "50%",
            transform: "translateY(-50%)",
            color: "var(--on-surface-variant)", opacity: 0.5,
          }} />
          <input
            id="recover-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="input-field"
            placeholder="● ● ● ● ● ●"
            value={code}
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(false); }}
            style={{
              paddingLeft: "2.5rem",
              fontFamily: "monospace",
              letterSpacing: "0.25em",
              fontSize: "1.1rem",
              border: error ? "1px solid var(--tertiary)" : undefined,
            }}
            autoComplete="one-time-code"
          />
        </div>

        {error && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--tertiary)" }}>
            Código inválido. Verifique com o administrador e tente novamente.
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={handleResend}
          className="label-sm"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--primary)", opacity: 0.7,
            display: "flex", alignItems: "center", gap: "0.375rem",
          }}
        >
          <RefreshCw size={11} />
          {resent ? "Reenvio solicitado!" : "Reenviar código"}
        </button>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading || code.length !== 6}
        style={{
          width: "100%", justifyContent: "center",
          opacity: loading || code.length !== 6 ? 0.6 : 1,
          cursor: loading || code.length !== 6 ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: 13, height: 13,
              border: "2px solid rgba(75,39,0,0.3)", borderTopColor: "#4b2700",
              borderRadius: "50%", animation: "spin 0.6s linear infinite",
            }} />
            Validando...
          </>
        ) : (
          <><Key size={13} /> Verificar Código</>
        )}
      </button>
    </form>
  );
}

// ─── Step 3 — Sucesso ────────────────────────────────────────
function StepSuccess({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
      {/* Ícone animado */}
      <div style={{
        width: 56, height: 56,
        background: "rgba(126,200,142,0.1)",
        border: "1px solid rgba(126,200,142,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "revealUp 400ms ease-out both",
      }}>
        <CheckCircle size={28} color="#7ec88e" strokeWidth={1.5} />
      </div>

      <div>
        <h3 style={{
          fontFamily: "var(--font-headline)",
          fontSize: "1.125rem", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.06em",
          color: "var(--on-surface)", marginBottom: "0.625rem",
        }}>
          Identidade Verificada
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.6, maxWidth: 280 }}>
          O administrador irá redefinir suas credenciais e compartilhá-las
          com você pelos canais internos da empresa.
        </p>
      </div>

      {/* Monospace info block */}
      <div style={{
        width: "100%",
        fontFamily: "monospace",
        fontSize: "0.6875rem",
        color: "var(--on-surface-variant)",
        background: "var(--surface-container-low)",
        border: "1px solid rgba(85,67,53,0.2)",
        padding: "0.875rem 1rem",
        textAlign: "left",
        lineHeight: 1.8,
      }}>
        <span style={{ color: "#7ec88e", opacity: 0.8 }}>STATUS:</span>{"      "}VERIFICADO<br />
        <span style={{ color: "var(--primary)", opacity: 0.7 }}>PRÓXIMO:</span>{"      "}Aguardar admin<br />
        <span style={{ color: "var(--primary)", opacity: 0.7 }}>SUPORTE:</span>{"      "}Falar com Jorge
      </div>

      <button
        onClick={onBack}
        className="btn-secondary"
        style={{ width: "100%", justifyContent: "center", gap: "0.5rem" }}
      >
        <ArrowLeft size={13} />
        Voltar ao Login
      </button>
    </div>
  );
}

// ─── Orquestrador ─────────────────────────────────────────────
export function RecuperarCredenciais({ onBack }: Props) {
  const [step, setStep] = useState<Step>("id");
  const [email, setEmail] = useState("");

  return (
    <div
      style={{
        animation: "revealUp 350ms cubic-bezier(0.4,0,0.2,1) both",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <button
          onClick={onBack}
          className="label-sm"
          style={{
            background: "none", border: "none",
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: "0.375rem",
            color: "var(--on-surface-variant)", opacity: 0.6,
            marginBottom: "1.5rem",
            padding: 0,
          }}
        >
          <ArrowLeft size={12} />
          Voltar ao login
        </button>

        <h2 style={{
          fontFamily: "var(--font-headline)",
          fontSize: "1.75rem", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.04em",
          color: "var(--on-surface)", marginBottom: "0.375rem",
        }}>
          Recuperar
          <span style={{ color: "var(--primary)" }}> Acesso</span>
        </h2>
        <p className="label-sm">Verificação em 3 passos</p>
      </div>

      {/* Progress */}
      <StepDots current={step} />

      {/* Step content com transição */}
      <div key={step} style={{ animation: "revealUp 300ms ease-out both" }}>
        {step === "id" && (
          <StepId onNext={(nextEmail) => { setEmail(nextEmail); setStep("code"); }} />
        )}
        {step === "code" && (
          <StepCode email={email} onNext={() => setStep("success")} />
        )}
        {step === "success" && (
          <StepSuccess onBack={onBack} />
        )}
      </div>
    </div>
  );
}
