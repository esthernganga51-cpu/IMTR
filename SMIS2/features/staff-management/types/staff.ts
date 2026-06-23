export type StaffRole = "teacher" | "admin" | "support" | "manager" | "director";
export type StaffStatus = "active" | "inactive" | "on-leave" | "retired";
export type Qualification = "diploma" | "bachelor" | "master" | "phd" | "certificate";

export interface StaffRecord {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: StaffRole;
  qualification: Qualification;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  hireDate: Date;
  status: StaffStatus;
  salary?: number;
  specialization?: string;
  createdAt: Date;
  updatedAt: Date;
}
