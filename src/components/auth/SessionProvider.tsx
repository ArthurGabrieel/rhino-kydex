"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { operadorAtivo } from "@/lib/mock-data";

export type UserRole = "Administrador" | "Gerente" | "Colaborador";

interface SessionUser {
  email: string;
  nome: string;
  avatar: string;
  nivel: string;
  role: UserRole;
}

interface SessionContextValue {
  user: SessionUser;
  setUser: (next: SessionUser) => void;
  logout: () => void;
  isReadOnlyEstoque: boolean;
}

const STORAGE_KEY = "rhino.session.v1";

const DEFAULT_USER: SessionUser = {
  email: "jorge@rhino.com",
  nome: operadorAtivo.nome,
  avatar: operadorAtivo.avatar,
  nivel: operadorAtivo.nivel,
  role: "Administrador",
};

function getInitialUser(): SessionUser {
  if (typeof window === "undefined") {
    return DEFAULT_USER;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER;

    const saved = JSON.parse(raw) as SessionUser & { usuario?: string };
    const email = saved.email ?? (saved.usuario ? `${saved.usuario}@rhino.com` : "");

    if (
      saved &&
      email &&
      saved.nome &&
      saved.avatar &&
      saved.nivel &&
      (saved.role === "Administrador" ||
        saved.role === "Gerente" ||
        saved.role === "Colaborador")
    ) {
      return {
        email,
        nome: saved.nome,
        avatar: saved.avatar,
        nivel: saved.nivel,
        role: saved.role,
      };
    }

    return DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<SessionUser>(getInitialUser);

  const setUser = useCallback((next: SessionUser) => {
    setUserState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setUserState(DEFAULT_USER);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      setUser,
      logout,
      isReadOnlyEstoque: user.role !== "Administrador",
    }),
    [user, setUser, logout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession deve ser usado dentro de SessionProvider");
  }
  return context;
}
