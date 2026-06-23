import { CourseList } from "@/features/admin-dashboard/components/course list/CourseList";
import { getAcademicAdminWorkspace } from "@/features/academic-admin/actions/get-academic-admin-workspace";

export const metadata = {
  title: "Course Management | IMTR Admin",
  description: "Manage training and degree programs.",
};

export default async function CoursesPage() {
  const workspace = await getAcademicAdminWorkspace();

  return <CourseList initialCourses={workspace.courses} />;
}
