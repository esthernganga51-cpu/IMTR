/**
 * Student Clearance API Contracts
 * Multi-department relational state tracking
 * Database-backed audit trails
 */

import type { StudentClearanceRecord, DepartmentClearanceRecord } from "@/features/lib/db/init";

// Department identifiers
export type DepartmentId = "finance" | "library" | "academic" | "sports";

export interface Department {
  id: DepartmentId;
  name: string;
  abbreviation: string;
  requiresSignature: boolean;
  description: string;
}

// Clearance status per department
export type ClearanceStatusType = "pending" | "approved" | "rejected" | "exempt";

export interface DepartmentClearance {
  departmentId: DepartmentId;
  status: ClearanceStatusType;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  requiresAction: boolean;
}

export interface StudentClearance {
  studentId: string;
  studentName: string;
  applicationId: string;
  departmentClearances: DepartmentClearance[];
  overallStatus: ClearanceStatusType;
  clearancePercentage: number; // 0-100
  lastModified: Date;
  allClear: boolean;
}

// API Contract for toggling department status
export interface UpdateClearanceStatusRequest {
  studentId: string;
  departmentId: DepartmentId;
  newStatus: ClearanceStatusType;
  approvedBy?: string;
  notes?: string;
}

export interface UpdateClearanceStatusResponse {
  success: boolean;
  message: string;
  clearance?: StudentClearance;
  error?: string;
  affectedDepartment?: DepartmentClearance;
}

// API Contract for batch clearance updates
export interface BatchClearanceUpdateRequest {
  studentIds: string[];
  departmentId: DepartmentId;
  newStatus: ClearanceStatusType;
  approvedBy?: string;
  notes?: string;
}

export interface BatchClearanceUpdateResponse {
  success: boolean;
  message: string;
  updatedCount: number;
  errors?: Array<{ studentId: string; error: string }>;
}

// API Contract for clearance matrix view
export interface ClearanceMatrixData {
  students: StudentClearance[];
  departments: Department[];
  summary: ClearanceSummary;
  appliedFilter?: {
    status?: ClearanceStatusType;
    department?: DepartmentId;
  };
}

// Summary statistics
export interface ClearanceSummary {
  totalStudents: number;
  fullyCleared: number;
  partiallyCleared: number;
  pendingStudents: number;
  perDepartment: Record<DepartmentId, {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  }>;
}

// Database entity types
export type StudentClearanceEntity = StudentClearanceRecord;
export type DepartmentClearanceEntity = DepartmentClearanceRecord;
