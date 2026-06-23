"use client";

import type { ClearanceSummary, DepartmentId } from "@/features/student-clearance/types/clearance";

type ClearanceSummaryCardsProps = {
  summary: ClearanceSummary;
};

export function ClearanceSummaryCards({ summary }: ClearanceSummaryCardsProps) {
  const departments = ["finance", "library", "academic", "sports"] as const;

  return (
    <div className="space-y-4">
      {/* Overall Summary */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Total Students</p>
          <p className="mt-2 text-2xl font-bold">{summary.totalStudents}</p>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Fully Cleared</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{summary.fullyCleared}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {Math.round((summary.fullyCleared / summary.totalStudents) * 100)}%
          </p>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Partially Cleared</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{summary.partiallyCleared}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {Math.round((summary.partiallyCleared / summary.totalStudents) * 100)}%
          </p>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Pending Review</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">{summary.pendingStudents}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {Math.round((summary.pendingStudents / summary.totalStudents) * 100)}%
          </p>
        </div>
      </div>

      {/* Per-Department Breakdown */}
      <div className="grid gap-3 md:grid-cols-2">
        {departments.map((deptId) => {
          const dept = summary.perDepartment[deptId as DepartmentId];
          const deptNames: Record<string, string> = {
            finance: "Finance",
            library: "Library",
            academic: "Academic",
            sports: "Sports",
          };

          return (
            <div key={deptId} className="rounded-md border bg-card p-4 shadow-sm">
              <h3 className="font-semibold text-foreground">{deptNames[deptId]}</h3>
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="mt-1 font-bold">{dept.total}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Approved</p>
                  <p className="mt-1 font-bold text-emerald-600">{dept.approved}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pending</p>
                  <p className="mt-1 font-bold text-amber-600">{dept.pending}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rejected</p>
                  <p className="mt-1 font-bold text-rose-600">{dept.rejected}</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.round((dept.approved / dept.total) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
