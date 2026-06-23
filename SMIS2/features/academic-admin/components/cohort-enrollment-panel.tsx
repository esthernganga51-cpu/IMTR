"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatabaseZap, SendHorizonal } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/features/admin-dashboard/components/ui/button";
import { queueCohortUnitEnrollment } from "@/features/academic-admin/actions/course-mutations";
import { batchEnrollmentSchema } from "@/features/academic-admin/lib/schemas";
import type {
  BatchEnrollmentFormValues,
  BatchEnrollmentJob,
  Cohort,
  CourseConfiguration,
  UnitOption,
} from "@/features/academic-admin/types/academic";

type CohortEnrollmentPanelProps = Readonly<{
  cohorts: Cohort[];
  courses: CourseConfiguration[];
  recentJobs: BatchEnrollmentJob[];
  units: UnitOption[];
}>;

export function CohortEnrollmentPanel({
  cohorts,
  courses,
  recentJobs,
  units,
}: CohortEnrollmentPanelProps) {
  const [jobs, setJobs] = useState(recentJobs);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<BatchEnrollmentFormValues>({
    defaultValues: {
      cohortId: cohorts.at(0)?.id ?? "",
      courseId: courses.at(0)?.id ?? "",
      idempotencyKey: crypto.randomUUID(),
      termId: courses.at(0)?.terms.at(0)?.id ?? "",
      unitCodes: courses.at(0)?.terms.at(0)?.units.map((unit) => unit.code) ?? [],
    },
    resolver: zodResolver(batchEnrollmentSchema),
  });

  const selectedCourseId = useWatch({ control: form.control, name: "courseId" });
  const selectedTermId = useWatch({ control: form.control, name: "termId" });
  const selectedCohortId = useWatch({ control: form.control, name: "cohortId" });
  const selectedUnitCodes = useWatch({ control: form.control, name: "unitCodes" });

  const selectedCourse = courses.find((course) => course.id === selectedCourseId) ?? courses.at(0);
  const selectedTerm =
    selectedCourse?.terms.find((term) => term.id === selectedTermId) ??
    selectedCourse?.terms.at(0);
  const selectedCohort = cohorts.find((cohort) => cohort.id === selectedCohortId);
  const availableTermUnits = selectedTerm?.units ?? [];
  const rowsQueued = (selectedCohort?.studentCount ?? 0) * selectedUnitCodes.length;

  const unitLookup = useMemo(
    () => new Map(units.map((unit) => [unit.code, unit])),
    [units],
  );

  function syncCourseTerms(courseId: string) {
    const nextCourse = courses.find((course) => course.id === courseId);
    const nextTerm = nextCourse?.terms.at(0);

    form.setValue("courseId", courseId, { shouldValidate: true });
    form.setValue("termId", nextTerm?.id ?? "", { shouldValidate: true });
    form.setValue("unitCodes", nextTerm?.units.map((unit) => unit.code) ?? [], {
      shouldValidate: true,
    });
  }

  function syncTermUnits(termId: string) {
    const nextTerm = selectedCourse?.terms.find((term) => term.id === termId);

    form.setValue("termId", termId, { shouldValidate: true });
    form.setValue("unitCodes", nextTerm?.units.map((unit) => unit.code) ?? [], {
      shouldValidate: true,
    });
  }

  function onSubmit(values: BatchEnrollmentFormValues) {
    const optimisticJob: BatchEnrollmentJob = {
      completedAt: null,
      enrolledRows: 0,
      id: `optimistic-${values.idempotencyKey}`,
      message: "Transaction accepted by the workspace.",
      status: "queued",
      submittedAt: new Date().toISOString(),
      totalRows: rowsQueued,
      transactionId: `TX-${values.idempotencyKey.slice(0, 8).toUpperCase()}`,
    };

    setJobs((current) => [optimisticJob, ...current].slice(0, 5));
    setMessage("Enrollment transaction queued.");

    startTransition(() => {
      void queueCohortUnitEnrollment(values).then((result) => {
        if (!result.success || !result.job) {
          setMessage(result.error ?? result.message);
          setJobs((current) => current.filter((job) => job.id !== optimisticJob.id));
          return;
        }

        const confirmedJob = result.job;

        if (!confirmedJob) {
          setMessage("Enrollment transaction did not return a job.");
          setJobs((current) => current.filter((job) => job.id !== optimisticJob.id));
          return;
        }

        setJobs((current) =>
          [confirmedJob, ...current.filter((job) => job.id !== optimisticJob.id)].slice(0, 5),
        );
        setMessage(result.message);
        form.setValue("idempotencyKey", crypto.randomUUID());
      });
    });
  }

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <DatabaseZap className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cohort enrollment</p>
            <h2 className="text-xl font-semibold tracking-normal text-card-foreground">
              Mandatory unit batch
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SummaryStat label="Students" value={selectedCohort?.studentCount ?? 0} />
          <SummaryStat label="Units" value={selectedUnitCodes.length} />
          <SummaryStat label="Rows" value={rowsQueued} />
        </div>
      </div>

      <form className="mt-6 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Course</span>
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={selectedCourseId}
              onChange={(event) => syncCourseTerms(event.target.value)}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Term</span>
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={selectedTermId}
              onChange={(event) => syncTermUnits(event.target.value)}
            >
              {selectedCourse?.terms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Cohort</span>
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...form.register("cohortId")}
            >
              {cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.name} ({cohort.studentCount})
                </option>
              ))}
            </select>
          </label>

          <input type="hidden" {...form.register("idempotencyKey")} />
          <input type="hidden" {...form.register("courseId")} />
          <input type="hidden" {...form.register("termId")} />
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">Mandatory units</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {availableTermUnits.map((unit) => {
              const unitMeta = unitLookup.get(unit.code);

              return (
                <label
                  key={unit.code}
                  className="flex min-h-20 items-start gap-3 rounded-md border bg-background/70 p-3 text-sm shadow-sm"
                >
                  <input
                    className="mt-1 size-4 accent-primary"
                    type="checkbox"
                    value={unit.code}
                    {...form.register("unitCodes")}
                  />
                  <span>
                    <span className="block font-semibold text-foreground">{unit.code}</span>
                    <span className="block text-muted-foreground">
                      {unitMeta?.name ?? unit.name}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {form.formState.errors.unitCodes?.message ? (
            <p className="mt-2 text-sm text-destructive">
              {form.formState.errors.unitCodes.message}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {message}
            </p>
            <Button type="submit" disabled={isPending || rowsQueued === 0}>
              <SendHorizonal className="size-4" aria-hidden="true" />
              Queue batch
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6 border-t pt-5">
        <p className="text-sm font-medium text-foreground">Recent transactions</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {jobs.map((job) => (
            <article key={job.id} className="rounded-md border bg-background/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-foreground">{job.transactionId}</p>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                  {job.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{job.message}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.round((job.enrolledRows / Math.max(job.totalRows, 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {job.enrolledRows.toLocaleString()} / {job.totalRows.toLocaleString()} rows
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryStat({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-md border bg-background/70 px-3 py-2">
      <p className="text-lg font-semibold text-foreground">{value.toLocaleString()}</p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
