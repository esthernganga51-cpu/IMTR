import type { StudentStatus } from "@/features/student-admissions/types/student";

type StatusBadgeProps = {
  status: StudentStatus;
};

const statusStyles: Record<StudentStatus, { bg: string; text: string }> = {
  pending: {
    bg: "bg-amber-100",
    text: "text-amber-800",
  },
  approved: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
  },
  rejected: {
    bg: "bg-rose-100",
    text: "text-rose-800",
  },
  deferred: {
    bg: "bg-slate-100",
    text: "text-slate-800",
  },
};

const statusLabels: Record<StudentStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  deferred: "Deferred",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text } = statusStyles[status];
  const label = statusLabels[status];

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}
