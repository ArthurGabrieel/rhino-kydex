"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { LoginHero } from "@/components/login/LoginHero";
import { LoginForm } from "@/components/login/LoginForm";

/**
 * Orquestrador da tela de login.
 * Gerencia estado (credenciais, loading) e delega UI para LoginHero e LoginForm.
 */
export function LoginBoard() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ usuario: "", senha: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));
    router.push("/dashboard");
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: "var(--surface-container-lowest)", display: "flex", alignItems: "stretch" }}>
        {/* Painel esquerdo — hero */}
        <LoginHero />

        {/* Painel direito — formulário */}
        <div style={{
          width: 440, flexShrink: 0,
          background: "var(--surface-container-low)",
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 2.5rem",
        }}>
          <div className="animate-fade-in">
            <div className="label-sm" style={{ marginBottom: "2.5rem", opacity: 0.5 }}>
              v2.4.1 · Rhino Kydex Backoffice
            </div>

            <h2 style={{
              fontFamily: "var(--font-headline)",
              fontSize: "1.75rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.04em",
              color: "var(--on-surface)", marginBottom: "0.5rem",
            }}>
              Acesso<span style={{ color: "var(--primary)" }}> Restrito</span>
            </h2>

            <p className="label-sm" style={{ marginBottom: "2.5rem" }}>
              Identificação do Operador
            </p>

            <LoginForm
              usuario={credentials.usuario}
              senha={credentials.senha}
              showPass={showPass}
              loading={loading}
              onUsuario={(v) => setCredentials((p) => ({ ...p, usuario: v }))}
              onSenha={(v) => setCredentials((p) => ({ ...p, senha: v }))}
              onTogglePass={() => setShowPass((p) => !p)}
              onSubmit={handleLogin}
            />

            {/* Aviso de segurança */}
            <div style={{
              marginTop: "2rem",
              padding: "0.875rem",
              background: "rgba(255,136,129,0.08)",
              display: "flex", gap: "0.625rem", alignItems: "flex-start",
            }}>
              <AlertTriangle size={13} style={{ color: "var(--tertiary)", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", opacity: 0.7, lineHeight: 1.5 }}>
                Acesso monitorado. Tentativas não autorizadas são registradas e
                reportadas ao administrador do sistema.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}
