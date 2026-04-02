"use client";

import { useState } from "react";
import { User, KeyRound, Save, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import { useSession } from "@/components/auth/SessionProvider";
import { useMediaQuery } from "@/lib/use-media-query";

function splitNomeCompleto(nomeCompleto: string) {
  const trimmed = nomeCompleto.trim();
  if (!trimmed) {
    return { nome: "", sobrenome: "" };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { nome: parts[0], sobrenome: "" };
  }

  return {
    nome: parts[0],
    sobrenome: parts.slice(1).join(" "),
  };
}

export function PerfilTab() {
  const { showToast } = useToast();
  const { user, setUser } = useSession();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const initialName = splitNomeCompleto(user.nome);

  const [nome, setNome] = useState(initialName.nome);
  const [sobrenome, setSobrenome] = useState(initialName.sobrenome);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleUpdateProfile = () => {
    if (!nome.trim() || !sobrenome.trim()) {
      showToast("Nome e sobrenome são obrigatórios.", "error");
      return;
    }

    setUser({
      ...user,
      nome: `${nome.trim()} ${sobrenome.trim()}`,
    });

    showToast("Perfil atualizado com sucesso.", "success");
  };

  const handleUpdatePassword = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      showToast("Preencha todos os campos da senha.", "error");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      showToast("A nova senha e a confirmação não conferem.", "error");
      return;
    }
    if (novaSenha.length < 8) {
      showToast("A senha deve ter no mínimo 8 caracteres.", "warning");
      return;
    }
    
    showToast("Senha alterada com sucesso.", "success");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1.25rem" : "2rem", animation: "fadeIn 0.3s ease", paddingBottom: "2rem" }}>
      
      {/* SEÇÃO 1: DADOS CADASTRAIS */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid rgba(85,67,53,0.1)",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: isMobile ? "1rem" : "1.25rem 1.5rem", borderBottom: "1px solid rgba(85,67,53,0.1)", display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--surface-container-lowest)" }}>
          <User size={20} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, color: "var(--on-surface)" }}>Informações Pessoais</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>Atualize os dados básicos da sua conta corporativa.</p>
          </div>
        </div>

        <div style={{ padding: isMobile ? "1rem" : "1.5rem", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.25rem", maxWidth: isMobile ? "100%" : "800px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label className="label-sm">E-MAIL INSTITUCIONAL (LOGIN)</label>
            <input
              type="email"
              className="input-field"
              value={user.email}
              disabled
              style={{ background: "var(--surface-container-lowest)", cursor: "not-allowed", opacity: 0.7 }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>O e-mail só pode ser alterado por administradores mestre.</span>
          </div>

          {/* Spacer */}
          {!isMobile && <div />}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label className="label-sm">NOME</label>
            <input
              className="input-field"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label className="label-sm">SOBRENOME</label>
            <input
              className="input-field"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
            />
          </div>

        </div>

        <div style={{ padding: isMobile ? "1rem" : "1.25rem 1.5rem", borderTop: "1px solid rgba(85,67,53,0.1)", background: "var(--surface-container)", display: "flex", justifyContent: "flex-end" }}>
          <Button variant="primary" onClick={handleUpdateProfile} style={{ width: isMobile ? "100%" : undefined, justifyContent: isMobile ? "center" : undefined }}>
            <Save size={16} style={{ marginRight: "0.5rem" }} /> SALVAR DADOS
          </Button>
        </div>
      </div>

      {/* SEÇÃO 2: SEGURANÇA E SENHA */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid rgba(85,67,53,0.1)",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: isMobile ? "1rem" : "1.25rem 1.5rem", borderBottom: "1px solid rgba(85,67,53,0.1)", display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--surface-container-lowest)" }}>
          <ShieldCheck size={20} color="var(--tertiary)" />
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0, color: "var(--on-surface)" }}>Segurança e Credenciais</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>Mantenha sua senha complexa e evite repeti-la em outros sites.</p>
          </div>
        </div>

        <div style={{ padding: isMobile ? "1rem" : "1.5rem", display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem", maxWidth: isMobile ? "100%" : "400px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label className="label-sm">SENHA ATUAL</label>
            <input
              type="password"
              className="input-field"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="Digite sua senha atual"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginTop: "0.5rem" }}>
            <label className="label-sm">NOVA SENHA</label>
            <input
              type="password"
              className="input-field"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label className="label-sm">CONFIRMAR NOVA SENHA</label>
            <input
              type="password"
              className="input-field"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a nova senha para confirmar"
            />
          </div>

        </div>

        <div style={{ padding: isMobile ? "1rem" : "1.25rem 1.5rem", borderTop: "1px solid rgba(85,67,53,0.1)", background: "var(--surface-container)", display: "flex", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={handleUpdatePassword} style={{ background: "var(--surface)", border: "1px solid rgba(85,67,53,0.2)", width: isMobile ? "100%" : undefined, justifyContent: isMobile ? "center" : undefined }}>
            <KeyRound size={16} style={{ marginRight: "0.5rem" }} /> ATUALIZAR SENHA
          </Button>
        </div>
      </div>
      
    </div>
  );
}
