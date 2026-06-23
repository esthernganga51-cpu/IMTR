"use server";

import { z } from "zod";
import {
  updateClearanceStatusSchema,
  batchClearanceUpdateSchema,
} from "@/features/student-clearance/lib/schemas";
import {
  updateClearanceStatusInDb,
  batchUpdateClearanceInDb,
} from "@/features/student-clearance/data/clearance-db";
import type {
  UpdateClearanceStatusResponse,
  BatchClearanceUpdateResponse,
  ClearanceStatusType,
} from "@/features/student-clearance/types/clearance";
import type { DepartmentId } from "@/features/student-clearance/types/clearance";

export async function updateClearanceStatus(
  input: unknown
): Promise<UpdateClearanceStatusResponse> {
  try {
    const validated = updateClearanceStatusSchema.parse(input);
    const clearance = await updateClearanceStatusInDb(
      validated.studentId,
      validated.departmentId as DepartmentId,
      validated.newStatus as ClearanceStatusType,
      validated.approvedBy,
      validated.notes
    );

    if (!clearance) {
      return {
        success: false,
        message: "Student not found",
        error: "STUDENT_NOT_FOUND",
      };
    }

    const affectedDepartment = clearance.departmentClearances.find(
      (d) => d.departmentId === validated.departmentId
    );

    return {
      success: true,
      message: `Clearance updated to ${validated.newStatus}`,
      clearance,
      affectedDepartment,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        error: error.issues[0]?.message || "Validation error",
      };
    }

    return {
      success: false,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function batchUpdateClearanceStatus(
  input: unknown
): Promise<BatchClearanceUpdateResponse> {
  try {
    const validated = batchClearanceUpdateSchema.parse(input);
    const result = await batchUpdateClearanceInDb(
      validated.studentIds,
      validated.departmentId as DepartmentId,
      validated.newStatus as ClearanceStatusType,
      validated.approvedBy,
      validated.notes
    );

    return {
      success: result.errors.length === 0,
      message: `Updated ${result.updated.length} student(s)`,
      updatedCount: result.updated.length,
      errors: result.errors.length > 0 ? result.errors : undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        updatedCount: 0,
        errors: [{ studentId: "batch", error: error.issues[0]?.message || "Validation error" }],
      };
    }

    return {
      success: false,
      message: "An error occurred",
      updatedCount: 0,
      errors: [{ studentId: "batch", error: "Unknown error" }],
    };
  }
}
