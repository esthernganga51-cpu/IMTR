import type {
  StudentClearance,
  Department,
  DepartmentId,
  ClearanceStatusType,
} from "@/features/student-clearance/types/clearance";

// Departments
export const departments: Department[] = [
  {
    id: "finance",
    name: "Finance",
    abbreviation: "FIN",
    requiresSignature: true,
    description: "Fee clearance and financial obligations",
  },
  {
    id: "library",
    name: "Library",
    abbreviation: "LIB",
    requiresSignature: false,
    description: "Book return and library obligations",
  },
  {
    id: "academic",
    name: "Academic",
    abbreviation: "ACAD",
    requiresSignature: true,
    description: "Academic records and transcript clearance",
  },
  {
    id: "sports",
    name: "Sports",
    abbreviation: "SPT",
    requiresSignature: false,
    description: "Sports equipment and facility clearance",
  },
];

// Mock student clearance data (from student admissions)
const createMockClearances = (): StudentClearance[] => {
  const students = [
    { id: "std-001", name: "Alice Johnson", appId: "APP-2024-001" },
    { id: "std-002", name: "Benjamin Kipchoge", appId: "APP-2024-002" },
    { id: "std-003", name: "Chioma Okafor", appId: "APP-2024-003" },
    { id: "std-004", name: "David Liu", appId: "APP-2024-004" },
    { id: "std-005", name: "Emma Thompson", appId: "APP-2024-005" },
    { id: "std-006", name: "Fatima Hassan", appId: "APP-2024-006" },
  ];

  return students.map((student) => {
    const departmentClearances = departments.map((dept) => {
      const random = Math.random();
      let status: ClearanceStatusType = "pending";
      if (random > 0.7) status = "approved";
      else if (random > 0.4) status = "rejected";
      else if (random > 0.2) status = "exempt";

      return {
        departmentId: dept.id as DepartmentId,
        status: status,
        approvedBy: status === "approved" ? `${dept.abbreviation} Officer` : undefined,
        approvedAt: status === "approved" ? new Date() : undefined,
        notes: status === "rejected" ? "Pending fee payment" : undefined,
        requiresAction: status !== "approved" && status !== "exempt",
      };
    });

    const approvedCount = departmentClearances.filter(
      (d) => d.status === "approved"
    ).length;
    const clearancePercentage = Math.round((approvedCount / departments.length) * 100);
    const overallStatus =
      departmentClearances.every((d) => d.status === "approved" || d.status === "exempt")
        ? ("approved" as const)
        : ("pending" as const);

    return {
      studentId: student.id,
      studentName: student.name,
      applicationId: student.appId,
      departmentClearances,
      overallStatus,
      clearancePercentage,
      lastModified: new Date(),
      allClear: overallStatus === "approved",
    };
  });
};

let clearanceData = createMockClearances();

export async function getStudentClearances(): Promise<StudentClearance[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return clearanceData;
}

export async function updateClearanceStatus(
  studentId: string,
  departmentId: DepartmentId,
  newStatus: string
): Promise<StudentClearance | null> {
  const clearance = clearanceData.find((c) => c.studentId === studentId);
  if (!clearance) return null;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  const deptClearance = clearance.departmentClearances.find(
    (d) => d.departmentId === departmentId
  );
  if (deptClearance) {
    deptClearance.status = newStatus as "pending" | "approved" | "rejected" | "exempt";
    deptClearance.approvedAt = new Date();
    deptClearance.approvedBy = "Admin Officer";
    deptClearance.requiresAction = newStatus !== "approved" && newStatus !== "exempt";

    // Recalculate overall status
    const approvedCount = clearance.departmentClearances.filter(
      (d) => d.status === "approved"
    ).length;
    clearance.clearancePercentage = Math.round(
      (approvedCount / departments.length) * 100
    );
    clearance.overallStatus =
      clearance.departmentClearances.every(
        (d) => d.status === "approved" || d.status === "exempt"
      ) ? ("approved" as const)
        : ("pending" as const);
    clearance.allClear = clearance.overallStatus === "approved";
    clearance.lastModified = new Date();
  }

  return clearance;
}

export async function getClearanceSummary() {
  const total = clearanceData.length;
  const fullyCleared = clearanceData.filter((c) => c.allClear).length;
  const partiallyCleared = total - fullyCleared;

  const perDepartment: Record<string, { total: number; approved: number; pending: number; rejected: number }> = {};
  departments.forEach((dept) => {
    const statuses = clearanceData.map((c) =>
      c.departmentClearances.find((d) => d.departmentId === dept.id)?.status
    );
    perDepartment[dept.id] = {
      total,
      approved: statuses.filter((s) => s === "approved").length,
      pending: statuses.filter((s) => s === "pending").length,
      rejected: statuses.filter((s) => s === "rejected").length,
    };
  });

  return {
    totalStudents: total,
    fullyCleared,
    partiallyCleared,
    pendingStudents: clearanceData.filter((c) => !c.allClear).length,
    perDepartment,
  };
}

export function resetClearanceData(): void {
  clearanceData = createMockClearances();
}
