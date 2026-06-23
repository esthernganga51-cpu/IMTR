"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import {
  enqueueCohortEnrollment,
  saveCourseConfiguration,
} from "@/features/academic-admin/data/mock-academic-admin";
import {
  batchEnrollmentSchema,
  courseConfigurationSchema,
} from "@/features/academic-admin/lib/schemas";
import type {
  BatchEnrollmentActionResult,
  CourseConfigurationActionResult,
} from "@/features/academic-admin/types/academic";

export async function createCourseConfiguration(
  input: unknown,
): Promise<CourseConfigurationActionResult> {
  try {
    const values = courseConfigurationSchema.parse(input);
    const course = await saveCourseConfiguration(values);

    revalidatePath("/academics");
    revalidatePath("/course-management");
    revalidatePath("/course- management");

    return {
      course,
      message: `${course.courseName} was configured successfully.`,
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.issues.at(0)?.message ?? "Invalid course configuration.",
        message: "Course configuration failed validation.",
        success: false,
      };
    }

    return {
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Course configuration could not be saved.",
      success: false,
    };
  }
}

export async function queueCohortUnitEnrollment(
  input: unknown,
): Promise<BatchEnrollmentActionResult> {
  try {
    const values = batchEnrollmentSchema.parse(input);
    const job = await enqueueCohortEnrollment(values);

    revalidatePath("/academics");

    return {
      job,
      message: `Enrollment transaction ${job.transactionId} has been queued.`,
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.issues.at(0)?.message ?? "Invalid enrollment batch.",
        message: "Enrollment batch failed validation.",
        success: false,
      };
    }

    return {
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Enrollment batch could not be queued.",
      success: false,
    };
  }
}
