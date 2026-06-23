import { BookOpenCheck, GraduationCap, Layers3, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CohortEnrollmentPanel } from "@/features/academic-admin/components/cohort-enrollment-panel";
import { CourseConfigurationForm } from "@/features/academic-admin/components/course-configuration-form";
import type { AcademicAdminWorkspace } from "@/features/academic-admin/types/academic";

type AcademicAdminPageProps = Readonly<{
  workspace: AcademicAdminWorkspace;
}>;

export function AcademicAdminPage({ workspace }: AcademicAdminPageProps) {
  const totalConfiguredTerms = workspace.courses.reduce(
    (count, course) => count + course.terms.length,
    0,
  );
  const stats: Array<{ icon: LucideIcon; label: string; value: number }> = [
    {
      icon: BookOpenCheck,
      label: "Courses",
      value: workspace.courses.length,
    },
    {
      icon: Layers3,
      label: "Configured terms",
      value: totalConfiguredTerms,
    },
    {
      icon: UsersRound,
      label: "Active cohorts",
      value: workspace.cohorts.length,
    },
  ];

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Academic administration</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal text-foreground">
            Course and unit configuration
          </h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-md border bg-card px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-foreground">{value}</p>
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1.12fr_0.88fr]">
        <CourseConfigurationForm
          existingCourses={workspace.courses}
          units={workspace.units}
        />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Configured catalogue</p>
              <h2 className="text-xl font-semibold tracking-normal text-foreground">
                Current academic map
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {workspace.courses.map((course) => (
              <article key={course.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{course.courseName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.level} • {course.department} • {course.intake}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {course.terms.length} terms
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {course.terms.map((term) => (
                    <div key={term.id} className="rounded-md bg-muted/60 p-3">
                      <p className="text-sm font-medium text-foreground">{term.name}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {term.units.map((unit) => (
                          <span
                            key={unit.code}
                            className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border"
                          >
                            {unit.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CohortEnrollmentPanel
        cohorts={workspace.cohorts}
        courses={workspace.courses}
        recentJobs={workspace.recentEnrollmentJobs}
        units={workspace.units}
      />
    </div>
  );
}
