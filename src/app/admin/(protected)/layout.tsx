import { requireAdmin } from "@/lib/server/auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return children;
}
