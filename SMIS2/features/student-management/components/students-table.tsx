/**
 * Students Table Component
 * Display students in a formatted table with actions
 */

"use client";

import React from "react";
import type { Student } from "@/features/student-management/types/student";

interface StudentsTableProps {
  students: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  graduated: "bg-blue-100 text-blue-800",
  suspended: "bg-red-100 text-red-800",
};

// genderDisplay removed: not currently used

export function StudentsTable({
  students,
  onEdit,
  onDelete,
  isLoading,
}: StudentsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">No students found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-700">
              Admission #
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">
              Email
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">
              Department
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">
              Course / Level
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-center font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">
                {student.admissionNumber}
              </td>
              <td className="px-4 py-3 text-gray-900">
                {student.firstName} {student.lastName}
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs">{student.email}</td>
              <td className="px-4 py-3 text-gray-700">{student.department}</td>
              <td className="px-4 py-3 text-gray-700">
                {student.course} / {student.level}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[student.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(student)}
                      className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(student.id)}
                      className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      Delete
                    </button>
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
