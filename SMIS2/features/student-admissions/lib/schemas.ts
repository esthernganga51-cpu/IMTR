import { z } from "zod";

export const updateStudentStatusSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  status: z.enum(["approved", "rejected", "deferred"]),
});

export type UpdateStudentStatusInput = z.infer<typeof updateStudentStatusSchema>;
