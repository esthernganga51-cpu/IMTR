import type { Student, StudentStatus } from "@/features/student-admissions/types/student";

// Mock database of pending students
const mockStudents: Student[] = [
  {
    id: "std-001",
    name: "Alice Johnson",
    applicationId: "APP-2024-001",
    course: "Computer Science",
    level: "Form 1",
    status: "pending",
    appliedAt: new Date("2024-05-15"),
  },
  {
    id: "std-002",
    name: "Benjamin Kipchoge",
    applicationId: "APP-2024-002",
    course: "Mathematics",
    level: "Form 2",
    status: "pending",
    appliedAt: new Date("2024-05-16"),
  },
  {
    id: "std-003",
    name: "Chioma Okafor",
    applicationId: "APP-2024-003",
    course: "Biology",
    level: "Form 1",
    status: "pending",
    appliedAt: new Date("2024-05-17"),
  },
  {
    id: "std-004",
    name: "David Liu",
    applicationId: "APP-2024-004",
    course: "Physics",
    level: "Form 3",
    status: "pending",
    appliedAt: new Date("2024-05-18"),
  },
  {
    id: "std-005",
    name: "Emma Thompson",
    applicationId: "APP-2024-005",
    course: "English",
    level: "Form 2",
    status: "pending",
    appliedAt: new Date("2024-05-19"),
  },
  {
    id: "std-006",
    name: "Fatima Hassan",
    applicationId: "APP-2024-006",
    course: "Chemistry",
    level: "Form 1",
    status: "pending",
    appliedAt: new Date("2024-05-20"),
  },
];

// In-memory store (simulating database)
let students = [...mockStudents];

export async function getPendingStudents(): Promise<Student[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return students.filter((s) => s.status === "pending");
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  return students.find((s) => s.id === id);
}

export async function updateStudentStatus(
  id: string,
  status: string
): Promise<Student | null> {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  students[index].status = status as StudentStatus;
  return students[index];
}

export function getAllStudents(): Student[] {
  return students;
}

export function resetStudents(): void {
  students = [...mockStudents];
}
