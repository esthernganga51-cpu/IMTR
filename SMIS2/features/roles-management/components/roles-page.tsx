"use client";

import React, { useMemo, useState } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: Date;
}

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  "create_student",
  "edit_student",
  "delete_student",
  "view_reports",
  "manage_fees",
  "manage_staff",
  "manage_departments",
  "manage_roles",
  "view_analytics",
  "export_data",
];

export function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "add" | "edit">("list");
  const [selected, setSelected] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return roles;
    return roles.filter((r) => r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term));
  }, [roles, searchTerm]);

  const handleAdd = () => {
    setViewMode("add");
    setSelected(null);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const handleEdit = (role: Role) => {
    setSelected(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setViewMode("edit");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Role name is required");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (viewMode === "add") {
      const newRole: Role = {
        id: `ROLE-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        userCount: 0,
        createdAt: new Date(),
      };
      setRoles([newRole, ...roles]);
      setSuccessMessage("Role created successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setViewMode("list");
    } else if (viewMode === "edit" && selected) {
      const updated = roles.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              name: formData.name,
              description: formData.description,
              permissions: formData.permissions,
            }
          : r
      );
      setRoles(updated);
      setSuccessMessage("Role updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setViewMode("list");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    const updated = roles.filter((r) => r.id !== id);
    setRoles(updated);
    setSuccessMessage("Role deleted successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelected(null);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const togglePermission = (perm: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  if (viewMode === "add" || (viewMode === "edit" && selected)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{viewMode === "add" ? "Add New Role" : `Edit Role: ${selected?.name}`}</h1>
          <p className="text-gray-600 mt-1">{viewMode === "add" ? "Create a new user role" : "Update role information"}</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Administrator"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Count</label>
              <input
                type="number"
                value={selected?.userCount ?? ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Role description"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700">{perm.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {viewMode === "add" ? "Create Role" : "Update Role"}
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
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600 mt-1">Manage user roles and access permissions</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Add Role
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
          placeholder="Search by role name or description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {roles.length === 0 ? "No roles yet. Click '+ Add Role' to create one." : "No roles match your search."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700">Role Name</th>
                <th className="p-3 text-left font-medium text-gray-700">Description</th>
                <th className="p-3 text-left font-medium text-gray-700">Permissions</th>
                <th className="p-3 text-left font-medium text-gray-700">Users</th>
                <th className="p-3 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((role) => (
                <tr key={role.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{role.name}</td>
                  <td className="p-3 text-gray-600">{role.description}</td>
                  <td className="p-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {role.permissions.length} perms
                    </span>
                  </td>
                  <td className="p-3 text-gray-900">{role.userCount}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="px-3 py-1 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
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
