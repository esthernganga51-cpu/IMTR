import StudentClearancePage from "@/features/student-clearance/components/student-clearance-page";
import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";

export default function ClearanceRoutePage() {
  return (
    <AdminShell>
      <StudentClearancePage />
    </AdminShell>
  );
}


