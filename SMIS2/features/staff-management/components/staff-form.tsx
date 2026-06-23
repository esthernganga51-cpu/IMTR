"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/features/admin-dashboard/components/ui/button";
import { Input } from "@/features/admin-dashboard/components/ui/input";
import { Label } from "@/features/admin-dashboard/components/ui/label";
import { Textarea } from "@/features/admin-dashboard/components/ui/textarea";

import type { StaffRole, StaffStatus, Qualification } from "@/features/staff-management/types/staff";
import type { StaffFormData } from "@/features/staff-management/actions/staff-mutations";
import type { StaffRecord } from "@/features/staff-management/types/staff";


interface StaffFormProps {
  staff?: StaffRecord;
  onSubmit: (data: StaffFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

const ROLES: StaffRole[] = ["teacher", "admin", "support", "manager", "director"];
const STATUSES: StaffStatus[] = ["active", "inactive", "on-leave", "retired"];
const QUALIFICATIONS: Qualification[] = ["diploma", "bachelor", "master", "phd", "certificate"];
const GENDERS: StaffRecord["gender"][] = ["male", "female", "other"];

export function StaffForm({ staff, onSubmit, isLoading, onCancel }: StaffFormProps) {
  const initial = useMemo<StaffFormData>(
    () => ({
      employeeId: staff?.employeeId || "",
      firstName: staff?.firstName || "",
      lastName: staff?.lastName || "",
      email: staff?.email || "",
      phone: staff?.phone || "",
      department: staff?.department || "",
      role: staff?.role || "teacher",
      qualification: staff?.qualification || "bachelor",
      dateOfBirth: staff?.dateOfBirth ? new Date(staff.dateOfBirth).toISOString().split("T")[0] : "",
      gender: staff?.gender || "male",
      hireDate: staff?.hireDate ? new Date(staff.hireDate).toISOString().split("T")[0] : "",
      status: staff?.status || "active",
      salary: staff?.salary !== undefined ? String(staff.salary) : undefined,
      specialization: staff?.specialization || "",
    }),
    [staff]
  );

  const [formData, setFormData] = useState<StaffFormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof StaffFormData>(field: K, value: StaffFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!formData.employeeId.trim()) next.employeeId = "Employee ID is required";
    if (!formData.firstName.trim()) next.firstName = "First name is required";
    if (!formData.lastName.trim()) next.lastName = "Last name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Invalid email format";
    if (!formData.phone.trim()) next.phone = "Phone is required";
    if (!formData.department.trim()) next.department = "Department is required";
    if (!formData.dateOfBirth) next.dateOfBirth = "Date of birth is required";
    if (!formData.hireDate) next.hireDate = "Hire date is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Employee ID *</Label>
            <Input
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
              disabled={submitting || isLoading || !!staff}
              className="mt-1"
              placeholder="e.g., EMP-2024-001"
            />
            {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId}</p>}
          </div>
          <div>
            <Label>First Name *</Label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              disabled={submitting || isLoading}
              className="mt-1"
              placeholder="John"
            />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label>Last Name *</Label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              disabled={submitting || isLoading}
              className="mt-1"
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={submitting || isLoading}
              className="mt-1"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label>Phone *</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={submitting || isLoading}
              className="mt-1"
              placeholder="+254 712 345 678"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <Label>Department *</Label>
            <Input
              type="text"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              disabled={submitting || isLoading}
              className="mt-1"
              placeholder="e.g., Computer Science"
            />
            {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date of Birth *</Label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              disabled={submitting || isLoading}
              className="mt-1"
            />
            {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <Label>Gender</Label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value as StaffFormData["gender"])}
              disabled={submitting || isLoading}
              className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Hire Date *</Label>
            <Input
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleChange("hireDate", e.target.value)}
              disabled={submitting || isLoading}
              className="mt-1"
            />
            {errors.hireDate && <p className="text-xs text-red-500 mt-1">{errors.hireDate}</p>}
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value as StaffStatus)}
              disabled={submitting || isLoading}
              className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role & Qualifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Role</Label>
            <select
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value as StaffRole)}
              disabled={submitting || isLoading}
              className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Qualification</Label>
            <select
              value={formData.qualification}
              onChange={(e) => handleChange("qualification", e.target.value as Qualification)}
              disabled={submitting || isLoading}
              className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {QUALIFICATIONS.map((q) => (
                <option key={q} value={q}>
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Specialization</Label>
            <Input
              type="text"
              value={formData.specialization || ""}
              onChange={(e) => handleChange("specialization", e.target.value)}
              disabled={submitting || isLoading}
              className="mt-1"
              placeholder="e.g., Data Science"
            />
          </div>
          <div>
            <Label>Salary</Label>
            <Input
              type="number"
              value={formData.salary ?? ""}
              onChange={(e) => handleChange("salary", e.target.value ? e.target.value : undefined)}
              disabled={submitting || isLoading}
              className="mt-1"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label className="sr-only">Notes</Label>
          <Textarea value={""} disabled className="hidden" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={submitting || isLoading}
          className="flex-1"
        >
          {submitting || isLoading ? "Saving..." : staff ? "Update Staff" : "Create Staff"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" disabled={submitting || isLoading} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

