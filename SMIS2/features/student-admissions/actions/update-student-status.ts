"use server";

import { z } from "zod";
import { updateStudentStatusSchema } from "@/features/student-admissions/lib/schemas";
import { updateStudentStatus as dbUpdateStudentStatus } from "@/features/student-admissions/data/mock-students";
import type { StudentActionResult } from "@/features/student-admissions/types/student";

export async function updateStudentStatus(input: unknown): Promise<StudentActionResult> {
  try {
    // Validate input with Zod
    const validatedInput = updateStudentStatusSchema.parse(input);

    // Update in database
    const updatedStudent = await dbUpdateStudentStatus(
      validatedInput.studentId,
      validatedInput.status
    );

    if (!updatedStudent) {
      return {
        success: false,
        message: "Student not found",
        error: "STUDENT_NOT_FOUND",
      };
    }

    return {
      success: true,
      message: `Student status updated to ${validatedInput.status}`,
      student: updatedStudent,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        error: error.issues[0]?.message || "Unknown validation error",
      };
    }

    return {
      success: false,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
