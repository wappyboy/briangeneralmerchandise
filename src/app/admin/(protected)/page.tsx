import { AdminConsole } from "@/components/admin/AdminConsole";
import { getAdminSnapshot } from "@/lib/server/store";

export default async function AdminPage() {
  const snapshot = await getAdminSnapshot();
  return <AdminConsole initialData={snapshot} />;
}
