"use client";

import { useState } from "react";
import { X, ShieldAlert, KeyRound, Check, LayoutGrid, Box, Factory, BarChart } from "lucide-react";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import type { OperadorConfig } from "./types";

export function OperadorModal({
  operador, // If undefined, it's creation mode
  onClose,
  onSave,
}: {
  operador?: OperadorConfig;
  onClose: () => void;
  onSave: (op: Omit<OperadorConfig, "id" | "avatar"> | OperadorConfig) => void;
}) {
  const [activeTab, setActiveTab] = useState<"dados" | "acesso">("dados");

  // State
  const [nome, setNome] = useState(operador?.nome || "");
  const [sobrenome, setSobrenome] = useState(operador?.sobrenome || "");
  const [email, setEmail] = useState(operador?.email || "");
  const [senha, setSenha] = useState("");
  const [funcao, setFuncao] = useState(operador?.funcao || "Moldagem");
  const [turno, setTurno] = useState(operador?.turno || "Manhã");
  const [nivel, setNivel] = useState<OperadorConfig["nivel"]>(operador?.nivel || "Júnior");
  
  const [role, setRole] = useState<OperadorConfig["role"]>(operador?.role || "Colaborador");
  const [ativo, setAtivo] = useState<boolean>(operador?.ativo ?? true);

  const MODULOS_POR_ROLE: Record<string, string[]> = {
    Administrador: ["Dashboard", "Estoque", "Produção", "Kanban"],
    Gerente: ["Dashboard", "Produção", "Kanban", "Relatórios"],
    Colaborador: ["Produção", "Kanban"],
  };

  const modulosDerivados = MODULOS_POR_ROLE[role] || [];

  const { showToast } = useToast();

  const isEditing = !!operador;

  const MODULOS_DISPONIVEIS = [
    { id: "Dashboard", label: "Dashboard", icon: BarChart },
    { id: "Estoque", label: "Estoque", icon: Box },
    { id: "Produção", label: "Produção", icon: Factory },
    { id: "Kanban", label: "Gestão Kanban", icon: LayoutGrid },
    { id: "Relatórios", label: "Relatórios Gerais", icon: BarChart },
  ];

  const handleSave = () => {
    if (!nome.trim() || !sobrenome.trim() || !email.trim()) {
      showToast("Por favor, preencha os dados obrigatórios: Nome, Sobrenome e E-mail.", "error");
      setActiveTab("dados");
      return;
    }

    if (!isEditing && !senha.trim()) {
      showToast("Obrigatório configurar uma senha inicial para novos usuários.", "error");
      setActiveTab("acesso");
      return;
    }

    if (isEditing) {
      onSave({
        ...operador,
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.trim(),
        funcao,
        turno,
        nivel,
        role,
        ativo,
        modulos: modulosDerivados
      } as OperadorConfig);
    } else {
      onSave({
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.trim(),
        funcao,
        turno,
        nivel,
        role,
        ativo,
        modulos: modulosDerivados
      });
    }

    showToast(
      isEditing 
        ? `Operador ${nome} atualizado com sucesso.` 
        : `O acesso para ${nome} foi gerado com sucesso.`, 
      "success"
    );
    onClose();
  };

  const handleResetPassword = () => {
    showToast(`Um link seguro foi gerado para o e-mail de ${nome}.`, "success");
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "1rem",
    }}>
      <div style={{
        background: "var(--surface)",
        width: "100%",
        maxWidth: "600px",
        height: "85vh",
        maxHeight: "700px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        animation: "slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          background: "var(--surface-container-low)",
          borderBottom: "1px solid rgba(85,67,53,0.1)"
        }}>
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>
              {isEditing ? `Editar Operador: ${nome}` : "Novo Operador"}
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>
              {isEditing ? `ID de registro: #${operador.id}` : "Configure os dados e acessos básicos"}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: "transparent", border: "none", cursor: "pointer", 
              color: "var(--on-surface-variant)" 
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid rgba(85,67,53,0.1)",
          background: "var(--surface-container-lowest)",
          padding: "0 1.5rem"
        }}>
          {[
            { id: "dados", label: "Informações Cadastrais" },
            { id: "acesso", label: "Acesso e Segurança" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: "transparent",
                border: "none",
                padding: "1rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "var(--primary)" : "var(--on-surface-variant)",
                borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
        }}>
          {activeTab === "dados" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label className="label-sm">NOME</label>
                  <input
                    className="input-field"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label className="label-sm">SOBRENOME</label>
                  <input
                    className="input-field"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    placeholder="Ex: Silva"
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <label className="label-sm">E-MAIL INSTITUCIONAL</label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: carlos.silva@rhino.com"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label className="label-sm">FUNÇÃO PRINCIPAL</label>
                  <select
                    className="input-field"
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value)}
                  >
                    <option value="Moldagem">Moldagem</option>
                    <option value="Acabamento">Acabamento</option>
                    <option value="Montagem Final">Montagem Final</option>
                    <option value="Controle de Qualidade">Controle de Qualidade</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Gerência">Gerência</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label className="label-sm">TURNO</label>
                  <select
                    className="input-field"
                    value={turno}
                    onChange={(e) => setTurno(e.target.value)}
                  >
                    <option value="Manhã">Manhã (06:00 - 14:00)</option>
                    <option value="Tarde">Tarde (14:00 - 22:00)</option>
                    <option value="Noite">Noite (22:00 - 06:00)</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="label-sm">NÍVEL / SENIORIDADE</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["Júnior", "Pleno", "Sênior"].map(nv => (
                    <button
                      key={nv}
                      onClick={() => setNivel(nv as any)}
                      style={{
                        flex: 1,
                        padding: "0.625rem",
                        background: nivel === nv ? "var(--primary)" : "var(--surface-container-high)",
                        color: nivel === nv ? "#fff" : "var(--on-surface)",
                        border: "none",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {nv}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "acesso" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Role Selection */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label className="label-sm">PERFIL DE ACESSO (ROLE)</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
                  {[
                    { id: "Administrador", desc: "Acesso total, incluindo configurações vitais e billing." },
                    { id: "Gerente", desc: "Gestão operacional e relatórios agregados." },
                    { id: "Colaborador", desc: "Acesso restrito apenas para execução de tarefas." }
                  ].map(r => (
                    <div 
                      key={r.id} 
                      onClick={() => setRole(r.id as any)}
                      style={{
                        padding: "1rem",
                        background: role === r.id ? "rgba(247,146,31,0.08)" : "var(--surface-container-lowest)",
                        border: role === r.id ? "1px solid var(--primary)" : "1px solid rgba(85,67,53,0.1)",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "1rem",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "50%",
                        border: role === r.id ? "5px solid var(--primary)" : "2px solid rgba(85,67,53,0.3)",
                      }} />
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface)" }}>
                          {r.id}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.125rem" }}>
                          {r.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Switch (Only for existing users) */}
              {isEditing && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: ativo ? "rgba(126,200,142,0.1)" : "rgba(255,136,129,0.1)", borderLeft: ativo ? "2px solid #7ec88e" : "2px solid var(--tertiary)" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface)" }}>
                      STATUS DA CONTA: {ativo ? "ATIVA" : "BLOQUEADA"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>
                      {ativo ? "O usuário tem acesso operacional ao sistema." : "O acesso está revogado. O histórico de ações será mantido."}
                    </div>
                  </div>
                  <Button 
                      variant="secondary"
                      onClick={() => setAtivo(!ativo)}
                      style={{ background: "var(--surface)", border: "1px solid rgba(85,67,53,0.2)" }}
                  >
                      {ativo ? "Suspender Acesso" : "Reativar Acesso"}
                  </Button>
                </div>
              )}

              {/* Modules Badges */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label className="label-sm">MÓDULOS PERMITIDOS NESTE PERFIL</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {MODULOS_DISPONIVEIS.map(m => {
                    const isSelected = modulosDerivados.includes(m.id);
                    if (!isSelected) return null;
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          background: "var(--surface-container-low)",
                          border: "1px solid rgba(85,67,53,0.2)",
                          color: "var(--on-surface-variant)",
                          fontSize: "0.75rem", fontWeight: 600,
                        }}
                      >
                        <Icon size={14} />
                        {m.label}
                      </div>
                    );
                  })}
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                  As permissões de módulos são atreladas ao perfil de acesso (Role) selecionado acima.
                </span>
              </div>

              {/* Password Action */}
              {isEditing ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", padding: "1rem", background: "rgba(255,136,129,0.05)", borderLeft: "2px solid var(--tertiary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <ShieldAlert size={18} color="var(--tertiary)" />
                    <div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--on-surface)" }}>Segurança e Credenciais</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>O funcionário esqueceu a senha?</div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={handleResetPassword}>
                    <KeyRound size={14} style={{ marginRight: "0.5rem" }} /> RESETAR SENHA
                  </Button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <KeyRound size={16} color="var(--on-surface-variant)" />
                    <label className="label-sm">DEFINIR SENHA INICIAL</label>
                  </div>
                  <input
                    type="password"
                    className="input-field"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Senha provisória do usuário"
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                    O usuário será forçado a redefinir esta senha no primeiro login.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "1.25rem 1.5rem",
          background: "var(--surface-container)",
          borderTop: "1px solid rgba(85,67,53,0.1)",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.75rem"
        }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? "Salvar Alterações" : "Confirmar e Criar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
