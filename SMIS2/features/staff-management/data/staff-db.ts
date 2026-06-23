"use server";

import { db, initializeDatabase } from "@/features/lib/db/init";
import type { StaffRecord } from "@/features/staff-management/types/staff";

initializeDatabase();

const simulateNetworkDelay = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllStaff() {
  await simulateNetworkDelay();
  return db.getAllStaff();
}

export async function getStaff(id: string) {
  await simulateNetworkDelay();
  return db.getStaff(id) || null;
}

export async function createStaff(
  data: Omit<StaffRecord, "id" | "createdAt" | "updatedAt">
) {
  await simulateNetworkDelay();

  const existing = db.getStaffByEmployeeId(data.employeeId);
  if (existing) throw new Error("Staff with this employee ID already exists");

  const staff: StaffRecord = {
    ...data,
    id: `STAFF-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.insertStaff(staff);
  return staff;
}

export async function updateStaff(id: string, updates: Partial<StaffRecord>) {
  await simulateNetworkDelay();
  return db.updateStaff(id, updates);
}

export async function deleteStaff(id: string) {
  await simulateNetworkDelay();
  return db.deleteStaff(id);
}

export async function getStaffByDepartment(department: string) {
  await simulateNetworkDelay();
  return db.getStaffByDepartment(department);
}
