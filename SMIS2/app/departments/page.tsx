/**
 * Departments Management Page
 */

"use client";


import React, { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";
import type { DepartmentFormData } from "@/features/department-management/department-operations";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} from "@/features/department-management/department-operations";

import type { DepartmentRecord } from "@/features/lib/db/init";

type ViewMode = "list" | "add" | "edit";

const emptyDepartmentForm: DepartmentFormData = {
  code: "",
  name: "",
  description: "",
  budget: undefined,
  headId: undefined,
};

export default function DepartmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedDept, setSelectedDept] = useState<DepartmentRecord | null>(null);
  const [form, setForm] = useState<DepartmentFormData>(emptyDepartmentForm);

  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return departments;
    return departments.filter((d) => {
      return [d.code, d.name, d.description].some((v) => v.toLowerCase().includes(term));
    });
  }, [departments, searchTerm]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllDepartments();
        setDepartments(data);
      } catch (e) {
        console.error(e);
        setErrorMessage("Failed to load departments");
        setTimeout(() => setErrorMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAdd = () => {
    setSelectedDept(null);
    setForm(emptyDepartmentForm);
    setViewMode("add");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (viewMode === "add") {
        const result = await createDepartment(form);
        setDepartments((prev) => [result, ...prev]);
        setSuccessMessage("Department created successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        setViewMode("list");
      } else if (viewMode === "edit" && selectedDept) {
        const updated = await updateDepartment(selectedDept.id, form);
        if (updated) {
          setDepartments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
          setSuccessMessage("Department updated successfully");
          setTimeout(() => setSuccessMessage(""), 3000);
        }
        setViewMode("list");
        setSelectedDept(null);
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Department operation failed";
      setErrorMessage(message);

      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (dept: DepartmentRecord) => {
    setSelectedDept(dept);
    setForm({
      code: dept.code,
      name: dept.name,
      description: dept.description,
      budget: dept.budget,
      headId: dept.headId,
    });
    setViewMode("edit");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this department?")) return;

    try {
      setSubmitting(true);
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      setSuccessMessage("Department deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to delete department";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 3000);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage department records</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Add Department
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

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Code, name, or description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {viewMode === "list" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-gray-600">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-gray-600">No departments found.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-sm font-medium text-gray-700">Code</th>
                  <th className="p-3 text-sm font-medium text-gray-700">Name</th>
                  <th className="p-3 text-sm font-medium text-gray-700">Description</th>
                  <th className="p-3 text-sm font-medium text-gray-700">Budget</th>
                  <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b last:border-b-0">
                    <td className="p-3 text-sm text-gray-900">{d.code}</td>
                    <td className="p-3 text-sm text-gray-900">{d.name}</td>
                    <td className="p-3 text-sm text-gray-600">{d.description}</td>
                    <td className="p-3 text-sm text-gray-900">{d.budget ?? "-"}</td>
                    <td className="p-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(d)}
                          className="px-3 py-1 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          disabled={submitting}
                          className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
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
      )}

      {(viewMode === "add" || (viewMode === "edit" && selectedDept)) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {viewMode === "add" ? "Add Department" : "Edit Department"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. ACAD"
                disabled={viewMode === "edit"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Academic Affairs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <input
                value={form.budget ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((p) => ({
                    ...p,
                    budget: v === "" ? undefined : Number(v),
                  }));
                }}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Head ID (optional)</label>
              <input
                value={form.headId ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, headId: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. staff-123"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setViewMode("list");
                setSelectedDept(null);
              }}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
    </AdminShell>
  );
}

