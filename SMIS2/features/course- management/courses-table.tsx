/**
 * Courses Table Component
 * Display courses in a sortable, filterable table
 */

"use client";
import React, { useState } from "react";
import { CourseRecord, COURSE_STATUS_COLORS } from "./courses";
import { Badge } from "@/features/admin-dashboard/components/ui/badge";
import { Button } from "@/features/admin-dashboard/components/ui/button";
import { Trash2, Edit2, Eye } from "lucide-react";

interface CoursesTableProps {
  courses: CourseRecord[];
  onEdit?: (course: CourseRecord) => void;
  onDelete?: (courseId: string) => void;
  onView?: (course: CourseRecord) => void;
  isLoading?: boolean;
}

export function CoursesTable({
  courses,
  onEdit,
  onDelete,
  onView,
  isLoading,
}: CoursesTableProps) {
  const [sortField, setSortField] = useState<keyof CourseRecord>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof CourseRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading courses...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No courses found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 border-b sticky top-0">
          <tr>
            <th
              className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("code")}
            >
              Code {sortField === "code" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("name")}
            >
              Course Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("type")}
            >
              Type {sortField === "type" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("department")}
            >
              Department {sortField === "department" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("duration")}
            >
              Duration {sortField === "duration" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Start Month
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCourses.map((course) => (
            <tr
              key={course.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {course.code}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                {course.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                {course.type}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                {course.department}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {course.duration}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {course.startMonth}
              </td>
              <td className="px-4 py-3 text-sm">
                <Badge
                  className={COURSE_STATUS_COLORS[course.status]}
                  variant="outline"
                >
                  {course.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(course)}
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(course)}
                      title="Edit course"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete course "${course.name}"?`)) {
                          onDelete(course.id);
                        }
                      }}
                      title="Delete course"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
