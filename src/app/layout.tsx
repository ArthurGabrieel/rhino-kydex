import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { SessionProvider } from "@/components/auth/SessionProvider";

export const metadata: Metadata = {
  title: "RHINO KYDEX",
  description: "Sistema de gerenciamento de produção — Rhino Kydex Systems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>
          <SessionProvider>{children}</SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
