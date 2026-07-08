# Library Module (SMIS2) - Implementation Checklist

## Plan summary
Implement a full Library Management module end-to-end (dashboard, books CRUD, authors/publishers/categories, borrow/return, reservations, inventory copy availability, fines, reports, search, book details, borrowing workflows for students + staff) and fully wire it into the existing SMIS2 app (routes, components, tables, forms, dialogs, repository/actions, RBAC gating, navigation).

## Steps
- [ ] Create/replace `features/library-management` feature with full implementation (types/schemas, repository, actions, components, routes/pages)
- [ ] Wire `app/library` dashboard to feature components (with proper RBAC)
- [ ] Implement Books: list/table, add/edit/delete, details, availability, copy-level status
- [ ] Implement Categories, Authors, Publishers: CRUD pages/components/forms/tables
- [ ] Implement Borrowing for student + staff (transaction creation, copy availability updates, due dates)
- [ ] Implement Returns (transaction closure, copy status back to available, fine generation if overdue)
- [ ] Implement Overdue books view + fine listing/pay/waive flows
- [ ] Implement Reports (at least summary + CSV export)
- [ ] Implement Search (global within library module)
- [ ] Validation: Zod schemas + safe server mutations/actions with consistent error handling
- [ ] Update sidebar navigation navigation.ts to include library routes
- [ ] Add missing permission gates (ensure permission strings used match RBAC scaffolding)
- [ ] Run lint + build

