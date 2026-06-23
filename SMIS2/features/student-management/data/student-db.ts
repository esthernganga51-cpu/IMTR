/**
 * Student Database Operations
 * CRUD operations for student management with state consistency
 */

"use server";

import { db, initializeDatabase } from "@/features/lib/db/init";
import type { Student, StudentFilters, StudentSummary } from "@/features/student-management/types/student";
import type { StudentStatus } from "@/features/student-management/types/student";

// Initialize on module load
initializeDatabase();

// Simulate network delay
const simulateNetworkDelay = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllStudents(filters?: StudentFilters): Promise<Student[]> {
  await simulateNetworkDelay();
  
  let students = db.getAllStudents();

  if (filters) {
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      students = students.filter(
        (s: Student) =>
          s.firstName.toLowerCase().includes(term) ||
          s.lastName.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.admissionNumber.toLowerCase().includes(term)
      );
    }

    if (filters.department) {
      students = students.filter((s: Student) => s.department === filters.department);
    }

    if (filters.status) {
      students = students.filter((s: Student) => s.status === filters.status);
    }

    if (filters.course) {
      students = students.filter((s: Student) => s.course === filters.course);
    }

    if (filters.level) {
      students = students.filter((s: Student) => s.level === filters.level);
    }
  }

  // Sort by enrollment date (newest first)
  return students.sort((a: Student, b: Student) =>
    new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime()
  );
}

export async function getStudent(studentId: string): Promise<Student | null> {
  await simulateNetworkDelay();
  return db.getStudent(studentId) || null;
}

export async function getStudentByAdmissionNumber(admissionNumber: string): Promise<Student | null> {
  await simulateNetworkDelay();
  return db.getStudentByAdmissionNumber(admissionNumber) || null;
}

export async function getStudentsByDepartment(department: string): Promise<Student[]> {
  await simulateNetworkDelay();
  return db.getStudentsByDepartment(department);
}

export async function createStudent(
  studentData: Omit<Student, "id" | "createdAt" | "updatedAt">
): Promise<Student> {
  await simulateNetworkDelay();

  // Check if admission number already exists
  const existing = db.getStudentByAdmissionNumber(studentData.admissionNumber);
  if (existing) {
    throw new Error(`Student with admission number ${studentData.admissionNumber} already exists`);
  }

  const student: Student = {
    ...studentData,
    id: `STU-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.insertStudent(student);
  return student;
}

export async function updateStudent(
  studentId: string,
  updates: Partial<Student>
): Promise<Student | null> {
  await simulateNetworkDelay();

  // Check if trying to change admission number to an existing one
  if (updates.admissionNumber) {
    const existing = db.getStudentByAdmissionNumber(updates.admissionNumber);
    if (existing && existing.id !== studentId) {
      throw new Error(
        `Student with admission number ${updates.admissionNumber} already exists`
      );
    }
  }

  return db.updateStudent(studentId, updates);
}

export async function deleteStudent(studentId: string): Promise<boolean> {
  await simulateNetworkDelay();

  const student = db.getStudent(studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  return db.deleteStudent(studentId);
}

export async function getStudentSummary(): Promise<StudentSummary> {
  await simulateNetworkDelay();

  const students = db.getAllStudents();

  const summary: StudentSummary = {
    totalStudents: students.length,
    activeStudents: students.filter((s: Student) => s.status === "active").length,
    inactiveStudents: students.filter((s: Student) => s.status === "inactive").length,
    graduatedStudents: students.filter((s: Student) => s.status === "graduated").length,
    suspendedStudents: students.filter((s: Student) => s.status === "suspended").length,
    byDepartment: {},
    byLevel: {},
  };

  // Count by department
  for (const student of students) {
    if (!summary.byDepartment[student.department]) {
      summary.byDepartment[student.department] = 0;
    }
    summary.byDepartment[student.department]++;
  }

  // Count by level
  for (const student of students) {
    if (!summary.byLevel[student.level]) {
      summary.byLevel[student.level] = 0;
    }
    summary.byLevel[student.level]++;
  }

  return summary;
}

export async function searchStudents(searchTerm: string): Promise<Student[]> {
  await simulateNetworkDelay();
  return getAllStudents({ searchTerm });
}

export async function getStudentsByStatus(status: StudentStatus): Promise<Student[]> {
  await simulateNetworkDelay();
  return db.getStudentsByStatus(status);
}

// Additional helper functions can be added here as needed, such as bulk operations, import/export, etc.
