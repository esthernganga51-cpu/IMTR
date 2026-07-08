# TODO - Kenyan/International Admission Flow (SMIS2)

- [x] Update `app/admissions/enrollment/page.tsx` to use the existing `features/student-management/components/student-form.tsx` for end-to-end persistence (form -> server action -> in-memory DB).

- [ ] Update `app/admissions/enrollment/page.tsx` table display to include student type and identifier fields (National ID / Passport + Nationality) based on `studentType`.
- [ ] Ensure the admission/enrollment flow uses student-management CRUD actions: create/update and fetch students from the in-memory DB.
- [ ] Verify conditional fields match requirements: Kenyan shows nationalIdNumber required and hides passportNumber; International shows passportNumber + nationality required and hides nationalIdNumber.
- [ ] Run `npm run typecheck` and fix any missing imports/types.
- [ ] Run `npm run dev` and manually verify the UI behavior and data persistence.

