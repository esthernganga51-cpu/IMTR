import type { DashboardMetric } from "@/features/admin-dashboard/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/admin-dashboard/components/ui/card";
import { cn } from "@/features/admin-dashboard/lib/utils";

const toneClasses: Record<DashboardMetric["tone"], string> = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-50 text-slate-700 ring-slate-200",
};

const trendClasses: Record<DashboardMetric["trend"], string> = {
  down: "text-emerald-700 bg-emerald-50",
  neutral: "text-slate-600 bg-slate-100",
  up: "text-blue-700 bg-blue-50",
};

type MetricCardProps = Readonly<{
  icon: React.ComponentType<{ className?: string }>;
  metric: DashboardMetric;
}>;

export function MetricCard({ icon: Icon, metric }: MetricCardProps) {
  return (
    <Card className="min-h-44 overflow-hidden border-border/80 bg-card/95 shadow-sm backdrop-blur">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div>
          <CardTitle className="max-w-48 text-sm font-medium leading-5 text-muted-foreground">
            {metric.label}
          </CardTitle>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-card-foreground">
            {metric.value}
          </p>
        </div>
        <span className={cn("rounded-md p-2 ring-1", toneClasses[metric.tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 text-sm text-muted-foreground">{metric.helper}</p>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              trendClasses[metric.trend],
            )}
          >
            {metric.delta}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
