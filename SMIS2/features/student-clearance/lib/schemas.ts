import { z } from "zod";

// Student Clearance Schemas
export const departmentIdSchema = z.enum(["finance", "library", "academic", "sports"]);

export const clearanceStatusSchema = z.enum(["pending", "approved", "rejected", "exempt"]);

export const updateClearanceStatusSchema = z.object({
  studentId: z.string().min(1, "Student ID required"),
  departmentId: departmentIdSchema,
  newStatus: clearanceStatusSchema,
  approvedBy: z.string().optional(),
  notes: z.string().optional(),
});

export const batchClearanceUpdateSchema = z.object({
  studentIds: z.array(z.string().min(1)).min(1, "At least one student required"),
  departmentId: departmentIdSchema,
  newStatus: clearanceStatusSchema,
  approvedBy: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateClearanceStatusInput = z.infer<typeof updateClearanceStatusSchema>;
export type BatchClearanceUpdateInput = z.infer<typeof batchClearanceUpdateSchema>;
