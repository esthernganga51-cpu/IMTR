Library Management module (SMIS2)

This module provides a library dashboard and end-to-end workflows (books CRUD, inventory copies, borrowing/returning for students and staff, reservations, fines, overdue views, reporting, and search).

Architecture:
- Uses the project in-memory DB/init layer under `features/lib/db/init.ts`.
- Mutations/queries are implemented as Next.js server actions in `features/library-management/actions/*`.
- Validation uses Zod schemas in `features/library-management/lib/schemas.ts`.
- UI components live under `features/library-management/components/*`.
- RBAC gating uses `features/lib/rbac/RequirePermission`.

