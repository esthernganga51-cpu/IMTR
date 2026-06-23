import { getPendingStudentsData } from "@/features/student-admissions/actions/get-pending-students";
import { StudentsTable } from "@/features/student-admissions/components/students-table";

export default async function StudentAdmissionsPage() {
  const students = await getPendingStudentsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Student Admissions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review and manage pending student applications
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Pending Applications ({students.length})
          </h2>
        </div>

        <StudentsTable students={students} />
      </div>
    </div>
  );
}
