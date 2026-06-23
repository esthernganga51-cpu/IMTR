/**
 * Students Management Page
 * Complete student management interface
 */

"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";





import { getAllStudents, getStudentSummary } from "@/features/student-management/data/student-db";
import {
  createStudentAction,
  updateStudentAction,
  deleteStudentAction,
} from "@/features/student-management/actions/student-mutations";
import { StudentForm } from "@/features/student-management/components/student-form";
import { StudentsTable } from "@/features/student-management/components/students-table";
import type { Student, StudentFormData, StudentFilters, StudentSummary } from "@/features/student-management/types/student";

type ViewMode = "list" | "add" | "edit";

export function StudentsManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);


  const [summary, setSummary] = useState<StudentSummary | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, startTransition] = useTransition();

  const departments = [
    "Meteorology",
    "Agriculture",
    "Aviation",
    "Marine",
    "Environment",
    "Hydrology",
    "Other",
  ];

  // Load students and summary
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [studentsData, summaryData] = await Promise.all([
          getAllStudents(),
          getStudentSummary(),
        ]);
        setStudents(studentsData);
        setSummary(summaryData);
        // Initially show all students; filters applied by separate effect
        setFilteredStudents(studentsData);

      } catch (error) {
        setErrorMessage("Failed to load students");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters
  const applyFilters = useCallback((data: Student[] = students) => {



    let filtered = data;

    const filters: StudentFilters = {};
    if (searchTerm) filters.searchTerm = searchTerm;
    if (filterDepartment) filters.department = filterDepartment;
    if (filterStatus) filters.status = filterStatus as Student['status'];



    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.firstName.toLowerCase().includes(term) ||
          s.lastName.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.admissionNumber.toLowerCase().includes(term)
      );
    }

    if (filters.department) {
      filtered = filtered.filter((s) => s.department === filters.department);
    }

    if (filters.status) {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterDepartment, filterStatus]);

  

    // Re-apply filters when students or filter inputs change
    useEffect(() => {
      startTransition(() => applyFilters());
    }, [applyFilters, startTransition]);


  const handleCreateStudent = async (formData: StudentFormData) => {
    setSubmitting(true);
    try {
      const result = await createStudentAction(formData);
      if (result.success && result.student) {
        setSuccessMessage(result.message);
        const updatedStudents = [result.student, ...students];
        setStudents(updatedStudents);
        applyFilters(updatedStudents);
        setViewMode("list");

        // Reload summary
        const newSummary = await getStudentSummary();
        setSummary(newSummary);

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.error || result.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Failed to create student");
      console.error(error);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStudent = async (formData: StudentFormData) => {
    if (!selectedStudent) return;

    setSubmitting(true);
    try {
      const result = await updateStudentAction(selectedStudent.id, formData);
      if (result.success && result.student) {
        setSuccessMessage(result.message);
        const updatedStudents = students.map((s) =>
          s.id === selectedStudent.id ? result.student! : s
        );
        setStudents(updatedStudents);
        applyFilters(updatedStudents);
        setViewMode("list");
        setSelectedStudent(null);

        // Reload summary
        const newSummary = await getStudentSummary();
        setSummary(newSummary);

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.error || result.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Failed to update student");
      console.error(error);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const result = await deleteStudentAction(studentId);
      if (result.success) {
        setSuccessMessage("Student deleted successfully");
        const updatedStudents = students.filter((s) => s.id !== studentId);
        setStudents(updatedStudents);
        applyFilters(updatedStudents);

        // Reload summary
        const newSummary = await getStudentSummary();
        setSummary(newSummary);

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.error || result.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Failed to delete student");
      console.error(error);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewMode("edit");
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedStudent(null);
  };

  if (viewMode === "add") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
          <p className="text-gray-600 mt-1">Create a new student record</p>
        </div>

        <StudentForm
          onSubmit={handleCreateStudent}
          isLoading={submitting}
          onCancel={handleCancel}
          departments={departments}
        />
      </div>
    );
  }

  if (viewMode === "edit" && selectedStudent) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Student: {selectedStudent.firstName} {selectedStudent.lastName}
          </h1>
          <p className="text-gray-600 mt-1">Update student information</p>
        </div>

        <StudentForm
          student={selectedStudent}
          onSubmit={handleUpdateStudent}
          isLoading={submitting}
          onCancel={handleCancel}
          departments={departments}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 mt-1">Manage all student records</p>
        </div>
        <button
          onClick={() => setViewMode("add")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Add Student
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{summary.totalStudents}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{summary.activeStudents}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Inactive</p>
            <p className="text-3xl font-bold text-gray-600 mt-1">{summary.inactiveStudents}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Graduated</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{summary.graduatedStudents}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Suspended</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{summary.suspendedStudents}</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, email, or admission number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable
        students={filteredStudents}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        isLoading={loading}
      />
    </div>
  );
}
