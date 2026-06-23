"use client";

import React, { useEffect, useMemo, useState } from "react";


import { getAllStaff } from "@/features/staff-management/data/staff-db";
import { createStaffAction, deleteStaffAction, updateStaffAction } from "@/features/staff-management/actions/staff-mutations";
import { StaffForm } from "@/features/staff-management/components/staff-form";
import { StaffsTable } from "@/features/staff-management/components/staffs-table";
import type { StaffFormData } from "@/features/staff-management/actions/staff-mutations";
import type { StaffRecord, StaffStatus } from "@/features/staff-management/types/staff";

type ViewMode = "list" | "add" | "edit";

export function StaffsManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [staffs, setStaffs] = useState<StaffRecord[]>([]);


  const [selected, setSelected] = useState<StaffRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | StaffStatus>("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllStaff();
        setStaffs(data);
      } catch (e) {
        setErrorMessage("Failed to load staff");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const departments = useMemo(() => {
    const set = new Set<string>();
    staffs.forEach((s) => set.add(s.department));
    return Array.from(set).sort();
  }, [staffs]);

  const filteredComputed = useMemo(() => {

    const term = search.trim().toLowerCase();

    return staffs.filter((s) => {
      const matchesSearch = term
        ? [s.employeeId, s.firstName, s.lastName, s.email, s.department, s.role, s.qualification].some(
            (v) => v.toLowerCase().includes(term)
          )
        : true;

      const matchesDepartment = filterDepartment ? s.department === filterDepartment : true;
      const matchesStatus = filterStatus ? s.status === filterStatus : true;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [staffs, search, filterDepartment, filterStatus]);



  const handleCreate = async (formData: StaffFormData) => {
    setSubmitting(true);
    try {
      const result = await createStaffAction(formData);
      if (result.success && result.staff) {
        setSuccessMessage(result.message);
        const updated = [result.staff, ...staffs];
        setStaffs(updated);
        setViewMode("list");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.error || result.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (e) {
      setErrorMessage("Failed to create staff");
      console.error(e);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (formData: StaffFormData) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const result = await updateStaffAction(selected.id, formData);
      if (result.success && result.staff) {
        setSuccessMessage(result.message);
        const updated = staffs.map((s) => (s.id === selected.id ? result.staff! : s));
        setStaffs(updated);
        setSelected(null);
        setViewMode("list");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.error || result.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (e) {
      setErrorMessage("Failed to update staff");
      console.error(e);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    setSubmitting(true);
    try {
      const result = await deleteStaffAction(staffId);
      if (result.success) {
        setSuccessMessage(result.message);
        const updated = staffs.filter((s) => s.id !== staffId);
        setStaffs(updated);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.error || result.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (e) {
      setErrorMessage("Failed to delete staff");
      console.error(e);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s: StaffRecord) => {
    setSelected(s);
    setViewMode("edit");
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelected(null);
  };

  if (viewMode === "add") {
  return (
    <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Staff</h1>
          <p className="text-gray-600 mt-1">Create a new staff record</p>
        </div>
        <StaffForm onSubmit={handleCreate} isLoading={submitting} onCancel={handleCancel} />
      </div>
    );
  }

  if (viewMode === "edit" && selected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Staff: {selected.firstName} {selected.lastName}
          </h1>
          <p className="text-gray-600 mt-1">Update staff information</p>
        </div>
        <StaffForm staff={selected} onSubmit={handleUpdate} isLoading={submitting} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage all staff records</p>
        </div>
        <button
          onClick={() => setViewMode("add")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Add Staff
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Employee ID, name, email, role..."
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
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "" | StaffStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      <StaffsTable staffs={filteredComputed} onEdit={handleEdit} onDelete={handleDelete} isLoading={loading} />

    </div>
  );
}

