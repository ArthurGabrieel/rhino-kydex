"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { LoginHero } from "@/components/login/LoginHero";
import { LoginForm } from "@/components/login/LoginForm";
import { RecuperarCredenciais } from "@/components/login/RecuperarCredenciais";
import { useSession } from "@/components/auth/SessionProvider";

function getMockProfileFromEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const localPart = normalized.split("@")[0] ?? normalized;

  if (
    localPart.includes("ger") ||
    localPart.includes("gerente") ||
    localPart.includes("ric")
  ) {
    return {
      nome: "Ricardo",
      avatar: "RF",
      nivel: "Pleno",
      role: "Gerente" as const,
    };
  }

  if (
    localPart.includes("col") ||
    localPart.includes("colab") ||
    localPart.includes("mar")
  ) {
    return {
      nome: "Marcos",
      avatar: "MO",
      nivel: "Júnior",
      role: "Colaborador" as const,
    };
  }

  return {
    nome: "Jorge",
    avatar: "JM",
    nivel: "Sênior",
    role: "Administrador" as const,
  };
}

/**
 * Orquestrador da tela de login.
 * Alterna entre formulário de login e fluxo de recuperação de credenciais.
 */
export function LoginBoard() {
  const router = useRouter();
  const { setUser } = useSession();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", senha: "" });
  const [recovering, setRecovering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));

    const profile = getMockProfileFromEmail(credentials.email);
    const email = credentials.email.trim() || `${profile.nome.toLowerCase()}@rhino.com`;

    setUser({
      email,
      nome: profile.nome,
      avatar: profile.avatar,
      nivel: profile.nivel,
      role: profile.role,
    });

    const landingPage = profile.role === "Colaborador" ? "/producao" : "/dashboard";
    router.push(landingPage);
  };

  return (
    <>
      <div className="login-shell" style={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--surface-container-lowest)",
        display: "flex",
        alignItems: "stretch",
        overflowX: "hidden",
      }}>
        {/* Painel esquerdo — hero */}
        <div className="login-hero-panel" style={{ flex: 1, minWidth: 0, display: "flex" }}>
          <LoginHero />
        </div>

        {/* Painel direito — formulário ou recuperação */}
        <div className="login-form-panel" style={{
          width: "min(440px, 100%)", flexShrink: 0,
          background: "var(--surface-container-low)",
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 2.5rem",
          overflow: "hidden",
        }}>
          {recovering ? (
            /* ── Fluxo de recuperação ── */
            <RecuperarCredenciais onBack={() => setRecovering(false)} />
          ) : (
            /* ── Login normal ── */
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
                Acesso com E-mail Corporativo
              </p>

              <p className="label-sm" style={{ marginBottom: "1rem", opacity: 0.55 }}>
                Demo: admin@rhino.com, gerente@rhino.com, colaborador@rhino.com
              </p>

              <LoginForm
                email={credentials.email}
                senha={credentials.senha}
                showPass={showPass}
                loading={loading}
                onEmail={(v) => setCredentials((p) => ({ ...p, email: v }))}
                onSenha={(v) => setCredentials((p) => ({ ...p, senha: v }))}
                onTogglePass={() => setShowPass((p) => !p)}
                onSubmit={handleLogin}
                onRecover={() => setRecovering(true)}
              />

              {/* Aviso de segurança */}
              <div style={{
                marginTop: "2rem", padding: "0.875rem",
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
          )}
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
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
