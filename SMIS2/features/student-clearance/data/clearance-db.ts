/**
 * Student Clearance Database Operations
 * CRUD operations with audit trail and state consistency
 */

"use server";

import { db, initializeDatabase } from "@/features/lib/db/init";
import type { StudentClearance, DepartmentId, ClearanceStatusType, ClearanceSummary, ClearanceMatrixData } from "@/features/student-clearance/types/clearance";
import { departments as deptConfig } from "@/features/student-clearance/data/mock-clearance";

// Initialize on module load
initializeDatabase();

export async function getClearanceMatrixFromDb(): Promise<ClearanceMatrixData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const studentClearances = db.getAllStudentClearances();
  const students: StudentClearance[] = studentClearances.map((sc) => {
    const deptClearances = db.getStudentDepartmentClearances(sc.studentId);
    const summary = db.getStudentClearanceSummary(sc.studentId);

    return {
      studentId: sc.studentId,
      studentName: sc.studentName,
      applicationId: sc.applicationId,
      departmentClearances: deptClearances.map((dc) => ({
        departmentId: dc.departmentId as DepartmentId,
        status: dc.status as ClearanceStatusType,
        approvedBy: dc.approvedBy,
        approvedAt: dc.approvedAt,
        notes: dc.notes,
        requiresAction: dc.status !== "approved" && dc.status !== "exempt",
      })),
      overallStatus: (summary.allClear ? "approved" : "pending") as ClearanceStatusType,
      clearancePercentage: summary.percentage,
      lastModified: sc.updatedAt,
      allClear: summary.allClear,
    };
  });

  return {
    students,
    departments: deptConfig,
    summary: await getClearanceSummaryFromDb(),
  };
}

export async function updateClearanceStatusInDb(
  studentId: string,
  departmentId: DepartmentId,
  newStatus: ClearanceStatusType,
  approvedBy?: string,
  notes?: string
): Promise<StudentClearance | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  // Update department clearance
  const updated = db.updateDepartmentClearance(studentId, departmentId, {
    status: newStatus,
    approvedBy: approvedBy || "Admin Officer",
    approvedAt: new Date(),
    notes,
    updatedAt: new Date(),
  });

  if (!updated) return null;

  // Get full student clearance
  const studentClearance = db.getStudentClearance(studentId);
  if (!studentClearance) return null;

  const deptClearances = db.getStudentDepartmentClearances(studentId);
  const summary = db.getStudentClearanceSummary(studentId);

  return {
    studentId: studentClearance.studentId,
    studentName: studentClearance.studentName,
    applicationId: studentClearance.applicationId,
    departmentClearances: deptClearances.map((dc) => ({
      departmentId: dc.departmentId as DepartmentId,
      status: dc.status as ClearanceStatusType,
      approvedBy: dc.approvedBy,
      approvedAt: dc.approvedAt,
      notes: dc.notes,
      requiresAction: dc.status !== "approved" && dc.status !== "exempt",
    })),
    overallStatus: (summary.allClear ? "approved" : "pending") as ClearanceStatusType,
    clearancePercentage: summary.percentage,
    lastModified: studentClearance.updatedAt,
    allClear: summary.allClear,
  };
}

export async function batchUpdateClearanceInDb(
  studentIds: string[],
  departmentId: DepartmentId,
  newStatus: ClearanceStatusType,
  approvedBy?: string,
  notes?: string
): Promise<{ updated: StudentClearance[]; errors: Array<{ studentId: string; error: string }> }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const updated: StudentClearance[] = [];
  const errors: Array<{ studentId: string; error: string }> = [];

  for (const studentId of studentIds) {
    const result = await updateClearanceStatusInDb(studentId, departmentId, newStatus, approvedBy, notes);
    if (result) {
      updated.push(result);
    } else {
      errors.push({ studentId, error: "Student not found" });
    }
  }

  return { updated, errors };
}

export async function getClearanceSummaryFromDb(): Promise<ClearanceSummary> {
  const students = db.getAllStudentClearances();
  const total = students.length;

  const fullyCleared = students.filter((s) => {
    const summary = db.getStudentClearanceSummary(s.studentId);
    return summary.allClear;
  }).length;

  const perDepartment: Record<DepartmentId, { total: number; approved: number; pending: number; rejected: number }> = {
    finance: { total, approved: 0, pending: 0, rejected: 0 },
    library: { total, approved: 0, pending: 0, rejected: 0 },
    academic: { total, approved: 0, pending: 0, rejected: 0 },
    sports: { total, approved: 0, pending: 0, rejected: 0 },
  };

  const deptIds: DepartmentId[] = ["finance", "library", "academic", "sports"];
  
  deptIds.forEach((deptId) => {
    for (const student of students) {
      const clearance = db.getDepartmentClearance(student.studentId, deptId);
      if (clearance) {
        if (clearance.status === "approved") perDepartment[deptId].approved++;
        else if (clearance.status === "pending") perDepartment[deptId].pending++;
        else if (clearance.status === "rejected") perDepartment[deptId].rejected++;
      }
    }
  });

  return {
    totalStudents: total,
    fullyCleared,
    partiallyCleared: total - fullyCleared,
    pendingStudents: students.filter((s) => {
      const summary = db.getStudentClearanceSummary(s.studentId);
      return !summary.allClear;
    }).length,
    perDepartment,
  };
}

export async function getStudentClearanceStatusInDb(studentId: string): Promise<StudentClearance | null> {
  const studentClearance = db.getStudentClearance(studentId);
  if (!studentClearance) return null;

  const deptClearances = db.getStudentDepartmentClearances(studentId);
  const summary = db.getStudentClearanceSummary(studentId);

  return {
    studentId: studentClearance.studentId,
    studentName: studentClearance.studentName,
    applicationId: studentClearance.applicationId,
    departmentClearances: deptClearances.map((dc) => ({
      departmentId: dc.departmentId as DepartmentId,
      status: dc.status as ClearanceStatusType,
      approvedBy: dc.approvedBy,
      approvedAt: dc.approvedAt,
      notes: dc.notes,
      requiresAction: dc.status !== "approved" && dc.status !== "exempt",
    })),
    overallStatus: (summary.allClear ? "approved" : "pending") as ClearanceStatusType,
    clearancePercentage: summary.percentage,
    lastModified: studentClearance.updatedAt,
    allClear: summary.allClear,
  };
}
