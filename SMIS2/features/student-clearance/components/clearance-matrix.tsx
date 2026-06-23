"use client";

import { useTransition, useState } from "react";
import type { StudentClearance, Department, DepartmentId, ClearanceStatusType } from "@/features/student-clearance/types/clearance";
import { updateClearanceStatus } from "@/features/student-clearance/actions/clearance-mutations";

const statusColorMap: Record<string, string> = {
  pending: "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300",
  approved: "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300",
  rejected: "bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300",
  exempt: "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300",
};

const statusLabelMap: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  exempt: "Exempt",
};

const statusCycleOrder: ClearanceStatusType[] = ["pending", "approved", "rejected", "exempt"];

type ClearanceMatrixProps = {
  students: StudentClearance[];
  departments: Department[];
};

export function ClearanceMatrix({ students: initialStudents, departments }: ClearanceMatrixProps) {
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState(initialStudents);

  const handleStatusChange = (
    studentId: string,
    departmentId: DepartmentId,
    currentStatus: string
  ) => {
    // Cycle to next status
    const nextIndex = (statusCycleOrder.indexOf(currentStatus as ClearanceStatusType) + 1) % statusCycleOrder.length;
    const newStatus = statusCycleOrder[nextIndex];

    // Optimistic update
    setStudents((prev) =>
      prev.map((student) => {
        if (student.studentId !== studentId) return student;
        return {
          ...student,
          departmentClearances: student.departmentClearances.map((dc) => {
            if (dc.departmentId !== departmentId) return dc;
            return { ...dc, status: newStatus, requiresAction: newStatus !== "approved" && newStatus !== "exempt" };
          }),
        };
      })
    );

    // Server mutation in background
    startTransition(async () => {
      const result = await updateClearanceStatus({
        studentId,
        departmentId,
        newStatus,
      });

      if (!result.success) {
        // Rollback on error
        console.error("Failed to update clearance:", result.error);
        setStudents(initialStudents);
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 border-b bg-card px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
              Student Name
            </th>
            <th className="border-b bg-card px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
              App ID
            </th>
            {departments.map((dept) => (
              <th
                key={dept.id}
                className="border-b bg-card px-2 py-2 text-center text-xs font-semibold text-muted-foreground"
                title={dept.description}
              >
                {dept.abbreviation}
              </th>
            ))}
            <th className="border-b bg-card px-4 py-2 text-center text-xs font-semibold text-muted-foreground">
              Progress
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId} className="border-b hover:bg-muted/30 transition">
              <td className="sticky left-0 border-r bg-card px-4 py-3 text-sm font-medium">
                {student.studentName}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{student.applicationId}</td>
              {departments.map((dept) => {
                const clearance = student.departmentClearances.find(
                  (c) => c.departmentId === dept.id
                );
                const status = clearance?.status || "pending";
                return (
                  <td key={`${student.studentId}-${dept.id}`} className="border-x px-2 py-3 text-center">
                    <button
                      onClick={() =>
                        handleStatusChange(
                          student.studentId,
                          dept.id,
                          status
                        )
                      }
                      disabled={isPending}
                      title={`Click to cycle: ${status} → next status`}
                      className={`inline-block rounded border px-2 py-1 text-xs font-medium transition-all disabled:opacity-50 ${
                        statusColorMap[status]
                      }`}
                    >
                      {statusLabelMap[status]}
                    </button>
                  </td>
                );
              })}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center gap-2">
                  <div className="w-16 rounded-full bg-muted h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        student.clearancePercentage === 100
                          ? "bg-emerald-500"
                          : student.clearancePercentage >= 50
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }`}
                      style={{ width: `${student.clearancePercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right">
                    {student.clearancePercentage}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
