/**
 * Course Management Types
 * TypeScript contracts for courses and student enrollments
 * Enhanced with department relationships
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum CourseType {
  TRAINING = "training",
  DEGREE = "degree",
}

export enum CourseDepartment {
  METEOROLOGY = "meteorology",
  AGRICULTURE = "agriculture",
  AVIATION = "aviation",
  MARINE = "marine",
  ENVIRONMENT = "environment",
  HYDROLOGY = "hydrology",
  OTHER = "other",
}

export enum EnrollmentStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  DROPPED = "dropped",
  PENDING = "pending",
}

export enum CourseStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

// ============================================================================
// COURSE ENTITY TYPES
// ============================================================================

export interface CourseRecord {
  id: string; // Primary key - auto-generated or custom
  code: string; // Custom code if admin provides, otherwise same as id
  name: string;
  type: CourseType; // training or degree
  department: CourseDepartment; // Links to department
  departmentId?: string; // Optional: Foreign key to department if using ID
  duration: string; // e.g., "2 Years", "18 months", "6 weeks"
  startMonth: string; // e.g., "January", "June"
  requirements: string; // Entry requirements
  targetAudience: string; // Who should take this course
  description?: string; // Optional detailed description
  status: CourseStatus; // active, inactive, or archived
  capacity?: number; // Max students allowed
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentEnrollmentRecord {
  id: string; // Primary key
  studentId: string; // Foreign key to student
  courseId: string; // Foreign key to course
  enrollmentDate: Date;
  status: EnrollmentStatus;
  completionDate?: Date; // When course was completed
  grade?: string; // Final grade/mark
  percentage?: number; // Percentage score
  notes?: string; // Additional notes
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// COURSE WITH RELATIONSHIPS
// ============================================================================

export interface CourseWithDepartment extends CourseRecord {
  departmentName?: string; // Populated from department lookup
  departmentCode?: string; // Populated from department lookup
}

// ============================================================================
// API CONTRACT TYPES (Request/Response)
// ============================================================================

export interface CreateCourseRequest {
  code?: string; // Optional - if provided, use as custom ID. Otherwise auto-generate
  name: string;
  type: CourseType;
  department: CourseDepartment;
  departmentId?: string; // Optional: Foreign key if using ID
  duration: string;
  startMonth: string;
  requirements: string;
  targetAudience: string;
  description?: string;
  capacity?: number;
}

export interface UpdateCourseRequest {
  name?: string;
  type?: CourseType;
  department?: CourseDepartment;
  departmentId?: string;
  duration?: string;
  startMonth?: string;
  requirements?: string;
  targetAudience?: string;
  description?: string;
  status?: CourseStatus;
  capacity?: number;
}

export interface EnrollStudentRequest {
  studentId: string;
  courseId: string;
}

export interface UpdateEnrollmentRequest {
  status?: EnrollmentStatus;
  grade?: string;
  percentage?: number;
  notes?: string;
  completionDate?: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface CourseResponse {
  success: boolean;
  course?: CourseRecord;
  message?: string;
}

export interface CoursesListResponse {
  success: boolean;
  courses: CourseRecord[];
  total: number;
  message?: string;
}

export interface CoursesWithDepartmentResponse {
  success: boolean;
  courses: CourseWithDepartment[];
  total: number;
  message?: string;
}

export interface EnrollmentResponse {
  success: boolean;
  enrollment?: StudentEnrollmentRecord;
  message?: string;
}

export interface EnrollmentsListResponse {
  success: boolean;
  enrollments: StudentEnrollmentRecord[];
  total: number;
  message?: string;
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface CourseFilters {
  type?: CourseType;
  department?: CourseDepartment;
  status?: CourseStatus;
  searchTerm?: string; // Search by name or code
}

export interface EnrollmentFilters {
  studentId?: string;
  courseId?: string;
  status?: EnrollmentStatus;
  searchTerm?: string;
}

// ============================================================================
// SUMMARY/STATISTICS TYPES
// ============================================================================

export interface CourseSummary {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  byType: {
    training: number;
    degree: number;
  };
  byDepartment: Record<CourseDepartment, number>;
}

export interface EnrollmentSummary {
  totalEnrollments: number;
  byStatus: Record<EnrollmentStatus, number>;
  byDepartment: Record<CourseDepartment, number>;
  averageGrade?: number;
  completionRate?: number; // Percentage
}

export interface CourseEnrollmentStats {
  courseId: string;
  courseName: string;
  totalEnrolled: number;
  completed: number;
  ongoing: number;
  dropped: number;
  averageGrade?: number;
}

export interface DepartmentCourseSummary {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  courseIds: string[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface DepartmentOption {
  value: CourseDepartment;
  label: string;
}

export interface CourseTypeOption {
  value: CourseType;
  label: string;
}

export const DEPARTMENT_OPTIONS: DepartmentOption[] = [
  { value: CourseDepartment.METEOROLOGY, label: "Meteorology" },
  { value: CourseDepartment.AGRICULTURE, label: "Agriculture" },
  { value: CourseDepartment.AVIATION, label: "Aviation" },
  { value: CourseDepartment.MARINE, label: "Marine" },
  { value: CourseDepartment.ENVIRONMENT, label: "Environment" },
  { value: CourseDepartment.HYDROLOGY, label: "Hydrology" },
  { value: CourseDepartment.OTHER, label: "Other" },
];

export const COURSE_TYPE_OPTIONS: CourseTypeOption[] = [
  { value: CourseType.TRAINING, label: "Training Program" },
  { value: CourseType.DEGREE, label: "Degree Program" },
];

export const ENROLLMENT_STATUS_COLORS: Record<EnrollmentStatus, string> = {
  [EnrollmentStatus.ONGOING]: "bg-blue-100 text-blue-800",
  [EnrollmentStatus.COMPLETED]: "bg-green-100 text-green-800",
  [EnrollmentStatus.DROPPED]: "bg-red-100 text-red-800",
  [EnrollmentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
};

export const COURSE_STATUS_COLORS: Record<CourseStatus, string> = {
  [CourseStatus.ACTIVE]: "bg-green-100 text-green-800",
  [CourseStatus.INACTIVE]: "bg-gray-100 text-gray-800",
  [CourseStatus.ARCHIVED]: "bg-red-100 text-red-800",
};

export const ENROLLMENT_STATUS_OPTIONS = [
  { value: EnrollmentStatus.ONGOING, label: "Ongoing" },
  { value: EnrollmentStatus.COMPLETED, label: "Completed" },
  { value: EnrollmentStatus.DROPPED, label: "Dropped" },
  { value: EnrollmentStatus.PENDING, label: "Pending" },
];