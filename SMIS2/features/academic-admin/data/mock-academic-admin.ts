import { randomUUID } from "node:crypto";

import type {
  AcademicAdminWorkspace,
  BatchEnrollmentFormValues,
  BatchEnrollmentJob,
  Cohort,
  CourseConfiguration,
  CourseConfigurationFormValues,
  UnitOption,
} from "@/features/academic-admin/types/academic";

const ENROLLMENT_CHUNK_SIZE = 75;

// Complete specialized Unit Catalogue matching all WMO, Aviation, and Agrometeorology domains
const unitCatalogue: UnitOption[] = [
  {
    code: "MET-601",
    credits: 6,
    id: "unit-met-601",
    mandatory: true,
    name: "General Meteorology & Weather Observations",
  },
  {
    code: "MET-602",
    credits: 6,
    id: "unit-met-602",
    mandatory: true,
    name: "Meteorological Instruments and Observational Methods",
  },
  {
    code: "MET-603",
    credits: 6,
    id: "unit-met-603",
    mandatory: true,
    name: "Synoptic Meteorology & Climatology",
  },
  {
    code: "MET-604",
    credits: 6,
    id: "unit-met-604",
    mandatory: true,
    name: "Operational Weather Forecasting & Simulation",
  },
  {
    code: "AVM-611",
    credits: 4,
    id: "unit-avm-611",
    mandatory: true,
    name: "Aeronautical Meteorological Codes & Telecommunications",
  },
  {
    code: "AVM-612",
    credits: 4,
    id: "unit-avm-612",
    mandatory: true,
    name: "Aviation Weather Hazards & Briefing Operations",
  },
  {
    code: "AGM-621",
    credits: 4,
    id: "unit-agm-621",
    mandatory: true,
    name: "Applied Agricultural Meteorology & Microclimates",
  },
  {
    code: "GIS-631",
    credits: 4,
    id: "unit-gis-631",
    mandatory: true,
    name: "GIS & Satellite Remote Sensing Applications",
  },
];

// Seed Courses completely updated to match all 8 specialized modules from your course registry
const seedCourses: CourseConfiguration[] = [
  {
    courseName: "Advanced Meteorological Technician Course (AMTC) - WMO Class II (2 Years)",
    createdAt: "2026-05-30T00:00:00.000Z",
    department: "Meteorology",
    id: "AMTC-2Y",
    intake: "January",
    level: "WMO Class II",
    terms: [
      {
        id: "term-amtc2y-t1",
        name: "Year 1 Term 1",
        units: [unitCatalogue[0], unitCatalogue[1]],
      },
      {
        id: "term-amtc2y-t2",
        name: "Year 1 Term 2",
        units: [unitCatalogue[2], unitCatalogue[7]],
      },
      {
        id: "term-amtc2y-t3",
        name: "Year 2 Term 1",
        units: [unitCatalogue[3], unitCatalogue[6]],
      },
    ],
  },
  {
    courseName: "Advanced Meteorological Technician Course (AMTC) - WMO Class II (1 Year)",
    createdAt: "2026-05-30T00:00:00.000Z",
    department: "Meteorology",
    id: "AMTC-1Y",
    intake: "January",
    level: "WMO Class II",
    terms: [
      {
        id: "term-amtc1y-t1",
        name: "Accelerated Term 1",
        units: [unitCatalogue[0], unitCatalogue[1], unitCatalogue[2]],
      },
      {
        id: "term-amtc1y-t2",
        name: "Accelerated Term 2",
        units: [unitCatalogue[3], unitCatalogue[6], unitCatalogue[7]],
      },
    ],
  },
  {
    courseName: "Middle Meteorological Technician Course (MMTC)",
    createdAt: "2026-05-30T00:00:00.000Z",
    department: "Meteorology",
    id: "MMTC",
    intake: "June",
    level: "Technician Foundation",
    terms: [
      {
        id: "term-mmtc-t1",
        name: "Term 1",
        units: [unitCatalogue[0], unitCatalogue[1]],
      },
      {
        id: "term-mmtc-t2",
        name: "Term 2",
        units: [unitCatalogue[2]],
      },
    ],
  },
  {
    courseName: "Operational Training Course (OTC)",
    createdAt: "2026-05-30T00:00:00.000Z",
    department: "Meteorology",
    id: "OTC",
    intake: "January",
    level: "Post-Graduate Simulation",
    terms: [
      {
        id: "term-otc-t1",
        name: "Operational Semester",
        units: [unitCatalogue[3], unitCatalogue[7]],
      },
    ],
  },
  {
    courseName: "Applied Agricultural Meteorology",
    createdAt: "2026-05-30T00:00:00.000Z",
    department: "Agriculture",
    id: "AAM",
    intake: "June",
    level: "Specialized Professional",
    terms: [
      {
        id: "term-aam-t1",
        name: "Agrometeorology Core",
        units: [unitCatalogue[0], unitCatalogue[6]],
      },
    ],
  },
  {
    courseName: "Specialized Aeronautical Meteorological Observations Course",
    createdAt: "2026-05-30T00:00:00.000Z",
    department: "Aviation",
    id: "SAMOC",
    intake: "September",
    level: "Aviation Certificate",
    terms: [
      {
        id: "term-samoc-t1",
        name: "Aeronautical Observation Module",
        units: [unitCatalogue[1], unitCatalogue[4]],
      },
    ],
  },
  {
    courseName: "Specialized Aeronautical Meteorological Forecasters Course",
    createdAt: "2026-05-30T00:00:00.000Z",
    department: "Aviation",
    id: "SAMFC",
    intake: "September",
    level: "Aviation Forecaster",
    terms: [
      {
        id: "term-samfc-t1",
        name: "Aeronautical Forecasting Module",
        units: [unitCatalogue[3], unitCatalogue[5]],
      },
    ],
  },
  {
    courseName: "GIS & Remote Sensing",
    createdAt: "2026-05-30T00:00:00.000Z",
    department: "Environment",
    id: "GISRS",
    intake: "May",
    level: "Technical Short Course",
    terms: [
      {
        id: "term-gisrs-t1",
        name: "Spatial Analytics Core",
        units: [unitCatalogue[7]],
      },
    ],
  },
];

// Seed cohorts mapped exactly to your institutional course boundaries and capacities
const seedCohorts: Cohort[] = [
  {
    courseId: "AMTC-2Y",
    id: "cohort-amtc2y-2026",
    intake: "January 2026",
    name: "AMTC 2-Year (2026 Intake)",
    studentCount: 30, // Max classroom capacity
  },
  {
    courseId: "MMTC",
    id: "cohort-mmtc-2026",
    intake: "June 2026",
    name: "MMTC Foundation (2026 Intake)",
    studentCount: 40,
  },
  {
    courseId: "SAMOC",
    id: "cohort-samoc-2026",
    intake: "September 2026",
    name: "Aviation Observers Sept 2026",
    studentCount: 25,
  },
];

type AcademicAdminState = {
  courses: CourseConfiguration[];
  enrollmentJobs: BatchEnrollmentJob[];
};

const globalForAcademicAdmin = globalThis as typeof globalThis & {
  __smisAcademicAdminState?: AcademicAdminState;
};

function getState(): AcademicAdminState {
  globalForAcademicAdmin.__smisAcademicAdminState ??= {
    courses: seedCourses,
    enrollmentJobs: [],
  };

  return globalForAcademicAdmin.__smisAcademicAdminState;
}

export async function getAcademicAdminSnapshot(): Promise<AcademicAdminWorkspace> {
  const state = getState();

  return {
    cohorts: seedCohorts,
    courses: state.courses,
    recentEnrollmentJobs: state.enrollmentJobs.slice(0, 5),
    units: unitCatalogue,
  };
}

export async function saveCourseConfiguration(
  values: CourseConfigurationFormValues,
): Promise<CourseConfiguration> {
  const state = getState();
  const courseId = `course-${slugify(values.courseName)}-${randomUUID().slice(0, 8)}`;
  const course: CourseConfiguration = {
    courseName: values.courseName,
    createdAt: new Date().toISOString(),
    department: values.department,
    id: courseId,
    intake: values.intake,
    level: values.level,
    terms: values.terms.map((term) => ({
      id: `term-${slugify(term.name)}-${randomUUID().slice(0, 8)}`,
      name: term.name,
      units: resolveUnits(term.unitCodes),
    })),
  };

  state.courses = [course, ...state.courses];

  return course;
}

export async function enqueueCohortEnrollment(
  values: BatchEnrollmentFormValues,
): Promise<BatchEnrollmentJob> {
  const state = getState();
  const cohort = seedCohorts.find((item) => item.id === values.cohortId);

  if (!cohort) {
    throw new Error("Selected cohort does not exist.");
  }

  const transactionId = `TX-${values.idempotencyKey.slice(0, 8).toUpperCase()}`;
  const totalRows = cohort.studentCount * values.unitCodes.length;
  const job: BatchEnrollmentJob = {
    completedAt: null,
    enrolledRows: 0,
    id: randomUUID(),
    message: "Transaction queued for cohort enrollment.",
    status: "queued",
    submittedAt: new Date().toISOString(),
    totalRows,
    transactionId,
  };

  state.enrollmentJobs = [job, ...state.enrollmentJobs].slice(0, 10);

  setTimeout(() => {
    void processEnrollmentTransaction(job.id, values);
  }, 0);

  return job;
}

async function processEnrollmentTransaction(
  jobId: string,
  values: BatchEnrollmentFormValues,
) {
  const state = getState();
  const job = state.enrollmentJobs.find((item) => item.id === jobId);
  const cohort = seedCohorts.find((item) => item.id === values.cohortId);

  if (!job || !cohort) {
    return;
  }

  try {
    job.status = "processing";
    job.message = "Enrollment rows are being written in transactional chunks.";

    const transaction = beginEnrollmentTransaction(values.idempotencyKey);
    const studentIds = Array.from({ length: cohort.studentCount }, (_, index) =>
      `${cohort.id}-student-${index + 1}`,
    );
    const rows = studentIds.flatMap((studentId) =>
      values.unitCodes.map((unitCode) => ({
        studentId,
        termId: values.termId,
        transactionId: transaction.id,
        unitCode,
      })),
    );

    for (let index = 0; index < rows.length; index += ENROLLMENT_CHUNK_SIZE) {
      const chunk = rows.slice(index, index + ENROLLMENT_CHUNK_SIZE);

      await writeEnrollmentChunk(transaction.id, chunk);
      job.enrolledRows = Math.min(index + chunk.length, rows.length);
      await yieldToEventLoop();
    }

    commitEnrollmentTransaction(transaction.id);
    job.status = "completed";
    job.completedAt = new Date().toISOString();
    job.message = "Cohort mandatory units enrolled successfully.";
  } catch (error) {
    rollbackEnrollmentTransaction(values.idempotencyKey);
    job.status = "failed";
    job.message = error instanceof Error ? error.message : "Enrollment transaction failed.";
  }
}

function resolveUnits(unitCodes: string[]): UnitOption[] {
  const unitsByCode = new Map(unitCatalogue.map((unit) => [unit.code, unit]));

  return unitCodes.map((unitCode) => {
    const unit = unitsByCode.get(unitCode);

    if (!unit) {
      throw new Error(`Unit ${unitCode} does not exist.`);
    }

    return unit;
  });
}

function beginEnrollmentTransaction(idempotencyKey: string) {
  return {
    id: `txn-${idempotencyKey}`,
    openedAt: Date.now(),
  };
}

async function writeEnrollmentChunk(
  transactionId: string,
  rows: Array<{
    studentId: string;
    termId: string;
    transactionId: string;
    unitCode: string;
  }>,
) {
  void transactionId;
  void rows;
  await Promise.resolve();
}

function commitEnrollmentTransaction(transactionId: string) {
  void transactionId;
  return true;
}

function rollbackEnrollmentTransaction(idempotencyKey: string) {
  void idempotencyKey;
  return true;
}

function yieldToEventLoop() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

// Generates structural URL slugs safely out of input configurations
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}