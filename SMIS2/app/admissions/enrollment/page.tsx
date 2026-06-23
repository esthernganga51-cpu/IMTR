"use client";

import React, { useMemo, useState } from "react";

import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";
import { Button } from "@/features/admin-dashboard/components/ui/button";

type EnrollmentStatus = "pending" | "approved" | "rejected";

type StudentDetails = {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  course: string;
  level: string;
  phone?: string;
  status: EnrollmentStatus;
  notes?: string;
  createdAt: Date;
};

export default function AdmissionEnrollmentPage() {
  const [loading] = useState(false);
  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [showForm, setShowForm] = useState(true);

  const emptyForm = useMemo(
    () => ({
      admissionNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      course: "",
      level: "",
      phone: "",
      status: "pending" as EnrollmentStatus,
      notes: "",
    }),
    []
  );

  const [formData, setFormData] = useState(emptyForm);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    const required = [
      formData.admissionNumber,
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.department,
      formData.course,
      formData.level,
    ];
    if (required.some((v) => !v.trim())) return;

    const newStudent: StudentDetails = {
      id: `ADM-${Date.now()}`,
      admissionNumber: formData.admissionNumber.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      course: formData.course.trim(),
      level: formData.level.trim(),
      phone: formData.phone?.trim() ? formData.phone.trim() : undefined,
      status: formData.status,
      notes: formData.notes?.trim() ? formData.notes.trim() : undefined,
      createdAt: new Date(),
    };

    setStudents((prev) => [newStudent, ...prev]);
    setFormData(emptyForm);
    setShowForm(false);
  };

  const stats = useMemo(() => {
    return {
      total: students.length,
      pending: students.filter((s) => s.status === "pending").length,
      approved: students.filter((s) => s.status === "approved").length,
      rejected: students.filter((s) => s.status === "rejected").length,
    };
  }, [students]);

  const updateStatus = (id: string, next: EnrollmentStatus) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: next } : s)));
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admission Enrollment</h1>
            <p className="text-gray-600 mt-1">Collect and manage student admission details</p>
          </div>

          <Button variant="default" disabled={loading} onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Hide Form" : "+ New Student"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Add Student Admission Details</h3>

            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Admission Number"
                value={formData.admissionNumber}
                onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              <input
                type="text"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              <input
                type="text"
                placeholder="Course"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              <input
                type="text"
                placeholder="Level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EnrollmentStatus })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                Save Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(emptyForm);
                  setShowForm(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {students.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Admission #</th>
                  <th className="px-4 py-3 text-left font-medium">Student</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Course</th>
                  <th className="px-4 py-3 text-left font-medium">Dept</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Applied</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono">{s.admissionNumber}</td>
                    <td className="px-4 py-3">{s.firstName} {s.lastName}</td>
                    <td className="px-4 py-3 text-sm">{s.email}</td>
                    <td className="px-4 py-3">{s.course} ({s.level})</td>
                    <td className="px-4 py-3">{s.department}</td>
                    <td className="px-4 py-3">
                      <select
                        value={s.status}
                        onChange={(e) => updateStatus(s.id, e.target.value as EnrollmentStatus)}
                        className="px-2 py-1 rounded text-xs font-medium border border-gray-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">{s.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No students added yet</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

