/**
 * Student Management Types
 * Comprehensive student record management
 */

import type { StudentRecord } from "@/features/lib/db/init";

export type StudentStatus = "active" | "inactive" | "graduated" | "suspended";
export type Gender = "male" | "female" | "other";

export type Student = StudentRecord;


export interface StudentFormData {
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  studentType: "KENYAN" | "INTERNATIONAL";
  nationalIdNumber?: string;
  passportNumber?: string;
  nationality?: string;
  course: string;

  level: string;
  intake: string;
  department: string;
  status: StudentStatus;
  enrollmentDate: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

export interface StudentFilters {
  searchTerm?: string;
  department?: string;
  status?: StudentStatus;
  course?: string;
  level?: string;
}

export interface StudentSummary {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  graduatedStudents: number;
  suspendedStudents: number;
  byDepartment: Record<string, number>;
  byLevel: Record<string, number>;
}
