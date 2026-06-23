"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "@/features/admin-dashboard/components/ui/badge";
import { Button } from "@/features/admin-dashboard/components/ui/button";
import { Edit2, Eye, Plus, Trash2 } from "lucide-react";

import { AddCourseForm } from "@/features/admin-dashboard/components/course list/AddCourseForm";
import type { CourseConfiguration } from "@/features/academic-admin/types/academic";

export type CourseListCourse = {
  id: string;
  courseName: string;
  department: string;
  intake: string;
  level: string;
  status?: string;
};

type CourseListProps = Readonly<{
  initialCourses: CourseConfiguration[];
}>;

export function CourseList({ initialCourses }: CourseListProps) {
  const [courses] = useState<CourseListCourse[]>(
    initialCourses.map((course) => ({
      courseName: course.courseName,
      department: course.department,
      id: course.id,
      intake: course.intake,
      level: course.level,
      status: "ACTIVE",
    })),
  );

  const emptyStateMessage = useMemo(() => {
    return courses.length
      ? null
      : "No courses configured yet. Use 'Add course' to start building the catalogue.";
  }, [courses.length]);

  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-card p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Course Registry</h1>
          <p className="text-sm text-muted-foreground">Manage official academic programs.</p>
        </div>

        <div className="w-full sm:w-[420px]">
          <AddCourseForm onCreated={() => {
            // Rely on revalidation/refresh for full sync. For now, keep UI responsive.
            // The underlying academic-admin snapshot will include newly created courses.
            window.location.reload();
          }} />
        </div>
      </div>

      {emptyStateMessage ? (
        <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
          {emptyStateMessage}
        </div>
      ) : null}

      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-muted-foreground font-medium">
            <th className="p-4">Course</th>
            <th className="p-4">Department</th>
            <th className="p-4">Intake</th>
            <th className="p-4">Level</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr
              key={course.id}
              className="border-b border-border hover:bg-muted/30 transition-colors"
            >
              <td className="p-4 font-medium">
                <span className="block font-semibold">{course.courseName}</span>
              </td>
              <td className="p-4">{course.department}</td>
              <td className="p-4">{course.intake}</td>
              <td className="p-4">{course.level}</td>
              <td className="p-4">
                <Badge className="bg-green-600 text-white">{course.status ?? "ACTIVE"}</Badge>
              </td>
              <td className="p-4 text-right space-x-2">
                <Button variant="ghost" size="icon" aria-label="View">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Edit">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          {!courses.length ? null : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-xs text-muted-foreground">
                Loaded {courses.length} courses
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <Plus className="size-4" aria-hidden="true" />
        Admin can add new courses above.
      </div>
    </div>
  );
}

