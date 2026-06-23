
import { ExamCardProcessingPage } from "@/features/exam-card-processing/components/exam-card-page";
import { getAcademicAdminWorkspace } from "@/features/academic-admin/actions/get-academic-admin-workspace";

export const metadata = {
  title: "Exam Card Processing | IMTR Admin",
  description: "Generate and manage exam cards",
};

export default async function ExamCardPage() {
  const workspace = await getAcademicAdminWorkspace();
  const courses = workspace.courses.map((course) => ({
    department: course.department,
    id: course.id,
    intake: course.intake,
    level: course.level,
    name: course.courseName,
    terms: course.terms.map((term) => ({
      name: term.name,
      units: term.units.map((unit) => ({
        code: unit.code,
        name: unit.name,
      })),
    })),
  }));

  return <ExamCardProcessingPage courses={courses} />;
}
