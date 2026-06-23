"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import type { FieldErrors, Path, SubmitHandler, UseFormRegister } from "react-hook-form";

import { Button } from "@/features/admin-dashboard/components/ui/button";
import { createCourseConfiguration } from "@/features/academic-admin/actions/course-mutations";
import {
  courseConfigurationFormDefinition,
  emptyCourseConfigurationValues,
} from "@/features/academic-admin/lib/form-definition";
import { courseConfigurationSchema } from "@/features/academic-admin/lib/schemas";
import type {
  CourseConfiguration,
  CourseConfigurationFormValues,
  DynamicFieldDefinition,
  UnitOption,
} from "@/features/academic-admin/types/academic";

type CourseConfigurationFormProps = Readonly<{
  existingCourses: CourseConfiguration[];
  units: UnitOption[];
}>;

export function CourseConfigurationForm({
  existingCourses,
  units,
}: CourseConfigurationFormProps) {
  const [configuredCourses, setConfiguredCourses] = useState(existingCourses);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseConfigurationFormValues>({
    defaultValues: emptyCourseConfigurationValues,
    resolver: zodResolver(courseConfigurationSchema),
  });

  const termField = courseConfigurationFormDefinition.fields.find(
    (field) => field.kind === "array" && field.name === "terms",
  );
  const baseFields = courseConfigurationFormDefinition.fields.filter(
    (field) => field.kind !== "array",
  );

  const terms = useFieldArray({
    control: form.control,
    name: "terms",
  });

  const onSubmit: SubmitHandler<CourseConfigurationFormValues> = (values) => {
    setMessage("");

    startTransition(() => {
      void createCourseConfiguration(values).then((result) => {
        setMessage(result.error ?? result.message);

        const createdCourse = result.course;

        if (result.success && createdCourse) {
          setConfiguredCourses((current) => [createdCourse, ...current]);
          form.reset(emptyCourseConfigurationValues);
          router.refresh();
        }
      });
    });
  };

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Dynamic form engine</p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-card-foreground">
          Configure course structure
        </h2>
      </div>

      <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          {baseFields.map((field) => (
            <DynamicField
              key={field.name}
              errors={form.formState.errors}
              field={field}
              register={form.register}
            />
          ))}
        </div>

        {termField?.kind === "array" ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{termField.label}</p>
                <p className="text-sm text-muted-foreground">{termField.description}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => terms.append({ name: "Term 2 2026", unitCodes: [] })}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add term
              </Button>
            </div>

            <div className="space-y-4">
              {terms.fields.map((term, index) => (
                <article key={term.id} className="rounded-md border bg-background/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <label className="grid flex-1 gap-2">
                      <span className="text-sm font-medium text-foreground">Term name</span>
                      <input
                        className="h-10 rounded-md border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Term 2 2026"
                        {...form.register(`terms.${index}.name`)}
                      />
                      {form.formState.errors.terms?.[index]?.name?.message ? (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.terms[index]?.name?.message}
                        </p>
                      ) : null}
                    </label>

                    {terms.fields.length > 1 ? (
                      <Button
                        aria-label="Remove term"
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => terms.remove(index)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-foreground">Units</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {units.map((unit) => (
                        <label
                          key={unit.code}
                          className="flex min-h-20 items-start gap-3 rounded-md border bg-card p-3 text-sm shadow-sm"
                        >
                          <input
                            className="mt-1 size-4 accent-primary"
                            type="checkbox"
                            value={unit.code}
                            {...form.register(`terms.${index}.unitCodes`)}
                          />
                          <span>
                            <span className="block font-semibold text-foreground">
                              {unit.code}
                            </span>
                            <span className="block text-muted-foreground">{unit.name}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    {form.formState.errors.terms?.[index]?.unitCodes?.message ? (
                      <p className="mt-2 text-sm text-destructive">
                        {form.formState.errors.terms[index]?.unitCodes?.message}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {message || `${configuredCourses.length} course configurations available`}
          </p>
          <Button type="submit" disabled={isPending}>
            <Save className="size-4" aria-hidden="true" />
            Save course
          </Button>
        </div>
      </form>
    </section>
  );
}

type DynamicFieldProps = Readonly<{
  errors: FieldErrors<CourseConfigurationFormValues>;
  field: DynamicFieldDefinition;
  register: UseFormRegister<CourseConfigurationFormValues>;
}>;

function DynamicField({ errors, field, register }: DynamicFieldProps) {
  if (field.kind === "select") {
    return (
      <label className="grid gap-2">
        <span className="text-sm font-medium text-foreground">{field.label}</span>
        <select
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register(field.name as Path<CourseConfigurationFormValues>)}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldErrorMessage errors={errors} name={field.name} />
      </label>
    );
  }

  if (field.kind === "text") {
    return (
      <label className="grid gap-2">
        <span className="text-sm font-medium text-foreground">{field.label}</span>
        <input
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder={field.placeholder}
          type={field.inputType}
          {...register(field.name as Path<CourseConfigurationFormValues>)}
        />
        <FieldErrorMessage errors={errors} name={field.name} />
      </label>
    );
  }

  return null;
}

function FieldErrorMessage({
  errors,
  name,
}: Readonly<{
  errors: FieldErrors<CourseConfigurationFormValues>;
  name: string;
}>) {
  const error = errors[name as keyof CourseConfigurationFormValues];

  if (!error || !("message" in error) || typeof error.message !== "string") {
    return null;
  }

  return <p className="text-sm text-destructive">{error.message}</p>;
}
