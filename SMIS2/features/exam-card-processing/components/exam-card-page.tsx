"use client";

import React, { useMemo, useState } from "react";

interface ExamCourse {
  department: string;
  id: string;
  intake: string;
  level: string;
  name: string;
  terms: Array<{
    name: string;
    units: Array<{
      code: string;
      name: string;
    }>;
  }>;
}

interface ExamCard {
  id: string;
  studentId: string;
  studentName: string;
  examDate: Date;
  courses: ExamCourse[];
  venue: string;
  status: "draft" | "printed" | "distributed";
}

type ExamCardProcessingPageProps = Readonly<{
  courses: ExamCourse[];
}>;

const emptyForm = {
  courseIds: [] as string[],
  examDate: "",
  studentId: "",
  studentName: "",
  venue: "",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCourseDepartment(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createExamCardHtml(card: ExamCard) {
  const courseRows = card.courses
    .map(
      (course) => `
        <tr>
          <td>${escapeHtml(course.id)}</td>
          <td>${escapeHtml(course.name)}</td>
          <td>${escapeHtml(formatCourseDepartment(course.department))}</td>
          <td>${escapeHtml(course.level)}</td>
          <td>${escapeHtml(course.intake)}</td>
          <td>${escapeHtml(
            course.terms
              .flatMap((term) =>
                term.units.length
                  ? term.units.map((unit) => `${unit.code} ${unit.name}`)
                  : [term.name],
              )
              .join(", "),
          )}</td>
        </tr>
      `,
    )
    .join("");

  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Exam Card - ${escapeHtml(card.studentName)}</title>
        <style>
          body { color: #111827; font-family: Arial, sans-serif; margin: 32px; }
          .card { border: 1px solid #d1d5db; border-radius: 8px; padding: 24px; max-width: 900px; }
          h1 { font-size: 24px; margin: 0; }
          .muted { color: #6b7280; font-size: 14px; }
          .grid { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 24px 0; }
          .label { color: #6b7280; font-size: 12px; text-transform: uppercase; }
          .value { font-size: 16px; font-weight: 700; margin-top: 4px; }
          table { border-collapse: collapse; margin-top: 16px; width: 100%; }
          th, td { border: 1px solid #d1d5db; font-size: 13px; padding: 10px; text-align: left; }
          th { background: #f9fafb; }
          .footer { display: flex; justify-content: space-between; margin-top: 40px; }
          .signature { border-top: 1px solid #111827; padding-top: 8px; width: 220px; }
          @media print { body { margin: 0; } .card { border: 0; max-width: none; } }
        </style>
      </head>
      <body>
        <main class="card">
          <p class="muted">IMTR Admin</p>
          <h1>Student Exam Card</h1>
          <section class="grid">
            <div><div class="label">Student</div><div class="value">${escapeHtml(card.studentName)}</div></div>
            <div><div class="label">Student ID</div><div class="value">${escapeHtml(card.studentId)}</div></div>
            <div><div class="label">Exam Date</div><div class="value">${card.examDate.toLocaleDateString()}</div></div>
            <div><div class="label">Venue</div><div class="value">${escapeHtml(card.venue)}</div></div>
          </section>
          <h2>Registered Course Details</h2>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Department</th>
                <th>Level</th>
                <th>Intake</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>${courseRows}</tbody>
          </table>
          <section class="footer">
            <div class="signature">Exams Officer</div>
            <div class="signature">Student Signature</div>
          </section>
        </main>
      </body>
    </html>`;
}

export function ExamCardProcessingPage({ courses }: ExamCardProcessingPageProps) {
  const [examCards, setExamCards] = useState<ExamCard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const activeCourses = useMemo(() => courses, [courses]);

  const selectedCourses = activeCourses.filter((course) =>
    formData.courseIds.includes(course.id),
  );

  const handleCourseSelection = (courseId: string, checked: boolean) => {
    setFormData((current) => ({
      ...current,
      courseIds: checked
        ? [...current.courseIds, courseId]
        : current.courseIds.filter((id) => id !== courseId),
    }));
  };

  const updateCardStatus = (cardId: string, status: ExamCard["status"]) => {
    setExamCards((cards) =>
      cards.map((card) => (card.id === cardId ? { ...card, status } : card)),
    );
  };

  const handleGenerate = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !formData.studentId ||
      !formData.studentName ||
      !formData.examDate ||
      !formData.venue ||
      selectedCourses.length === 0
    ) {
      return;
    }

    const examCard: ExamCard = {
      id: `EXAM-${Date.now()}`,
      studentId: formData.studentId,
      studentName: formData.studentName,
      examDate: new Date(formData.examDate),
      venue: formData.venue,
      status: "draft",
      courses: selectedCourses.map((course) => ({
        department: course.department,
        id: course.id,
        intake: course.intake,
        level: course.level,
        name: course.name,
        terms: course.terms,
      })),
    };

    setExamCards((cards) => [examCard, ...cards]);
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handlePrint = (card: ExamCard) => {
    const printWindow = window.open("", "_blank", "width=960,height=720");

    if (!printWindow) return;

    printWindow.document.write(createExamCardHtml(card));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    updateCardStatus(card.id, "printed");
  };

  const handleDownload = (card: ExamCard) => {
    const html = createExamCardHtml(card);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${card.id}-${card.studentId}-exam-card.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const stats = {
    distributed: examCards.filter((card) => card.status === "distributed").length,
    printed: examCards.filter((card) => card.status === "printed").length,
    total: examCards.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Card Processing</h1>
          <p className="mt-1 text-gray-600">
            Generate exam cards using course details from Course Management
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Generate Exam Card
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Course Records</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{activeCourses.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total Cards</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Printed</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{stats.printed}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Distributed</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{stats.distributed}</p>
        </div>
      </div>

      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Generate Exam Card</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Student ID"
                value={formData.studentId}
                onChange={(event) =>
                  setFormData({ ...formData, studentId: event.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
              <input
                type="text"
                placeholder="Student Name"
                value={formData.studentName}
                onChange={(event) =>
                  setFormData({ ...formData, studentName: event.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
              <input
                type="date"
                value={formData.examDate}
                onChange={(event) =>
                  setFormData({ ...formData, examDate: event.target.value })
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
              <input
                type="text"
                placeholder="Exam Venue"
                value={formData.venue}
                onChange={(event) => setFormData({ ...formData, venue: event.target.value })}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Select Courses</label>
              {activeCourses.length > 0 ? (
                <div className="grid max-h-72 grid-cols-1 gap-3 overflow-y-auto rounded-md border border-gray-200 p-3 md:grid-cols-2">
                  {activeCourses.map((course) => (
                    <label
                      key={course.id}
                      className="flex items-start gap-3 rounded-md border border-gray-100 p-3 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.courseIds.includes(course.id)}
                        onChange={(event) =>
                          handleCourseSelection(course.id, event.target.checked)
                        }
                        className="mt-1 h-4 w-4"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-gray-900">
                          {course.id} - {course.name}
                        </span>
                        <span className="block text-xs text-gray-600">
                          {formatCourseDepartment(course.department)} | {course.level} | {course.intake}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-gray-300 p-6 text-sm text-gray-600">
                  No active courses are available yet. Add courses in course management first.
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={activeCourses.length === 0}
                className="rounded-md bg-green-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Generate
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Exam Date</th>
              <th className="px-4 py-3 text-left font-medium">Courses</th>
              <th className="px-4 py-3 text-left font-medium">Venue</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {examCards.length > 0 ? (
              examCards.map((card) => (
                <tr key={card.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="block font-medium">{card.studentName}</span>
                    <span className="text-xs text-gray-500">{card.studentId}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{card.examDate.toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    {card.courses.map((course) => course.id).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-sm">{card.venue}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        card.status === "distributed"
                          ? "bg-green-100 text-green-800"
                          : card.status === "printed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handlePrint(card)}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        Print
                      </button>
                      <button
                        onClick={() => handleDownload(card)}
                        className="font-medium text-gray-700 hover:text-gray-900"
                      >
                        Download
                      </button>
                      {card.status === "printed" && (
                        <button
                          onClick={() => updateCardStatus(card.id, "distributed")}
                          className="font-medium text-green-600 hover:text-green-800"
                        >
                          Distribute
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-gray-500" colSpan={6}>
                  No exam cards generated yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
