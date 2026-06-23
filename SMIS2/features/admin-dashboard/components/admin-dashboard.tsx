import {
  BedDouble,
  Building2,
  ClipboardCheck,
  Download,
  GraduationCap,
  MessageSquareWarning,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";
import { MetricCard } from "@/features/admin-dashboard/components/metric-card";
import { Button } from "@/features/admin-dashboard/components/ui/button";
import type { DashboardData, DashboardMetricIcon } from "@/features/admin-dashboard/types/dashboard";

const metricIcons: Record<DashboardMetricIcon, React.ComponentType<{ className?: string }>> = {
  bed: BedDouble,
  building: Building2,
  clipboard: ClipboardCheck,
  graduation: GraduationCap,
  message: MessageSquareWarning,
  users: UsersRound,
  wallet: WalletCards,
};

type AdminDashboardProps = Readonly<{
  data: DashboardData;
}>;

export function AdminDashboard({ data }: AdminDashboardProps) {
  return (
    <AdminShell>
      <section
        aria-label="Administrative metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} icon={metricIcons[metric.icon]} />
        ))}
      </section>

      <section className="mt-7 grid gap-7 xl:grid-cols-[1.4fr_0.9fr]">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Operational pulse</p>
              <h2 className="mt-1 text-xl font-semibold tracking-normal text-card-foreground">
                Term overview
              </h2>
            </div>
            <Button variant="outline" size="sm">
              <Download className="size-4" aria-hidden="true" />
              Export report
            </Button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {data.overview.map(({ label, value, helper }) => (
              <div key={label} className="rounded-md border bg-card p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Priority queue</p>
          <h2 className="mt-1 text-xl font-semibold tracking-normal text-card-foreground">
            Today&apos;s admin focus
          </h2>
          <div className="mt-5 space-y-3">
            {data.priorityQueue.map(({ title, detail, priority }) => (
              <div key={title} className="rounded-md border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{title}</p>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
