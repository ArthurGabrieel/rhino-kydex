"use client";

import { Eye, EyeOff, Lock, User } from "lucide-react";

interface Props {
  usuario: string;
  senha: string;
  showPass: boolean;
  loading: boolean;
  onUsuario: (v: string) => void;
  onSenha: (v: string) => void;
  onTogglePass: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Formulário de credenciais — campos de ID e senha com validação visual.
 */
export function LoginForm({
  usuario, senha, showPass, loading,
  onUsuario, onSenha, onTogglePass, onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* ID do operador */}
      <div>
        <label htmlFor="usuario" className="input-label">ID do Operador</label>
        <div style={{ position: "relative" }}>
          <User
            size={15}
            style={{
              position: "absolute", left: "0.875rem", top: "50%",
              transform: "translateY(-50%)",
              color: "var(--on-surface-variant)", opacity: 0.5,
            }}
          />
          <input
            id="usuario"
            type="text"
            className="input-field"
            placeholder="operador_id"
            value={usuario}
            onChange={(e) => onUsuario(e.target.value)}
            style={{ paddingLeft: "2.5rem" }}
            autoComplete="username"
          />
        </div>
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="senha" className="input-label">Credencial de Acesso</label>
        <div style={{ position: "relative" }}>
          <Lock
            size={15}
            style={{
              position: "absolute", left: "0.875rem", top: "50%",
              transform: "translateY(-50%)",
              color: "var(--on-surface-variant)", opacity: 0.5,
            }}
          />
          <input
            id="senha"
            type={showPass ? "text" : "password"}
            className="input-field"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => onSenha(e.target.value)}
            style={{ paddingLeft: "2.5rem", paddingRight: "2.75rem" }}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={onTogglePass}
            style={{
              position: "absolute", right: "0.875rem", top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--on-surface-variant)", opacity: 0.5,
              padding: 0, display: "flex",
            }}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Link recuperar */}
      <div style={{ textAlign: "right", marginTop: "-0.5rem" }}>
        <button
          type="button"
          className="label-sm"
          style={{
            background: "none", border: "none",
            cursor: "pointer", color: "var(--primary)", opacity: 0.7,
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
          width: "100%", justifyContent: "center",
          marginTop: "0.5rem",
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: 14, height: 14,
              border: "2px solid rgba(75,39,0,0.3)",
              borderTopColor: "#4b2700",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }} />
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
  );
}
