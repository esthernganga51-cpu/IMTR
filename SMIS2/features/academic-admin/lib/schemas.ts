import { z } from "zod";

import { courseConfigurationFormDefinition } from "@/features/academic-admin/lib/form-definition";
import type {
  CourseConfigurationFormValues,
  DynamicFieldDefinition,
} from "@/features/academic-admin/types/academic";

export const courseConfigurationSchema = buildObjectSchema(
  courseConfigurationFormDefinition.fields,
) as unknown as z.ZodType<CourseConfigurationFormValues, CourseConfigurationFormValues>;

export const batchEnrollmentSchema = z.object({
  cohortId: z.string().min(1, "Select a cohort."),
  courseId: z.string().min(1, "Select a course."),
  idempotencyKey: z.string().uuid("A valid transaction key is required."),
  termId: z.string().min(1, "Select a term."),
  unitCodes: z.array(z.string().min(1)).min(1, "Select at least one mandatory unit."),
});

function buildObjectSchema(fields: DynamicFieldDefinition[]) {
  return z.object(
    Object.fromEntries(fields.map((field) => [field.name, buildFieldSchema(field)])),
  );
}

function buildFieldSchema(field: DynamicFieldDefinition): z.ZodType {
  if (field.kind === "array") {
    return z
      .array(buildObjectSchema(field.fields))
      .min(field.minItems, field.validation.requiredMessage);
  }

  if (field.kind === "multiselect") {
    return z
      .array(z.string().trim().min(1))
      .min(field.minSelected, field.validation.requiredMessage);
  }

  const requiredMessage = field.validation.requiredMessage;

  if (field.kind === "select") {
    return z
      .string()
      .trim()
      .min(1, requiredMessage)
      .refine(
        (value) => field.options.some((option) => option.value === value),
        "Choose a valid option.",
      );
  }

  return z
    .string()
    .trim()
    .min(field.validation.minLength ?? 1, requiredMessage);
}
