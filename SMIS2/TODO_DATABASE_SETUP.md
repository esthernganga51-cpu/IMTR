# TODO: Create Persistent Database Setup (Prisma)

## Step 1 — Initialize Prisma
- Check that `SMIS2/prisma/schema.prisma` doesn’t exist.
- Run `npx prisma init` inside `SMIS2/`.

## Step 2 — Configure database URL
- Create/confirm `SMIS2/.env`
- Set `DATABASE_URL` (SQLite recommended for local): `file:./dev.db`

## Step 3 — Define Prisma schema
- Create `SMIS2/prisma/schema.prisma`
- Add models for your current in-memory record types (at minimum):
  - Student, Staff, Department
  - HostelRoom, RoomBooking
  - BookCategory, Author, Publisher, Book, BookCopy
  - BorrowTransaction, Reservation, Fine
  - LibrarySettings

## Step 4 — Migrate + generate Prisma client
- Run:
  - `npx prisma generate`
  - `npx prisma migrate dev --name init`

## Step 5 — Wire app code to DB
- Replace `SMIS2/features/lib/db/init.ts` in-memory implementation with Prisma calls.
- Update any feature data access layers to use Prisma.

## Step 6 — Validate
- Run `npm run typecheck`
- Run `npm run dev` and verify one endpoint/page reads/writes data.

