"use client";

import EstoqueBoard from "@/components/estoque/EstoqueBoard";
import { useSession } from "@/components/auth/SessionProvider";

export default function EstoquePage() {
  const { isReadOnlyEstoque } = useSession();
  return <EstoqueBoard isReadOnly={isReadOnlyEstoque} />;
}
