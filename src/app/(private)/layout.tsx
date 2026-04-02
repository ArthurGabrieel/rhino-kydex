import PrivateShell from "@/components/layout/PrivateShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateShell>{children}</PrivateShell>;
}
