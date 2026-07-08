import { z } from "zod";
import {
  FINAL_DECLARATION_TEXT,
  StudentPersonalMetadata,
  StudentFullName,
  SponsorInformation,
  HostelClearance,
  LibraryClearance,
  CourseLeaderClearance,
  StudentWelfareOfficerClearance,
  FinalDeclaration,
  DigitalClearanceForm,
  SignaturePathOrUrl,
} from "@/features/student-clearance/types/digital-clearance-form";

// -----------------------------
// Helpers
// -----------------------------

const requiredString = (fieldLabel: string) =>
  z
    .string()
    .min(1, { message: `${fieldLabel} is required` });

const dateFromUnknown = (fieldLabel: string) =>
  z.preprocess((value) => {
    if (value instanceof Date) return value;
    if (typeof value === "string" || typeof value === "number") {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return value;
  }, z.date().refine(
    (d) => d instanceof Date && !Number.isNaN(d.getTime()),
    { message: `${fieldLabel} must be a valid date` }
  ));


const signatureSchema = requiredString("Signature");

const clearanceStatusValues = ["pending", "cleared", "not_cleared"] as unknown as [
  "pending",
  "cleared",
  "not_cleared",
];


// -----------------------------
// Student personal metadata
// -----------------------------

export const studentFullNameSchema = z.object({
  surname: requiredString("Surname"),
  middleName: requiredString("Middle name"),
  otherNames: requiredString("Other names"),
});

export const studentPersonalMetadataSchema = z.object({
  fullName: studentFullNameSchema,
  clearanceApplicationDate: dateFromUnknown("Clearance application date"),
  nationality: requiredString("Nationality"),
  idOrPassportNumber: requiredString("ID/Passport number"),
  nameOfCourseAttended: requiredString("Name of course attended"),
});

// -----------------------------
// Sponsor information
// -----------------------------

export const sponsorInformationSchema = z.object({
  sponsoringAuthority: requiredString("Sponsoring authority"),
  sponsoringAuthorityAddress: requiredString("Address of sponsor"),
  studentHomeAddress: requiredString("Student home address"),
});

// -----------------------------
// Hostel clearance
// -----------------------------

export const hostelClearanceStatusSchema = z.enum(clearanceStatusValues).refine(
  (v) => typeof v === "string" && v.length > 0,
  { message: "Hostel clearance status is required" }
);



export const hostelClearanceSchema = z.object({
  status: hostelClearanceStatusSchema,
  managerName: requiredString("Manager's name"),
  managerSignature: signatureSchema,
  clearanceDate: dateFromUnknown("Hostel clearance date"),
});

// -----------------------------
// Library clearance
// -----------------------------

export const libraryClearanceStatusSchema = z.enum(clearanceStatusValues).refine(
  (v) => typeof v === "string" && v.length > 0,
  { message: "Library clearance status is required" }
);


export const libraryClearanceSchema = z.object({
  status: libraryClearanceStatusSchema,
  librarianName: requiredString("Librarian's name"),
  librarianSignature: signatureSchema,
  clearanceDate: dateFromUnknown("Library clearance date"),
});

// -----------------------------
// Course leader clearance
// -----------------------------

export const courseLeaderClearanceStatusSchema = z.enum(clearanceStatusValues).refine(
  (v) => typeof v === "string" && v.length > 0,
  { message: "Course leader clearance status is required" }
);


export const courseLeaderClearanceSchema = z.object({
  status: courseLeaderClearanceStatusSchema,
  courseName: requiredString("Course name"),
  courseLeaderName: requiredString("Course leader's name"),
  courseLeaderSignature: signatureSchema,
  clearanceDate: dateFromUnknown("Course leader clearance date"),
});

// -----------------------------
// Student welfare officer (SWO)
// -----------------------------

export const studentWelfareOfficerClearanceStatusSchema = z
  .string()
  .min(1, { message: "SWO clearance status is required" })
  .refine(
    (v): v is "pending" | "cleared" | "not_cleared" =>
      (v === "pending" || v === "cleared" || v === "not_cleared"),
    { message: "Invalid SWO clearance status" }
  );



export const studentWelfareOfficerClearanceSchema = z.object({
  status: studentWelfareOfficerClearanceStatusSchema,
  swoName: requiredString("SWO's name"),
  feesBalance: z
    .number()
    .refine((n) => Number.isFinite(n), { message: "Fees balance must be a valid number" }),
  swoSignature: signatureSchema,
  clearanceDate: dateFromUnknown("SWO clearance date"),
});

// -----------------------------
// Final declaration block
// -----------------------------

export const finalDeclarationSchema = z.object({
  declarationText: z
    .literal(FINAL_DECLARATION_TEXT)
    .refine((v) => v === FINAL_DECLARATION_TEXT, {
      message: "Declaration text must exactly match the required statement",
    }),
  name: requiredString("Name"),
  studentSignature: signatureSchema,
  declarationDate: dateFromUnknown("Declaration date"),
});

// -----------------------------
// Top-level form schema
// -----------------------------

export const digitalClearanceFormSchema = z.object({
  studentPersonalMetadata: studentPersonalMetadataSchema,
  sponsorInformation: sponsorInformationSchema,
  hostelClearance: hostelClearanceSchema,
  libraryClearance: libraryClearanceSchema,
  courseLeaderClearance: courseLeaderClearanceSchema,
  studentWelfareOfficerClearance: studentWelfareOfficerClearanceSchema,
  finalDeclaration: finalDeclarationSchema,
});

// -----------------------------
// Inferred types
// -----------------------------

export type StudentFullNameFromSchema = z.infer<typeof studentFullNameSchema>;
export type StudentPersonalMetadataFromSchema = z.infer<typeof studentPersonalMetadataSchema>;
export type SponsorInformationFromSchema = z.infer<typeof sponsorInformationSchema>;
export type HostelClearanceFromSchema = z.infer<typeof hostelClearanceSchema>;
export type LibraryClearanceFromSchema = z.infer<typeof libraryClearanceSchema>;
export type CourseLeaderClearanceFromSchema = z.infer<typeof courseLeaderClearanceSchema>;
export type StudentWelfareOfficerClearanceFromSchema = z.infer<typeof studentWelfareOfficerClearanceSchema>;
export type FinalDeclarationFromSchema = z.infer<typeof finalDeclarationSchema>;
export type DigitalClearanceFormFromSchema = z.infer<typeof digitalClearanceFormSchema>;

// -----------------------------
// API request schema (strict)
// -----------------------------

export const createDigitalClearanceRequestSchema = z
  .object({
    payload: digitalClearanceFormSchema,
  })
  .strict();



export type CreateDigitalClearanceRequestInput = z.infer<typeof createDigitalClearanceRequestSchema>;

// -----------------------------
// Type exports for sections (explicit)
// -----------------------------

export type {
  SignaturePathOrUrl,
  StudentPersonalMetadata,
  StudentFullName,
  SponsorInformation,
  HostelClearance,
  LibraryClearance,
  CourseLeaderClearance,
  StudentWelfareOfficerClearance,
  FinalDeclaration,
  DigitalClearanceForm,
};


