"use client";

import { useTransition } from "react";
import { updateStudentStatus } from "@/features/student-admissions/actions/update-student-status";
import type { StudentStatus } from "@/features/student-admissions/types/student";

type StatusActionsProps = {
  studentId: string;
  currentStatus: StudentStatus;
  onStatusChange: (studentId: string, newStatus: StudentStatus) => void;
};

export function StatusActions({
  studentId,
  currentStatus,
  onStatusChange,
}: StatusActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: StudentStatus) => {
    // Optimistic update - sub-50ms latency
    onStatusChange(studentId, newStatus);

    // Server mutation in background
    startTransition(async () => {
      const result = await updateStudentStatus({
        studentId,
        status: newStatus,
      });

      if (!result.success) {
        // Revert optimistic update on error
        onStatusChange(studentId, currentStatus);
        console.error(result.error);
      }
    });
  };

  const buttonStyle =
    "px-3 py-1 text-sm font-medium rounded transition-colors disabled:opacity-50";

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatusChange("approved")}
        disabled={isPending || currentStatus !== "pending"}
        className={`${buttonStyle} bg-emerald-500 text-white hover:bg-emerald-600`}
        title="Approve student"
      >
        Approve
      </button>
      <button
        onClick={() => handleStatusChange("rejected")}
        disabled={isPending || currentStatus !== "pending"}
        className={`${buttonStyle} bg-rose-500 text-white hover:bg-rose-600`}
        title="Reject student"
      >
        Reject
      </button>
      <button
        onClick={() => handleStatusChange("deferred")}
        disabled={isPending || currentStatus !== "pending"}
        className={`${buttonStyle} bg-slate-500 text-white hover:bg-slate-600`}
        title="Defer decision"
      >
        Defer
      </button>
    </div>
  );
}
