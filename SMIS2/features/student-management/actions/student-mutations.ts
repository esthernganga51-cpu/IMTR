/**
 * Student Mutations
 * Server actions for creating and updating students
 */

"use server";

import { createStudent, updateStudent, deleteStudent } from "@/features/student-management/data/student-db";
import type { Student, StudentFormData } from "@/features/student-management/types/student";

export interface StudentActionResult {
  success: boolean;
  message: string;
  student?: Student;
  error?: string;
}

export async function createStudentAction(formData: StudentFormData): Promise<StudentActionResult> {
  try {
    const student = await createStudent({
      admissionNumber: formData.admissionNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      nationality: formData.nationality,
      course: formData.course,
      level: formData.level,
      intake: formData.intake,
      department: formData.department,
      status: formData.status,
      enrollmentDate: formData.enrollmentDate,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      address: formData.address,
    });

    return {
      success: true,
      message: `Student ${student.firstName} ${student.lastName} created successfully`,
      student,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create student",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateStudentAction(
  studentId: string,
  formData: Partial<StudentFormData>
): Promise<StudentActionResult> {
  try {
    const updates: Partial<Student> = {};

    if (formData.admissionNumber) updates.admissionNumber = formData.admissionNumber;
    if (formData.firstName) updates.firstName = formData.firstName;
    if (formData.lastName) updates.lastName = formData.lastName;
    if (formData.email) updates.email = formData.email;
    if (formData.phone) updates.phone = formData.phone;
    if (formData.dateOfBirth) updates.dateOfBirth = formData.dateOfBirth;
    if (formData.gender) updates.gender = formData.gender;
    if (formData.nationality) updates.nationality = formData.nationality;
    if (formData.course) updates.course = formData.course;
    if (formData.level) updates.level = formData.level;
    if (formData.intake) updates.intake = formData.intake;
    if (formData.department) updates.department = formData.department;
    if (formData.status) updates.status = formData.status;
    if (formData.enrollmentDate) updates.enrollmentDate = formData.enrollmentDate;
    if (formData.parentName !== undefined) updates.parentName = formData.parentName;
    if (formData.parentPhone !== undefined) updates.parentPhone = formData.parentPhone;
    if (formData.address !== undefined) updates.address = formData.address;

    const student = await updateStudent(studentId, updates);

    if (!student) {
      return {
        success: false,
        message: "Student not found",
        error: "Student not found",
      };
    }

    return {
      success: true,
      message: `Student ${student.firstName} ${student.lastName} updated successfully`,
      student,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update student",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteStudentAction(studentId: string): Promise<StudentActionResult> {
  try {
    const success = await deleteStudent(studentId);

    if (!success) {
      return {
        success: false,
        message: "Student not found",
        error: "Student not found",
      };
    }

    return {
      success: true,
      message: "Student deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete student",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
