"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Package,
  Settings,
  LogOut,
} from "lucide-react";
import { operadorAtivo } from "@/lib/mock-data";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/producao", label: "Produção", icon: Kanban },
  { href: "/estoque", label: "Estoque", icon: Package },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem 1.25rem",
          borderBottom: "1px solid rgba(85,67,53,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 36, height: 36, flexShrink: 0, position: "relative" }}>
            <Image
              src="/favicon.webp"
              alt="Rhino Kydex"
              width={36}
              height={36}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--on-surface)",
                lineHeight: 1,
              }}
            >
              Rhino
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--primary)",
                lineHeight: 1,
                marginTop: 3,
              }}
            >
              Kydex Systems
            </div>
          </div>
        </div>

        {/* Version */}
        <div
          className="label-sm"
          style={{ marginTop: "0.75rem", opacity: 0.4 }}
        >
          v4.2.0 Tactical Ops
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.5rem 0" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Operator info */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderTop: "1px solid rgba(85,67,53,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--surface-container-highest)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-headline)",
              fontSize: "0.625rem",
              fontWeight: 700,
              color: "var(--primary)",
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            {operadorAtivo.avatar}
          </div>
          <div>
            <div
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--on-surface)",
                lineHeight: 1.2,
              }}
            >
              {operadorAtivo.nome}
            </div>
            <div
              className="label-sm"
              style={{ marginTop: 2, letterSpacing: "0.06em" }}
            >
              {operadorAtivo.nivel}
            </div>
          </div>
        </div>

        <Link href="/login">
          <button
            className="btn-secondary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "0.5rem 1rem",
              fontSize: "0.6875rem",
            }}
          >
            <LogOut size={13} />
            Sair
          </button>
        </Link>
      </div>
    </aside>
  );
}
