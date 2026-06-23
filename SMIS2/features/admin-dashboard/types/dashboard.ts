export type DashboardMetricIcon =
  | "bed"
  | "building"
  | "clipboard"
  | "graduation"
  | "message"
  | "users"
  | "wallet";

export type DashboardMetricTone = "amber" | "blue" | "emerald" | "indigo" | "rose" | "slate";

export type DashboardMetricTrend = "down" | "neutral" | "up";

export type DashboardMetric = {
  delta: string;
  helper: string;
  icon: DashboardMetricIcon;
  id: string;
  label: string;
  tone: DashboardMetricTone;
  trend: DashboardMetricTrend;
  value: string;
};

export type DashboardOverviewItem = {
  label: string;
  value: string;
  helper: string;
};

export type DashboardPriorityItem = {
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
};

export type DashboardData = {
  metrics: DashboardMetric[];
  overview: DashboardOverviewItem[];
  priorityQueue: DashboardPriorityItem[];
};
