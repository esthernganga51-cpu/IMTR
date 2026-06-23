"use server";

import type { DashboardData } from "@/features/admin-dashboard/types/dashboard";
import { getAcademicAdminWorkspace } from "@/features/academic-admin/actions/get-academic-admin-workspace";
import { getCourseSummary, getEnrollmentSummary } from "@/features/course- management/courses.actions";
import { getAllDepartments } from "@/features/department-management/department-operations";
import { getHostelOccupancyFromDb } from "@/features/hostel-management/data/hostel-db";
import { getClearanceSummaryFromDb } from "@/features/student-clearance/data/clearance-db";
import { getAllStaff } from "@/features/staff-management/data/staff-db";
import { getStudentSummary } from "@/features/student-management/data/student-db";

const countLabel = (count: number, singular: string, plural = `${singular}s`) =>
  `${count.toLocaleString()} ${count === 1 ? singular : plural}`;

const percentLabel = (value: number) => `${value}%`;

export async function getDashboardMetrics(): Promise<DashboardData> {
  const [
    studentSummary,
    staff,
    departments,
    courseSummary,
    enrollmentSummary,
    clearanceSummary,
    hostelOccupancy,
    academicWorkspace,
  ] = await Promise.all([
      getStudentSummary(),
      getAllStaff(),
      getAllDepartments(),
      getCourseSummary(),
      getEnrollmentSummary(),
      getClearanceSummaryFromDb(),
      getHostelOccupancyFromDb(),
      getAcademicAdminWorkspace(),
    ]);

  const activeStudents = studentSummary.activeStudents;
  const totalCourses = courseSummary.totalCourses;
  const pendingClearanceCount = clearanceSummary.pendingStudents;
  const pendingEnrollmentCount = enrollmentSummary.byStatus.pending;
  const activeStaffCount = staff.filter((member) => member.status === "active").length;
  const activeStaffRatio = staff.length ? Math.round((activeStaffCount / staff.length) * 100) : 0;
  const activeStudentRatio = studentSummary.totalStudents
    ? Math.round((activeStudents / studentSummary.totalStudents) * 100)
    : 0;
  const activeStudentRatioLabel = `${percentLabel(activeStudentRatio)} active`;
  const clearanceCompletionRate = clearanceSummary.totalStudents
    ? Math.round((clearanceSummary.fullyCleared / clearanceSummary.totalStudents) * 100)
    : 0;
  const clearanceCompletionLabel = `${percentLabel(clearanceCompletionRate)} complete`;
  const academicCourseCount = academicWorkspace.courses.length;
  const academicUnitCount = academicWorkspace.units.length;
  const configuredCourseCount = totalCourses + academicCourseCount;

  return {
    metrics: [
      {
        id: "active-students",
        label: "Active Students",
        value: activeStudents.toLocaleString(),
        helper: "Currently enrolled and active",
        delta: activeStudentRatioLabel,
        trend: "up",
        icon: "users",
        tone: "blue",
      },
      {
        id: "staff",
        label: "Staff Records",
        value: staff.length.toLocaleString(),
        helper: countLabel(activeStaffCount, "active staff member", "active staff members"),
        delta: `${percentLabel(activeStaffRatio)} active`,
        trend: "neutral",
        icon: "users",
        tone: "slate",
      },
      {
        id: "departments",
        label: "Departments",
        value: departments.length.toLocaleString(),
        helper: "Administrative departments in the project",
        delta: countLabel(departments.length, "department"),
        trend: "neutral",
        icon: "building",
        tone: "indigo",
      },
      {
        id: "total-courses",
        label: "Course Setup",
        value: configuredCourseCount.toLocaleString(),
        helper: "Course records and academic configurations",
        delta: `${courseSummary.activeCourses.toLocaleString()} active`,
        trend: "neutral",
        icon: "clipboard",
        tone: "amber",
      },
      {
        id: "enrollments",
        label: "Enrollments",
        value: enrollmentSummary.totalEnrollments.toLocaleString(),
        helper: countLabel(pendingEnrollmentCount, "pending enrollment"),
        delta: countLabel(enrollmentSummary.byStatus.ongoing, "ongoing enrollment", "ongoing enrollments"),
        trend: pendingEnrollmentCount > 0 ? "down" : "neutral",
        icon: "wallet",
        tone: "rose",
      },
      {
        id: "pending-clearance",
        label: "Pending Clearance",
        value: pendingClearanceCount.toLocaleString(),
        helper: "Students with incomplete clearance",
        delta: clearanceCompletionLabel,
        trend: "neutral",
        icon: "message",
        tone: "emerald",
      },
      {
        id: "hostel-occupancy",
        label: "Hostel Occupancy",
        value: `${hostelOccupancy.summary.occupancyRate}%`,
        helper: `${hostelOccupancy.summary.occupiedRooms.toLocaleString()} of ${hostelOccupancy.summary.totalRooms.toLocaleString()} rooms occupied`,
        delta: countLabel(hostelOccupancy.summary.availableRooms, "available room"),
        trend: "neutral",
        icon: "bed",
        tone: "blue",
      },
      {
        id: "academic-units",
        label: "Academic Units",
        value: academicUnitCount.toLocaleString(),
        helper: "Units configured in academic administration",
        delta: countLabel(academicWorkspace.cohorts.length, "cohort"),
        trend: "neutral",
        icon: "graduation",
        tone: "indigo",
      },
    ],
    overview: [
      {
        label: "Student engagement",
        value: `${activeStudentRatio}%`,
        helper: "Active students compared to the full student body",
      },
      {
        label: "Staff coverage",
        value: staff.length.toLocaleString(),
        helper: `${activeStaffCount.toLocaleString()} active staff records across ${departments.length.toLocaleString()} departments`,
      },
      {
        label: "Academic catalogue",
        value: configuredCourseCount.toLocaleString(),
        helper: `${totalCourses.toLocaleString()} course records plus ${academicCourseCount.toLocaleString()} academic configurations`,
      },
      {
        label: "Enrollment pipeline",
        value: enrollmentSummary.totalEnrollments.toLocaleString(),
        helper: `${pendingEnrollmentCount.toLocaleString()} pending, ${enrollmentSummary.byStatus.ongoing.toLocaleString()} ongoing, ${enrollmentSummary.byStatus.completed.toLocaleString()} completed`,
      },
      {
        label: "Clearance completion",
        value: clearanceCompletionLabel,
        helper: "Students who have completed all clearance steps",
      },
      {
        label: "Hostel rooms",
        value: hostelOccupancy.summary.totalRooms.toLocaleString(),
        helper: `${hostelOccupancy.summary.availableRooms.toLocaleString()} available, ${hostelOccupancy.summary.maintenanceRooms.toLocaleString()} under maintenance`,
      },
    ],
    priorityQueue: [
      {
        title: "Student records",
        detail: `${studentSummary.inactiveStudents.toLocaleString()} inactive and ${studentSummary.suspendedStudents.toLocaleString()} suspended students`,
        priority:
          studentSummary.suspendedStudents > 0
            ? "High"
            : studentSummary.inactiveStudents > 0
              ? "Medium"
              : "Low",
      },
      {
        title: "Clearance review",
        detail: `${pendingClearanceCount.toLocaleString()} students pending clearance`,
        priority: pendingClearanceCount > 0 ? "High" : "Medium",
      },
      {
        title: "Course enrollment",
        detail: `${pendingEnrollmentCount.toLocaleString()} enrollments waiting`,
        priority: pendingEnrollmentCount > 0 ? "Medium" : "Low",
      },
      {
        title: "Hostel availability",
        detail: `${hostelOccupancy.summary.availableRooms.toLocaleString()} available rooms and ${hostelOccupancy.summary.reservedRooms.toLocaleString()} reserved rooms`,
        priority: hostelOccupancy.summary.availableRooms === 0 && hostelOccupancy.summary.totalRooms > 0 ? "High" : "Low",
      },
    ],
  };
}
