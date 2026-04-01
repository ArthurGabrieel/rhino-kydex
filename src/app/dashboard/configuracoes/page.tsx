import { Settings, Shield, Bell, Database, Monitor } from "lucide-react";

export default function ConfiguracoesPage() {
  const sections = [
    {
      icon: Shield,
      title: "Segurança",
      desc: "Autenticação, permissões de operadores e controle de acesso.",
      status: "Configurado",
      ok: true,
    },
    {
      icon: Bell,
      title: "Notificações",
      desc: "Alertas de estoque, métricas de produção e relatórios.",
      status: "3 alertas ativos",
      ok: false,
    },
    {
      icon: Database,
      title: "Integração de Dados",
      desc: "Conexão com ERP, exportação CSV e relatórios automáticos.",
      status: "Conectado",
      ok: true,
    },
    {
      icon: Monitor,
      title: "Sistema",
      desc: "Versão do framework, logs de sistema e diagnósticos.",
      status: "v4.2.0 — OK",
      ok: true,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
          <h1 className="headline-md">Configurações</h1>
          <span className="chip">Sistema</span>
        </div>
        <p className="label-sm">
          Gerenciamento do Tactical Ops Framework · v4.2.0
        </p>
      </div>

      <div className="page-body">
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}
        >
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.title}
                className="card animate-fade-in"
                style={{
                  borderLeft: `2px solid ${sec.ok ? "rgba(85,67,53,0.2)" : "var(--tertiary-container)"}`,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "var(--surface-container-highest)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} color="var(--on-surface-variant)" />
                  </div>
                  <span
                    className="chip"
                    style={{
                      background: sec.ok ? "rgba(126,200,142,0.1)" : "rgba(255,136,129,0.1)",
                      color: sec.ok ? "#7ec88e" : "var(--tertiary)",
                      fontSize: "0.625rem",
                    }}
                  >
                    {sec.status}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {sec.title}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)", lineHeight: 1.5 }}>
                  {sec.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* System info block */}
        <div
          className="card-low"
          style={{ marginTop: "1.5rem", background: "var(--surface-container-lowest)", fontFamily: "monospace" }}
        >
          <div className="label-sm" style={{ marginBottom: "1rem" }}>
            <Settings size={11} style={{ display: "inline", marginRight: "0.375rem" }} />
            Informações do Sistema
          </div>

          {[
            ["FRAMEWORK", "Rhino Kydex Tactical Ops v4.2.0"],
            ["RUNTIME", "Next.js 15 · React 19 · TypeScript"],
            ["OPERADOR_ATIVO", "JORGE · Sessão SES-4821"],
            ["UPTIME", "14h 22min"],
            ["PEDIDOS_HOJ", "34 processados"],
            ["DB_STATUS", "CONNECTED · Latência: 2ms"],
          ].map(([key, val]) => (
            <div
              key={key}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "0.375rem 0",
                borderBottom: "1px solid rgba(85,67,53,0.08)",
                fontSize: "0.75rem",
              }}
            >
              <span style={{ color: "var(--primary)", opacity: 0.7, minWidth: 160, flexShrink: 0 }}>
                {key}:
              </span>
              <span style={{ color: "var(--on-surface-variant)" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
