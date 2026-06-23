"use client";

import React, { useMemo, useState } from "react";

interface School {
  id: string;
  name: string;
  code: string;
  type: "primary" | "secondary" | "tertiary" | "vocational";
  location: string;
  contact: string;
  email: string;
  principal: string;
  studentCount: number;
  staffCount: number;
  status: "active" | "inactive";
  createdAt: Date;
}

interface SchoolFormData {
  name: string;
  code: string;
  type: "primary" | "secondary" | "tertiary" | "vocational";
  location: string;
  contact: string;
  email: string;
  principal: string;
  status: "active" | "inactive";
}

const SCHOOL_TYPES = ["primary", "secondary", "tertiary", "vocational"];

export function SchoolsManagementPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "add" | "edit">("list");
  const [selected, setSelected] = useState<School | null>(null);
  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    code: "",
    type: "secondary",
    location: "",
    contact: "",
    email: "",
    principal: "",
    status: "active",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return schools;
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        s.location.toLowerCase().includes(term)
    );
  }, [schools, searchTerm]);

  const handleAdd = () => {
    setViewMode("add");
    setSelected(null);
    setFormData({
      name: "",
      code: "",
      type: "secondary",
      location: "",
      contact: "",
      email: "",
      principal: "",
      status: "active",
    });
  };

  const handleEdit = (school: School) => {
    setSelected(school);
    setFormData({
      name: school.name,
      code: school.code,
      type: school.type,
      location: school.location,
      contact: school.contact,
      email: school.email,
      principal: school.principal,
      status: school.status,
    });
    setViewMode("edit");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("School name is required");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!formData.code.trim()) {
      setErrorMessage("School code is required");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Valid email is required");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (viewMode === "add") {
      const newSchool: School = {
        id: `SCHOOL-${Date.now()}`,
        name: formData.name,
        code: formData.code,
        type: formData.type,
        location: formData.location,
        contact: formData.contact,
        email: formData.email,
        principal: formData.principal,
        status: formData.status,
        studentCount: 0,
        staffCount: 0,
        createdAt: new Date(),
      };
      setSchools([newSchool, ...schools]);
      setSuccessMessage("School created successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setViewMode("list");
    } else if (viewMode === "edit" && selected) {
      const updated = schools.map((s) =>
        s.id === selected.id
          ? {
              ...s,
              name: formData.name,
              code: formData.code,
              type: formData.type,
              location: formData.location,
              contact: formData.contact,
              email: formData.email,
              principal: formData.principal,
              status: formData.status,
            }
          : s
      );
      setSchools(updated);
      setSuccessMessage("School updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setViewMode("list");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this school?")) return;
    const updated = schools.filter((s) => s.id !== id);
    setSchools(updated);
    setSuccessMessage("School deleted successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelected(null);
    setFormData({
      name: "",
      code: "",
      type: "secondary",
      location: "",
      contact: "",
      email: "",
      principal: "",
      status: "active",
    });
  };

  if (viewMode === "add" || (viewMode === "edit" && selected)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{viewMode === "add" ? "Add New School" : `Edit School: ${selected?.name}`}</h1>
          <p className="text-gray-600 mt-1">{viewMode === "add" ? "Create a new school record" : "Update school information"}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., St. Mary's Secondary School"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., SMS-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as School["type"] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCHOOL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as School["status"] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Nairobi, Kenya"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal/Head</label>
              <input
                type="text"
                value={formData.principal}
                onChange={(e) => setFormData((prev) => ({ ...prev, principal: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Dr. John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., +254 712 345 678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., info@school.com"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {viewMode === "add" ? "Create School" : "Update School"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schools Management</h1>
          <p className="text-gray-600 mt-1">Manage school information and settings</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Add School
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Total Schools</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{schools.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{schools.filter((s) => s.status === "active").length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Inactive</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{schools.filter((s) => s.status === "inactive").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, code, or location..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {schools.length === 0 ? "No schools yet. Click '+ Add School' to create one." : "No schools match your search."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700">Name</th>
                <th className="p-3 text-left font-medium text-gray-700">Code</th>
                <th className="p-3 text-left font-medium text-gray-700">Type</th>
                <th className="p-3 text-left font-medium text-gray-700">Location</th>
                <th className="p-3 text-left font-medium text-gray-700">Principal</th>
                <th className="p-3 text-left font-medium text-gray-700">Status</th>
                <th className="p-3 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((school) => (
                <tr key={school.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{school.name}</td>
                  <td className="p-3 text-gray-600">{school.code}</td>
                  <td className="p-3 text-gray-600 capitalize">{school.type}</td>
                  <td className="p-3 text-gray-600">{school.location}</td>
                  <td className="p-3 text-gray-600">{school.principal}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        school.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(school)}
                        className="px-3 py-1 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(school.id)}
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
