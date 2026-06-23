// Course data fetching utilities for course-management module
import { CourseRecord } from '../lib/db/init';

/**
 * Fetch all courses from the database
 */
export async function fetchAllCourses(): Promise<CourseRecord[]> {
  try {
    const response = await fetch('/api/courses');
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
    const data = await response.json();
    return data as CourseRecord[];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

/**
 * Fetch a single course by ID
 */
export async function fetchCourseById(id: string): Promise<CourseRecord | null> {
  try {
    const response = await fetch(`/api/courses/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }
    const data = await response.json();
    return data as CourseRecord;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch courses by department
 */
export async function fetchCoursesByDepartment(departmentId: string): Promise<CourseRecord[]> {
  try {
    const response = await fetch(`/api/courses?department=${departmentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
    const data = await response.json();
    return data as CourseRecord[];
  } catch (error) {
    console.error(`Error fetching courses for department ${departmentId}:`, error);
    throw error;
  }
}

/**
 * Fetch courses by level
 */
export async function fetchCoursesByLevel(level: string): Promise<CourseRecord[]> {
  try {
    const response = await fetch(`/api/courses?level=${level}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
    const data = await response.json();
    return data as CourseRecord[];
  } catch (error) {
    console.error(`Error fetching courses for level ${level}:`, error);
    throw error;
  }
}

/**
 * Fetch courses with pagination
 */
export async function fetchCoursesWithPagination(
  page: number = 1,
  limit: number = 10
): Promise<{ courses: CourseRecord[]; total: number }> {
  try {
    const response = await fetch(`/api/courses?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
    const data = await response.json();
    return data as { courses: CourseRecord[]; total: number };
  } catch (error) {
    console.error('Error fetching courses with pagination:', error);
    throw error;
  }
}

/**
 * Search courses by name or code
 */
export async function searchCourses(query: string): Promise<CourseRecord[]> {
  try {
    const response = await fetch(`/api/courses/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Failed to search courses: ${response.statusText}`);
    }
    const data = await response.json();
    return data as CourseRecord[];
  } catch (error) {
    console.error(`Error searching courses for "${query}":`, error);
    throw error;
  }
}