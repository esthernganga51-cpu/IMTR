"use server";

import { getClearanceMatrixFromDb } from "@/features/student-clearance/data/clearance-db";

export async function fetchClearanceMatrix() {
  const data = await getClearanceMatrixFromDb();
  
  return {
    students: data.students,
    departments: data.departments,
    summary: data.summary,
  };
}
