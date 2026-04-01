"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crosshair, Eye, EyeOff, Lock, User, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ usuario: "", senha: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    await new Promise((res) => setTimeout(res, 1200));
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface-container-lowest)",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Left Panel — Tactical Hero */}
      <div
        className="tactical-grid"
        style={{
          flex: 1,
          background: "var(--background)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #ffb877 0%, #f7921f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Crosshair size={22} color="#4b2700" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--on-surface)",
              }}
            >
              Rhino Kydex
            </div>
            <div className="label-sm" style={{ marginTop: 2 }}>
              Tactical Ops Framework
            </div>
          </div>
        </div>

        {/* Center content */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(247,146,31,0.1)",
              padding: "0.25rem 0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                background: "var(--primary)",
                borderRadius: "50%",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <span className="label-sm" style={{ color: "var(--primary)" }}>
              Sistema Operacional
            </span>
          </div>

          <h1 className="display-lg" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
            Proteção
            <br />
            <span style={{ color: "var(--primary)" }}>e</span>
            <br />
            Excelência
          </h1>

          <p
            style={{
              color: "var(--on-surface-variant)",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              maxWidth: 360,
            }}
          >
            Sistema integrado de gerenciamento de produção para equipamentos
            táticos de precisão.
          </p>
        </div>

        {/* Bottom tagline */}
        <div>
          <div
            style={{
              width: "100%",
              height: 1,
              background:
                "linear-gradient(90deg, var(--primary-container) 0%, transparent 100%)",
              marginBottom: "1rem",
              opacity: 0.3,
            }}
          />
          <div className="label-sm">
            Uncompromising Precision · Industrial Standards · Rhino Kydex Systems
          </div>
        </div>

        {/* Decorative orange accent block */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "20%",
            width: 4,
            height: "30%",
            background: "linear-gradient(180deg, var(--primary) 0%, transparent 100%)",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Right Panel — Login Form */}
      <div
        style={{
          width: 440,
          flexShrink: 0,
          background: "var(--surface-container-low)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 2.5rem",
        }}
      >
        <div className="animate-fade-in">
          {/* Version badge */}
          <div
            className="label-sm"
            style={{ marginBottom: "2.5rem", opacity: 0.5 }}
          >
            v4.2.0 Tactical Ops Framework
          </div>

          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "1.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--on-surface)",
              marginBottom: "0.5rem",
            }}
          >
            Acesso
            <span style={{ color: "var(--primary)" }}> Restrito</span>
          </h2>

          <p className="label-sm" style={{ marginBottom: "2.5rem" }}>
            Identificação do Operador
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Usuario */}
            <div>
              <label htmlFor="usuario" className="input-label">
                ID do Operador
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={15}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--on-surface-variant)",
                    opacity: 0.5,
                  }}
                />
                <input
                  id="usuario"
                  type="text"
                  className="input-field"
                  placeholder="operador_id"
                  value={credentials.usuario}
                  onChange={(e) =>
                    setCredentials({ ...credentials, usuario: e.target.value })
                  }
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="input-label">
                Credencial de Acesso
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--on-surface-variant)",
                    opacity: 0.5,
                  }}
                />
                <input
                  id="senha"
                  type={showPass ? "text" : "password"}
                  className="input-field"
                  placeholder="••••••••"
                  value={credentials.senha}
                  onChange={(e) =>
                    setCredentials({ ...credentials, senha: e.target.value })
                  }
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--on-surface-variant)",
                    opacity: 0.5,
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Recover link */}
            <div style={{ textAlign: "right", marginTop: "-0.5rem" }}>
              <button
                type="button"
                className="label-sm"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--primary)",
                  opacity: 0.7,
                }}
              >
                Recuperar Credenciais
              </button>
            </div>

            {/* Submit */}
            <button
              id="btn-login"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "0.5rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(75,39,0,0.3)",
                      borderTopColor: "#4b2700",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                  Autenticando...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Autenticar
                </>
              )}
            </button>
          </form>

          {/* System alert */}
          <div
            style={{
              marginTop: "2rem",
              padding: "0.875rem",
              background: "rgba(255,136,129,0.08)",
              display: "flex",
              gap: "0.625rem",
              alignItems: "flex-start",
            }}
          >
            <AlertTriangle
              size={13}
              style={{ color: "var(--tertiary)", flexShrink: 0, marginTop: 1 }}
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--on-surface-variant)",
                opacity: 0.7,
                lineHeight: 1.5,
              }}
            >
              Acesso monitorado. Tentativas não autorizadas são registradas e
              reportadas ao administrador do sistema.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
