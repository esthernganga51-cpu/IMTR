/**
 * Course Management Server Actions
 * Handles all course CRUD operations
 * Location: src/features/courses/actions.ts
 */

"use server";

import { db, initializeDatabase } from "@/features/lib/db/init";
import {
  CourseRecord,
  CreateCourseRequest,
  UpdateCourseRequest,
  StudentEnrollmentRecord,
  EnrollStudentRequest,
  UpdateEnrollmentRequest,
  CoursesWithDepartmentResponse,
  DepartmentCourseSummary,
  CourseStatus,
   EnrollmentStatus,
} from "./courses.types";

initializeDatabase();

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// COURSE CRUD OPERATIONS
// ============================================================================

/**
 * Get all courses
 */
export async function getAllCourses(): Promise<CourseRecord[]> {
  await delay();
  return db.getAllCourses();
}

/**
 * Get course by ID
 */
export async function getCourseById(id: string): Promise<CourseRecord | null> {
  await delay();
  return db.getCourseById(id);
}

/**
 * Get course by code
 */
export async function getCourseByCode(code: string): Promise<CourseRecord | null> {
  await delay();
  return db.getCourseByCode(code);
}

/**
 * Get all courses for a specific department
 * Links courses table to departments table
 */
export async function getCoursesByDepartment(
  department: string
): Promise<CoursesWithDepartmentResponse> {
  await delay();
  
  const courses = db.getCoursesByDepartment(department);
  const departmentData = db.getDepartmentByCode(department);

  const coursesWithDept = courses.map((course) => ({
    ...course,
    departmentName: departmentData?.name,
    departmentCode: departmentData?.code,
  }));

  return {
    success: true,
    courses: coursesWithDept,
    total: coursesWithDept.length,
    message: `Found ${coursesWithDept.length} courses in ${departmentData?.name || department}`,
  };
}

/**
 * Get department with all its courses
 * Bidirectional relationship
 */
export async function getDepartmentWithCourses(departmentId: string) {
  await delay();
  
  const department = db.getDepartmentById(departmentId);
  if (!department) {
    throw new Error(`Department with ID ${departmentId} not found`);
  }

  const courses = db.getCoursesByDepartment(department.code);

  return {
    ...department,
    courses: courses,
    courseCount: courses.length,
  };
}

/**
 * Create a new course
 */
export async function createCourse(data: CreateCourseRequest): Promise<CourseRecord> {
  await delay();

  // Validate that department exists (if using departmentId)
  if (data.departmentId) {
    const dept = db.getDepartmentById(data.departmentId);
    if (!dept) {
      throw new Error(`Department with ID ${data.departmentId} does not exist`);
    }
  }

  // Check for duplicate course code
  if (data.code) {
    const existing = db.getCourseByCode(data.code);
    if (existing) {
      throw new Error(`Course with code ${data.code} already exists`);
    }
  }

  const course: CourseRecord = {
    ...data,
    id: data.code ? `COURSE-${data.code}` : `COURSE-${Date.now()}`,
    code: data.code || `COURSE-${Date.now()}`,
    status: CourseStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.insertCourse(course);
  return course;
}

/**
 * Update an existing course
 */
export async function updateCourse(
  id: string,
  data: UpdateCourseRequest & { code?: string }
): Promise<CourseRecord> {
  await delay();

  const existing = db.getCourseById(id);
  if (!existing) {
    throw new Error(`Course with ID ${id} not found`);
  }

  // If changing department, validate it exists
  if (data.departmentId) {
    const dept = db.getDepartmentById(data.departmentId);
    if (!dept) {
      throw new Error(`Department with ID ${data.departmentId} does not exist`);
    }
  }

  // If changing code, check for duplicates
  if (data.code && data.code !== existing.code) {
    const duplicate = db.getCourseByCode(data.code);
    if (duplicate) {
      throw new Error(`Course with code ${data.code} already exists`);
    }
  }

  const updated = db.updateCourse(id, {
    ...data,
    updatedAt: new Date(),
  });

  if (!updated) {
    throw new Error(`Failed to update course ${id}`);
  }

  return updated;
}

/**
 * Delete a course
 * Cascade: Consider what happens to enrollments
 */
export async function deleteCourse(id: string): Promise<boolean> {
  await delay();

  const course = db.getCourseById(id);
  if (!course) {
    throw new Error(`Course with ID ${id} not found`);
  }

  // Optional: Check if course has enrollments
  const enrollments = db.getEnrollmentsByCourseId(id);
  if (enrollments && enrollments.length > 0) {
    throw new Error(
      `Cannot delete course ${id}. It has ${enrollments.length} enrollments. Delete enrollments first.`
    );
  }

  return db.deleteCourse(id);
}

// ============================================================================
// ENROLLMENT OPERATIONS
// ============================================================================

/**
 * Get all enrollments
 */
export async function getAllEnrollments(): Promise<StudentEnrollmentRecord[]> {
  await delay();
  return db.getAllEnrollments();
}

/**
 * Get enrollments by course
 */
export async function getEnrollmentsByCourse(
  courseId: string
): Promise<StudentEnrollmentRecord[]> {
  await delay();

  const course = db.getCourseById(courseId);
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  return db.getEnrollmentsByCourseId(courseId);
}

/**
 * Get enrollments by student
 */
export async function getEnrollmentsByStudent(
  studentId: string
): Promise<StudentEnrollmentRecord[]> {
  await delay();
  return db.getEnrollmentsByStudentId(studentId);
}

/**
 * Enroll a student in a course
 */
export async function enrollStudent(
  data: EnrollStudentRequest
): Promise<StudentEnrollmentRecord> {
  await delay();

  // Validate course exists
  const course = db.getCourseById(data.courseId);
  if (!course) {
    throw new Error(`Course with ID ${data.courseId} not found`);
  }

  // Check for duplicate enrollment
  const existing = db.getEnrollmentByStudentAndCourse(data.studentId, data.courseId);
  if (existing) {
    throw new Error(
      `Student ${data.studentId} is already enrolled in course ${data.courseId}`
    );
  }

  // Check capacity if defined
  if (course.capacity) {
    const enrollments = db.getEnrollmentsByCourseId(data.courseId);
    if (enrollments.length >= course.capacity) {
      throw new Error(
        `Course ${course.code} has reached capacity (${course.capacity} students)`
      );
    }
  }

  const enrollment: StudentEnrollmentRecord = {
    id: `ENR-${Date.now()}`,
    studentId: data.studentId,
    courseId: data.courseId,
    enrollmentDate: new Date(),
     status: EnrollmentStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.insertEnrollment(enrollment);
  return enrollment;
}

/**
 * Update enrollment (grade, status, completion date, etc.)
 */
export async function updateEnrollment(
  id: string,
  data: UpdateEnrollmentRequest
): Promise<StudentEnrollmentRecord> {
  await delay();

  const existing = db.getEnrollmentById(id);
  if (!existing) {
    throw new Error(`Enrollment with ID ${id} not found`);
  }

  const updated = db.updateEnrollment(id, {
    ...data,
    updatedAt: new Date(),
  });

  if (!updated) {
    throw new Error(`Failed to update enrollment ${id}`);
  }

  return updated;
}

/**
 * Remove a student from a course
 */
export async function removeEnrollment(id: string): Promise<boolean> {
  await delay();

  const enrollment = db.getEnrollmentById(id);
  if (!enrollment) {
    throw new Error(`Enrollment with ID ${id} not found`);
  }

  return db.deleteEnrollment(id);
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Get course statistics
 */
export async function getCourseSummary() {
  await delay();

  const courses = db.getAllCourses();
  const active = courses.filter((c) => c.status === "active").length;
  const inactive = courses.filter((c) => c.status === "inactive").length;
  const archived = courses.filter((c) => c.status === "archived").length;

  const byType = {
    training: courses.filter((c) => c.type === "training").length,
    degree: courses.filter((c) => c.type === "degree").length,
  };

  return {
    totalCourses: courses.length,
    activeCourses: active,
    inactiveCourses: inactive,
    archivedCourses: archived,
    byType,
    courses,
  };
}

/**
 * Get enrollment statistics
 */
export async function getEnrollmentSummary() {
  await delay();

  const enrollments = db.getAllEnrollments();
  const byStatus = {
    ongoing: enrollments.filter((e) => e.status === "ongoing").length,
    completed: enrollments.filter((e) => e.status === "completed").length,
    dropped: enrollments.filter((e) => e.status === "dropped").length,
    pending: enrollments.filter((e) => e.status === "pending").length,
  };

  return {
    totalEnrollments: enrollments.length,
    byStatus,
    enrollments,
  };
}

/**
 * Get department course summary
 * Shows how many courses each department has
 */
export async function getDepartmentCourseSummary(): Promise<DepartmentCourseSummary[]> {
  await delay();

  const departments = db.getAllDepartments();
  const courses = db.getAllCourses();

  return departments.map((dept) => {
    const deptCourses = courses.filter((c) => c.department === dept.code);
    const activeCourses = deptCourses.filter((c) => c.status === "active").length;

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      departmentCode: dept.code,
      totalCourses: deptCourses.length,
      activeCourses: activeCourses,
      inactiveCourses: deptCourses.length - activeCourses,
      courseIds: deptCourses.map((c) => c.id),
    };
  });
}

/**
 * Get course enrollment statistics
 */
export async function getCourseEnrollmentStats(courseId: string) {
  await delay();

  const course = db.getCourseById(courseId);
  if (!course) {
    throw new Error(`Course with ID ${courseId} not found`);
  }

  const enrollments = db.getEnrollmentsByCourseId(courseId);
  const completed = enrollments.filter((e) => e.status === "completed");
  const ongoing = enrollments.filter((e) => e.status === "ongoing");
  const dropped = enrollments.filter((e) => e.status === "dropped");

  return {
    courseId: course.id,
    courseName: course.name,
    courseCode: course.code,
    totalEnrolled: enrollments.length,
    completed: completed.length,
    ongoing: ongoing.length,
    dropped: dropped.length,
    capacity: course.capacity,
    capacityUsed: Math.round((enrollments.length / (course.capacity || enrollments.length + 1)) * 100),
  };
}