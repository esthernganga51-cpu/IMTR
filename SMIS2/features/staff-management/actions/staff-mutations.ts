"use server";

import { createStaff, updateStaff, deleteStaff } from "@/features/staff-management/data/staff-db";
import type { StaffRecord, StaffRole, StaffStatus, Qualification } from "@/features/staff-management/types/staff";

export interface StaffActionResult {
  success: boolean;
  message: string;
  staff?: StaffRecord;
  error?: string;
}

export type StaffFormData = {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: StaffRole;
  qualification: Qualification;
  dateOfBirth: string; // yyyy-mm-dd
  gender: "male" | "female" | "other";
  hireDate: string; // yyyy-mm-dd
  status: StaffStatus;
  salary?: string;
  specialization?: string;
};

export async function createStaffAction(formData: StaffFormData): Promise<StaffActionResult> {
  try {
    const staff = await createStaff({
      employeeId: formData.employeeId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      role: formData.role,
      qualification: formData.qualification,
      dateOfBirth: new Date(formData.dateOfBirth),
      gender: formData.gender,
      hireDate: new Date(formData.hireDate),
      status: formData.status,
      salary: formData.salary ? Number(formData.salary) : undefined,
      specialization: formData.specialization ? formData.specialization : undefined,
    });

    return {
      success: true,
      message: `Staff ${staff.firstName} ${staff.lastName} created successfully`,
      staff,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create staff",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateStaffAction(
  staffId: string,
  formData: Partial<StaffFormData>
): Promise<StaffActionResult> {
  try {
    const updates: Partial<StaffRecord> = {};

    if (formData.employeeId) updates.employeeId = formData.employeeId;
    if (formData.firstName) updates.firstName = formData.firstName;
    if (formData.lastName) updates.lastName = formData.lastName;
    if (formData.email) updates.email = formData.email;
    if (formData.phone) updates.phone = formData.phone;
    if (formData.department) updates.department = formData.department;
    if (formData.role) updates.role = formData.role;
    if (formData.qualification) updates.qualification = formData.qualification;
    if (formData.dateOfBirth) updates.dateOfBirth = new Date(formData.dateOfBirth);
    if (formData.gender) updates.gender = formData.gender;
    if (formData.hireDate) updates.hireDate = new Date(formData.hireDate);
    if (formData.status) updates.status = formData.status;
    if (formData.salary !== undefined) {
      updates.salary = formData.salary ? Number(formData.salary) : undefined;
    }
    if (formData.specialization !== undefined) {
      updates.specialization = formData.specialization ? formData.specialization : undefined;
    }

    const staff = await updateStaff(staffId, updates);

    if (!staff) {
      return {
        success: false,
        message: "Staff not found",
        error: "Staff not found",
      };
    }

    return {
      success: true,
      message: `Staff ${staff.firstName} ${staff.lastName} updated successfully`,
      staff,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update staff",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteStaffAction(staffId: string): Promise<StaffActionResult> {
  try {
    const success = await deleteStaff(staffId);

    if (!success) {
      return {
        success: false,
        message: "Staff not found",
        error: "Staff not found",
      };
    }

    return {
      success: true,
      message: "Staff deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete staff",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

