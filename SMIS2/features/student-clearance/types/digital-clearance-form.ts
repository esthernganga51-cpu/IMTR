/**
 * IMTR Student Digital Clearance Form (based on the physical clearance form)
 *
 * This file contains explicit TypeScript models for each logical block of the form,
 * plus a top-level request payload model for API submission.
 */

// -----------------------------
// Shared / common primitives
// -----------------------------

export type FullNameSurname = string;
export type FullNameMiddleName = string;
export type FullNameOtherNames = string;

export type SignaturePathOrUrl = string;

// -----------------------------
// Student personal metadata
// -----------------------------

export interface StudentFullName {
  surname: FullNameSurname;
  middleName: FullNameMiddleName;
  otherNames: FullNameOtherNames;
}

export interface StudentPersonalMetadata {
  fullName: StudentFullName;
  clearanceApplicationDate: Date;
  nationality: string;
  idOrPassportNumber: string;
  nameOfCourseAttended: string;
}

// -----------------------------
// Sponsor information
// -----------------------------

export interface SponsorInformation {
  sponsoringAuthority: string;
  sponsoringAuthorityAddress: string;
  studentHomeAddress: string;
}

// -----------------------------
// Hostel clearance
// -----------------------------

export type HostelClearanceStatus = "pending" | "cleared" | "not_cleared";

export interface HostelClearance {
  status: HostelClearanceStatus;
  managerName: string;
  managerSignature: SignaturePathOrUrl;
  clearanceDate: Date;
}

// -----------------------------
// Library clearance
// -----------------------------

export type LibraryClearanceStatus = "pending" | "cleared" | "not_cleared";

export interface LibraryClearance {
  status: LibraryClearanceStatus;
  librarianName: string;
  librarianSignature: SignaturePathOrUrl;
  clearanceDate: Date;
}

// -----------------------------
// Course leader clearance
// -----------------------------

export type CourseLeaderClearanceStatus = "pending" | "cleared" | "not_cleared";

export interface CourseLeaderClearance {
  status: CourseLeaderClearanceStatus;
  courseName: string;
  courseLeaderName: string;
  courseLeaderSignature: SignaturePathOrUrl;
  clearanceDate: Date;
}

// -----------------------------
// Student welfare officer (SWO)
// -----------------------------

export type StudentWelfareOfficerClearanceStatus = "pending" | "cleared" | "not_cleared";

export interface StudentWelfareOfficerClearance {
  status: StudentWelfareOfficerClearanceStatus;
  swoName: string;
  feesBalance: number;
  swoSignature: SignaturePathOrUrl;
  clearanceDate: Date;
}

// -----------------------------
// Final declaration block
// -----------------------------

export const FINAL_DECLARATION_TEXT =
  "I declare that I do not owe anything to I.M.T.R and I've cleared with all the relevant sections." as const;

export interface FinalDeclaration {
  declarationText: typeof FINAL_DECLARATION_TEXT;
  name: string;
  studentSignature: SignaturePathOrUrl;
  declarationDate: Date;
}

// -----------------------------
// Top-level payload model
// -----------------------------

export interface DigitalClearanceForm {
  studentPersonalMetadata: StudentPersonalMetadata;
  sponsorInformation: SponsorInformation;
  hostelClearance: HostelClearance;
  libraryClearance: LibraryClearance;
  courseLeaderClearance: CourseLeaderClearance;
  studentWelfareOfficerClearance: StudentWelfareOfficerClearance;
  finalDeclaration: FinalDeclaration;
}

