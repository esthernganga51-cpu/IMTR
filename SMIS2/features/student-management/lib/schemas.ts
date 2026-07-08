/**
 * Student Validation Schemas
 * Zod schemas for form validation
 */

import { z } from "zod";

const baseStudentFormSchema = z.object({
    admissionNumber: z
    .string()
    .min(1, "Admission number is required")
    .max(50, "Admission number too long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Invalid phone number"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  gender: z.enum(["male", "female", "other"]),
  studentType: z.enum(["KENYAN", "INTERNATIONAL"]),
  nationalIdNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  nationality: z.string().optional(),
  course: z.string().min(1, "Course is required"),

  level: z.string().min(1, "Level is required"),
  intake: z.string().min(1, "Intake month is required"),
  department: z.string().min(1, "Department is required"),
  status: z.enum(["active", "inactive", "graduated", "suspended"]),
  enrollmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
});

export const studentFormSchema = baseStudentFormSchema.superRefine((val, ctx) => {
  const trimmedNationalId = val.nationalIdNumber?.trim() || "";
  const trimmedPassport = val.passportNumber?.trim() || "";
  const trimmedNationality = val.nationality?.trim() || "";

  if (val.studentType === "KENYAN") {
    if (!trimmedNationalId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nationalIdNumber"],
        message: "National ID Number is required for Kenyan students",
      });
    }
  }

  if (val.studentType === "INTERNATIONAL") {
    if (!trimmedPassport) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passportNumber"],
        message: "Passport Number is required for International students",
      });
    }
    if (!trimmedNationality) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nationality"],
        message: "Nationality is required for International students",
      });
    }
  }
});

export type StudentFormSchema = z.infer<typeof studentFormSchema>;


