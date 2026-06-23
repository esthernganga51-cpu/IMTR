export type StudentStatus = "pending" | "approved" | "rejected" | "deferred";

export interface Student {
  id: string;
  name: string;
  applicationId: string;
  course: string;
  level: string;
  status: StudentStatus;
  appliedAt: Date;
}

export interface StudentActionResult {
  success: boolean;
  message: string;
  student?: Student;
  error?: string;
}
