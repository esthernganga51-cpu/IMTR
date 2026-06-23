import { getDashboardMetrics } from "@/features/admin-dashboard/actions/get-dashboard-metrics";
import { AdminDashboard } from "@/features/admin-dashboard/components/admin-dashboard";

export default async function Home() {
  const data = await getDashboardMetrics();

  return <AdminDashboard data={data} />;
}
