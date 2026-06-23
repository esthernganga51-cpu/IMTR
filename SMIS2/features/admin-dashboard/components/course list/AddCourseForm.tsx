"use client";

import React, { useState, useTransition } from "react";
import { z } from "zod";
import { Plus } from "lucide-react";

import { Button } from "@/features/admin-dashboard/components/ui/button";
import { Input } from "@/features/admin-dashboard/components/ui/input";
import { Label } from "@/features/admin-dashboard/components/ui/label";
import { createCourseConfiguration } from "@/features/academic-admin/actions/course-mutations";

const AddCourseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  department: z.string().min(1, "Department is required"),
  intake: z.string().min(1, "Intake is required"),
  level: z.string().min(1, "Level is required"),
});

type Props = {
  onCreated?: () => void;
};

export function AddCourseForm({ onCreated }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>("");

  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("");
  const [intake, setIntake] = useState("");
  const [level, setLevel] = useState("");

  const departments = ["Meteorology", "Agriculture", "Aviation", "Environment"];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const parsed = AddCourseSchema.safeParse({
      courseName,
      department,
      intake,
      level,
    });

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Invalid course input");
      return;
    }

    // The academic course configuration schema requires at least one term.
    // Unit codes are required by the schema engine used in CourseConfigurationForm;
    // this minimal admin form creates an initial term with no units.
    // If schema rejects it, the server action will return the validation error.
    const payload = {
      courseName: parsed.data.courseName,
      department: parsed.data.department,
      intake: parsed.data.intake,
      level: parsed.data.level,
      terms: [{ name: "Term 1", unitCodes: [] as string[] }],
    };

    startTransition(() => {
      void createCourseConfiguration(payload)
        .then((result) => {
          setMessage(result.error ?? result.message);
          if (result.success && result.course) {
            setCourseName("");
            setDepartment("");
            setIntake("");
            setLevel("");
            onCreated?.();
          }
        })
        .catch((err) => {
          setMessage(err instanceof Error ? err.message : "Failed to create course");
        });
    });
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Add course</h2>
          <p className="text-sm text-muted-foreground">Create a new course record.</p>
        </div>
        <Button type="submit" disabled={isPending}>
          <Plus className="size-4" aria-hidden="true" />
          {isPending ? "Saving..." : "Create"}
        </Button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="courseName">Course name</Label>
          <Input
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g., Advanced Meteorological Technician Course (AMTC)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <select
            id="department"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="intake">Intake</Label>
          <Input
            id="intake"
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
            placeholder="e.g., January 2027"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Input
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="e.g., WMO Class II"
          />
        </div>
      </div>

      {message ? (
        <p className="mt-3 text-sm" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}

