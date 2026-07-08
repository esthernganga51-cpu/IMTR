"use client";

import React, { useMemo, useState } from "react";

import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";
import { Button } from "@/features/admin-dashboard/components/ui/button";
import { StudentForm } from "@/features/student-management/components/student-form";
import type { Student, StudentFormData } from "@/features/student-management/types/student";
import type { StudentStatus } from "@/features/student-management/types/student";
import { createStudentAction } from "@/features/student-management/actions/student-mutations";
import { getAllStudents } from "@/features/student-management/data/student-db";



export default function AdmissionEnrollmentPage() {
  const [loading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  const stats = useMemo(() => {
    return {
      total: students.length,
      active: students.filter((s) => s.status === "active").length,
      inactive: students.filter((s) => s.status === "inactive").length,
      graduated: students.filter((s) => s.status === "graduated").length,
      suspended: students.filter((s) => s.status === "suspended").length,
    };
  }, [students]);


  const refresh = async () => {
    const data = await getAllStudents();
    setStudents(data);
  };

  const initialStatus: StudentStatus = "active";

  const emptyForm = useMemo(
    () => ({
      admissionNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male" as const,
      studentType: "KENYAN" as const,
      nationalIdNumber: "",
      passportNumber: "",
      nationality: "",
      course: "",
      level: "",
      intake: "January",
      department: "",
      status: initialStatus,
      enrollmentDate: new Date().toISOString().split("T")[0],
      parentName: "",
      parentPhone: "",
      address: "",
    }),
    [initialStatus]
  );

  const [formData, setFormData] = useState<StudentFormData>(emptyForm);

  const handleCreate = async (data: StudentFormData) => {
    await createStudentAction(data);
    await refresh();
    setFormData(emptyForm);
    setShowForm(false);
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
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Inactive</p>
            <p className="text-3xl font-bold text-gray-700 mt-1">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Graduated</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.graduated}</p>
          </div>

        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Add Student Admission Details</h3>

            <StudentForm
              onSubmit={handleCreate}
              isLoading={loading}
              onCancel={() => {
                setShowForm(false);
                setFormData(emptyForm);
              }}
            />
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
                    <td className="px-4 py-3">{s.status}</td>
                    <td className="px-4 py-3 text-sm">{(s.createdAt ?? new Date()).toLocaleDateString()}</td>
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

