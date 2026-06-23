import { fetchClearanceMatrix } from "@/features/student-clearance/actions/fetch-clearance";
import { ClearanceMatrix } from "@/features/student-clearance/components/clearance-matrix";
import { ClearanceSummaryCards } from "@/features/student-clearance/components/clearance-summary-cards";

export default async function StudentClearancePage() {
  const data = await fetchClearanceMatrix();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Student Clearance</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Multi-department clearance matrix for student admissions
        </p>
      </div>

      {/* Summary Cards */}
      <ClearanceSummaryCards summary={data.summary} />

      {/* Clearance Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Clearance Matrix</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Click on a department cell to cycle through statuses: Pending → Approved → Rejected → Exempt
          </p>
        </div>
        <div className="rounded-md border bg-card shadow-sm overflow-auto">
          <ClearanceMatrix
            students={data.students}
            departments={data.departments}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-md border bg-muted/30 p-4">
        <p className="text-sm font-semibold">Clearance Status Legend</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 border-amber-300 bg-amber-100" />
            <span className="text-xs text-muted-foreground">Pending Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 border-emerald-300 bg-emerald-100" />
            <span className="text-xs text-muted-foreground">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 border-rose-300 bg-rose-100" />
            <span className="text-xs text-muted-foreground">Rejected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 border-blue-300 bg-blue-100" />
            <span className="text-xs text-muted-foreground">Exempt</span>
          </div>
        </div>
      </div>

      {/* Department Reference */}
      <div className="rounded-md border bg-card p-4 shadow-sm">
        <p className="text-sm font-semibold">Department Abbreviations</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
          {data.departments.map((dept) => (
            <div key={dept.id}>
              <p className="font-semibold">{dept.abbreviation}</p>
              <p className="text-muted-foreground">{dept.name}</p>
              <p className="mt-1 text-[10px]">{dept.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
