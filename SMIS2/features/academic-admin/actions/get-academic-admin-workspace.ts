"use server";

import { getAcademicAdminSnapshot } from "@/features/academic-admin/data/mock-academic-admin";
import type { AcademicAdminWorkspace } from "@/features/academic-admin/types/academic";

export async function getAcademicAdminWorkspace(): Promise<AcademicAdminWorkspace> {
  return getAcademicAdminSnapshot();
}
