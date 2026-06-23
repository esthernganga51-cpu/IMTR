"use client";

import { useState } from "react";
import type { Student, StudentStatus } from "@/features/student-admissions/types/student";
import { StatusBadge } from "@/features/student-admissions/components/status-badge";
import { StatusActions } from "@/features/student-admissions/components/status-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/student-admissions/components/ui/table";

type StudentsTableProps = {
  students: Student[];
};

export function StudentsTable({ students: initialStudents }: StudentsTableProps) {
  const [students, setStudents] = useState(initialStudents);

  const handleStatusChange = (studentId: string, newStatus: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, status: newStatus as StudentStatus }
          : s
      )
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No pending applications
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.applicationId}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>{student.level}</TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell>
                  <StatusActions
                    studentId={student.id}
                    currentStatus={student.status}
                    onStatusChange={handleStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
