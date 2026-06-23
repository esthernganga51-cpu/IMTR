export type UnitOption = {
  code: string;
  credits: number;
  id: string;
  mandatory: boolean;
  name: string;
};

export type AcademicTerm = {
  id: string;
  name: string;
  units: UnitOption[];
};

export type CourseConfiguration = {
  courseName: string;
  createdAt: string;
  department: string;
  id: string;
  intake: string;
  level: string;
  terms: AcademicTerm[];
};

export type Cohort = {
  courseId: string;
  id: string;
  intake: string;
  name: string;
  studentCount: number;
};

export type BatchEnrollmentStatus = "completed" | "failed" | "processing" | "queued";

export type BatchEnrollmentJob = {
  completedAt: null | string;
  enrolledRows: number;
  id: string;
  message: string;
  status: BatchEnrollmentStatus;
  submittedAt: string;
  totalRows: number;
  transactionId: string;
};

export type AcademicAdminWorkspace = {
  cohorts: Cohort[];
  courses: CourseConfiguration[];
  recentEnrollmentJobs: BatchEnrollmentJob[];
  units: UnitOption[];
};

export type CourseTermFormValues = {
  name: string;
  unitCodes: string[];
};

export type CourseConfigurationFormValues = {
  courseName: string;
  department: string;
  intake: string;
  level: string;
  terms: CourseTermFormValues[];
};

export type BatchEnrollmentFormValues = {
  cohortId: string;
  courseId: string;
  idempotencyKey: string;
  termId: string;
  unitCodes: string[];
};

export type CourseConfigurationActionResult = {
  course?: CourseConfiguration;
  error?: string;
  message: string;
  success: boolean;
};

export type BatchEnrollmentActionResult = {
  error?: string;
  job?: BatchEnrollmentJob;
  message: string;
  success: boolean;
};

export type DynamicValidationRule = {
  minLength?: number;
  requiredMessage: string;
};

export type DynamicFieldOption = {
  label: string;
  value: string;
};

export type TextFieldDefinition = {
  inputType: "text";
  kind: "text";
  label: string;
  name: string;
  placeholder: string;
  validation: DynamicValidationRule;
};

export type SelectFieldDefinition = {
  kind: "select";
  label: string;
  name: string;
  options: DynamicFieldOption[];
  validation: DynamicValidationRule;
};

export type MultiSelectFieldDefinition = {
  kind: "multiselect";
  label: string;
  minSelected: number;
  name: string;
  validation: DynamicValidationRule;
};

export type ArrayFieldDefinition = {
  description: string;
  fields: DynamicFieldDefinition[];
  itemLabel: string;
  kind: "array";
  label: string;
  minItems: number;
  name: string;
  validation: DynamicValidationRule;
};

export type DynamicFieldDefinition =
  | ArrayFieldDefinition
  | MultiSelectFieldDefinition
  | SelectFieldDefinition
  | TextFieldDefinition;

export type DynamicFormDefinition = {
  fields: DynamicFieldDefinition[];
  id: string;
  title: string;
};
