"use server";

import { getPendingStudents } from "@/features/student-admissions/data/mock-students";
import type { Student } from "@/features/student-admissions/types/student";

export async function getPendingStudentsData(): Promise<Student[]> {
  return getPendingStudents();
}
