"use client";

import React from "react";

import type { StaffRecord } from "@/features/staff-management/types/staff";

interface StaffsTableProps {
  staffs: StaffRecord[];
  onEdit?: (staff: StaffRecord) => void;
  onDelete?: (staffId: string) => void;
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  "on-leave": "bg-yellow-100 text-yellow-900",
  retired: "bg-blue-100 text-blue-800",
};

const roleShort: Record<string, string> = {
  teacher: "Teach",
  admin: "Admin",
  support: "Support",
  manager: "Manage",
  director: "Director",
};

export function StaffsTable({ staffs, onEdit, onDelete, isLoading }: StaffsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Loading staff...</p>
      </div>
    );
  }

  if (staffs.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">No staff found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Employee #</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Department</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Role</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Qualification</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
            <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((s) => (
            <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">{s.employeeId}</td>
              <td className="px-4 py-3 text-gray-900">{s.firstName} {s.lastName}</td>
              <td className="px-4 py-3 text-gray-600 text-xs">{s.email}</td>
              <td className="px-4 py-3 text-gray-700">{s.department}</td>
              <td className="px-4 py-3 text-gray-700">{roleShort[s.role] || s.role}</td>
              <td className="px-4 py-3 text-gray-700">{s.qualification}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[s.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {s.status.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(s)}
                      className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(s.id)}
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

