"use client";

import React, { useState } from "react";
import Link from "next/link";

import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";

interface Application {
  id: string;
  studentName: string;
  email: string;
  course: string;
  level: string;
  status: "pending" | "approved" | "rejected" | "deferred";
  appliedAt: Date;
  notes?: string;
}

export default function AdmissionsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);

  // NOTE: This page is the canonical /admissions landing page.
  // Enrollment/Clearance/Hostel are separate routes under /admissions/*.

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    course: "",
    level: "",
    notes: "",
  });
  
  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.email || !formData.course) return;

    const newApp: Application = {
      id: `APP-${Date.now()}`,
      studentName: formData.studentName,
      email: formData.email,
      course: formData.course,
      level: formData.level,
      status: "pending",
      appliedAt: new Date(),
      notes: formData.notes,
    };

    setApplications([newApp, ...applications]);
    setFormData({ studentName: "", email: "", course: "", level: "", notes: "" });
    setShowForm(false);
  };

  const handleStatusChange = (appId: string, newStatus: Application["status"]) => {
    setApplications(
      applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <Link href="/admissions" className="py-3 px-1 border-b-2 border-blue-600 font-medium text-sm text-blue-600">
              Applications
            </Link>

            <Link href="/admissions/clearance" className="py-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-600 hover:text-gray-900">
              Clearance
            </Link>
            <Link href="/admissions/enrollment" className="py-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-600 hover:text-gray-900">
              Enrollment
            </Link>
            <Link href="/admissions/hostel" className="py-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-600 hover:text-gray-900">
              Hostel
            </Link>

          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Admissions</h1>
            <p className="text-gray-600 mt-1">Review and manage pending student applications</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            + New Application
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Total Applications</p>
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
            <h3 className="text-lg font-semibold mb-4">Add New Application</h3>
            <form onSubmit={handleAddApplication} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Student Name" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="text" placeholder="Course" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} required className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="text" placeholder="Level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">Save Application</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md">Cancel</button>
            </form>
          </div>
        )}

        {applications.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Course</th>
                  <th className="px-4 py-3 text-left font-medium">Level</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{app.studentName}</td>
                    <td className="px-4 py-3 text-sm">{app.email}</td>
                    <td className="px-4 py-3">{app.course}</td>
                    <td className="px-4 py-3">{app.level}</td>
                    <td className="px-4 py-3">
                      <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value as Application["status"])} className="px-2 py-1 rounded text-xs font-medium border border-gray-300">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="deferred">Deferred</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">{app.appliedAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No applications yet</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}