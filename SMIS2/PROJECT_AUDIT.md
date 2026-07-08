# Project Audit

## Critical Issues (breaks functionality)
- [ ] Missing Prisma schema and database persistence — project uses in-memory db only via features/lib/db/init.ts — no schema.prisma found.
- [ ] Input validation is effectively missing end-to-end — server actions accept raw formData types and never call Zod validation.
- [ ] Authorization is likely absent on all protected modules — no auth/role checks found in inspected routes and components.
- [ ] CRUD is not guaranteed for multiple modules — database layer in features/lib/db/init.ts only has students/staff/departments/courses/enrollments/hostel/clearances but not fees/exam cards/complaints/roles/schools/support/admissions.

## Missing Modules/Features
- [ ] Fees — no fees data model, mutations, or CRUD endpoints found — likely missing full implementation.
- [ ] Exam Cards — no exam card record/mutations found — likely missing full implementation.
- [ ] Complaints — no complaints data model/mutations found — likely missing full implementation.
- [ ] Schools — likely no full CRUD data layer found — only UI page present.
- [ ] Roles — likely no roles CRUD data layer found — only UI page present.
- [ ] Support Tickets — likely no support CRUD data layer found — only UI page present.
- [ ] Admissions (Enrollment/Clearance/Hostel flows) — partial UI exists but no admissions CRUD model found in database init.

## Incomplete CRUD
- [ ] Students — Read/Create/Update/Delete exist but database is in-memory and resets on restart — features/student-management uses db/init.ts arrays.
- [ ] Staff — Read/Create/Update/Delete exist but database is in-memory and resets on restart — features/staff-management uses db/init.ts arrays.
- [ ] Departments — CRUD likely exists only at in-memory layer but UI/data actions not fully verified — features/lib/db/init.ts has department CRUD primitives.
- [ ] Courses — CRUD primitives exist for courses but UI CRUD depends on course- management module which is not fully audited.
- [ ] Enrollments — only some operations exist in db/init.ts (no dedicated UI CRUD audited).
- [ ] Hostel — booking/room operations exist in db/init.ts but module CRUD and validation not fully verified.
- [ ] Student Clearance — only clearance summary/update exists in db/init.ts and mutations were not fully audited.

## TypeScript/Code Quality Issues
- [ ] Student page has hardcoded department list instead of pulling departments — SMIS2/app/students/page.tsx.
- [ ] features/lib/db/init.ts has inconsistent type imports and broad recordTypes constants that don’t map to implemented storage.
- [ ] course- management types include enums/constants with spelling mismatch (CourseDepartment.METEOROLOGY) which may cause inconsistent naming across UI.

## Missing Validation/Error Handling
- [ ] Student/Staff actions do not use Zod validation before calling db layer — student-mutations.ts and staff-mutations.ts.
- [ ] UI handlers rely on confirm() and setTimeout-based toasts without structured error mapping — e.g., app/students/page.tsx.

## Environment/Config Issues
- [ ] No .env.example present in repo root listing — environment variable usage cannot be verified.
- [ ] Next config is empty and does not enforce env checks — next.config.ts.

