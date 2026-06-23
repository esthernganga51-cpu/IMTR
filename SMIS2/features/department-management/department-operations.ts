"use server";

import { db, initializeDatabase } from "@/features/lib/db/init";

initializeDatabase();

export interface DepartmentFormData {
  code: string;
  name: string;
  description: string;
  headId?: string;
  budget?: number;
}

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllDepartments() {
  await delay();
  return db.getAllDepartments();
}

export async function createDepartment(data: DepartmentFormData) {
  await delay();
  
  const existing = db.getDepartmentByCode(data.code);
  if (existing) throw new Error("Department with this code already exists");

  const dept = {
    ...data,
    id: `DEPT-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.insertDepartment(dept);
  return dept;
}

export async function updateDepartment(id: string, data: Partial<DepartmentFormData>) {
  await delay();
  return db.updateDepartment(id, { ...data, updatedAt: new Date() });
}

export async function deleteDepartment(id: string) {
  await delay();
  return db.deleteDepartment(id);
}
