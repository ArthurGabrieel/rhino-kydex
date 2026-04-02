"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardBoard } from "@/components/dashboard/DashboardBoard";
import { useSession } from "@/components/auth/SessionProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSession();
  const isBlocked = user.role === "Colaborador";

  useEffect(() => {
    if (isBlocked) {
      router.replace("/producao");
    }
  }, [isBlocked, router]);

  if (isBlocked) {
    return null;
  }

  return <DashboardBoard />;
}
