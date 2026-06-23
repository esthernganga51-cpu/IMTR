// Enums for program streams
export enum CourseType {
  TRAINING = "TRAINING",
  DEGREE = "DEGREE"
}

export enum CourseDepartment {
  METEOROLOGY = "METEOROLOGY",
  AGRICULTURE = "AGRICULTURE",
  AVIATION = "AVIATION",
  ENVIRONMENT = "ENVIRONMENT"
}

export enum CourseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum EnrollmentStatus {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  DROPPED = "DROPPED"
}

// Data Record definitions
export interface CourseRecord {
  id: string;
  code: string;
  name: string;
  type: CourseType;
  department: CourseDepartment;
  duration: string;
  startMonth: string;
  requirements: string;
  targetAudience: string;
  status: CourseStatus;
  capacity?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentEnrollmentRecord {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Responses & Filters
export interface CourseResponse {
  success: boolean;
  message: string;
  course?: CourseRecord;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  enrollment?: StudentEnrollmentRecord;
}

export interface CourseFilters {
  type?: CourseType;
  department?: CourseDepartment;
  status?: CourseStatus;
  searchTerm?: string;
}

export interface EnrollmentFilters {
  studentId?: string;
  courseId?: string;
  status?: EnrollmentStatus;
}