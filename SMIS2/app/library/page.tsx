import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";
import { RequirePermission } from "@/features/lib/rbac/RequirePermission";

// NOTE: This app currently has no real auth/session wiring. We provide a stub user
// to keep the library module development unblocked.
// Replace `stubUser` with your real session user object.
const stubUser = {
  id: "stub",
  role: "librarian",
  permissions: [] as string[],
};

export default function LibraryDashboardPage() {
  return (
    <AdminShell>
      <RequirePermission user={stubUser} permission="library_dashboard">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Library Management</h1>
          <p className="text-sm text-muted-foreground">
            Library dashboard is under construction. Core DB + workflows will be
            wired next.
          </p>
        </div>
      </RequirePermission>
    </AdminShell>
  );
}

