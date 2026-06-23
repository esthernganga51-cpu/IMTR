import type {
  CourseConfigurationFormValues,
  DynamicFormDefinition,
} from "@/features/academic-admin/types/academic";

export const courseConfigurationFormDefinition = {
  fields: [
    {
      inputType: "text",
      kind: "text",
      label: "Course name",
      name: "courseName",
      placeholder: "Advanced Meteorological Technician Course (AMTC) - WMO Class II (2 Years)",
      validation: {
        minLength: 4,
        requiredMessage: "Course name is required.",
      },
    },
    {
      kind: "select",
      label: "Level",
      name: "level",
      options: [
        { label: "WMO Class II", value: "WMO Class II" },
        { label: "Technician Foundation", value: "Technician Foundation" },
        { label: "Post-Graduate Simulation", value: "Post-Graduate Simulation" },
        { label: "Specialized Professional", value: "Specialized Professional" },
        { label: "Aviation Certificate", value: "Aviation Certificate" },
        { label: "Aviation Forecaster", value: "Aviation Forecaster" },
        { label: "Technical Short Course", value: "Technical Short Course" },
      ],
      validation: {
        requiredMessage: "Level is required.",
      },
    },
    {
      kind: "select",
      label: "Department",
      name: "department",
      options: [
        { label: "Meteorology", value: "Meteorology" },
        { label: "Aviation", value: "Aviation" },
        { label: "Agriculture", value: "Agriculture" },
        { label: "Environment", value: "Environment" },
      ],
      validation: {
        requiredMessage: "Department is required.",
      },
    },
    {
      inputType: "text",
      kind: "text",
      label: "Intake",
      name: "intake",
      placeholder: "January",
      validation: {
        minLength: 3,
        requiredMessage: "Intake is required.",
      },
    },
    {
      description: "Create nested terms and assign one or more units to each term.",
      fields: [
        {
          inputType: "text",
          kind: "text",
          label: "Term name",
          name: "name",
          placeholder: "Year 1 Term 1",
          validation: {
            minLength: 3,
            requiredMessage: "Term name is required.",
          },
        },
        {
          kind: "multiselect",
          label: "Units",
          minSelected: 1,
          name: "unitCodes",
          validation: {
            requiredMessage: "Select at least one unit.",
          },
        },
      ],
      itemLabel: "Term",
      kind: "array",
      label: "Course terms",
      minItems: 1,
      name: "terms",
      validation: {
        requiredMessage: "Add at least one term.",
      },
    },
  ],
  id: "course-configuration",
  title: "Course configuration",
} satisfies DynamicFormDefinition;

export const emptyCourseConfigurationValues: CourseConfigurationFormValues = {
  courseName: "Advanced Meteorological Technician Course (AMTC) - WMO Class II (2 Years)",
  department: "Meteorology",
  intake: "January",
  level: "WMO Class II",
  terms: [
    {
      name: "Year 1 Term 1",
      unitCodes: ["MET-601", "MET-602"],
    },
  ],
};