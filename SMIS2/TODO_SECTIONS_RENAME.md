# TODO: Rename "departments" → "sections" (and clearance too)

## Goal
Rename all code/UI/data references so that IMTR is called a **section**, not a department.

## Scope
- `features/lib/db/init.ts`:
  - `DepartmentRecord` → `SectionRecord`
  - `database.departments` → `database.sections`
  - CRUD methods `getAllDepartments`/`insertDepartment`/etc → `getAllSections`/`insertSection`/etc
  - `DepartmentClearanceRecord` → `SectionClearanceRecord`
  - `departmentClearances` → `sectionClearances`
  - Also update student record field `department` -> `section` if the app treats it as the IMTR identifier.
- Feature/UI layer:
  - Pages/labels/routes that display “Departments” → “Sections”
  - Clearance UI text “department clearance” → “section clearance”

## Step order
1. Update `features/lib/db/init.ts`.
2. Update any feature data access modules that call db.department*.
3. Update any UI/page components that reference the terminology.
4. Typecheck: `npm run typecheck`.
5. Run dev server: `npm run dev` and verify sections page works.

