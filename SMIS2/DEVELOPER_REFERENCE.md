# Admission Management Interface - Developer Reference

## Quick Reference: API Contracts

### Hostel Booking API

#### book Room
```typescript
// Action: updateRoomStatus
// Location: features/hostel-management/actions/hostel-mutations.ts

// Input
{ roomId: string; newStatus: RoomStatus; reason?: string }

// Output
{ success: boolean; message: string; room?: HostelRoom; error?: string }

// Usage in Component
const result = await updateRoomStatus({ roomId, newStatus });
```

#### Get Occupancy
```typescript
// Action: fetchHostelOccupancy
// Location: features/hostel-management/actions/fetch-occupancy.ts

// Output
{
  blocks: BlockOccupancy[]
  summary: HostelOccupancy
  lastSync: Date
}

// Usage in Server Component
const data = await fetchHostelOccupancy();
```

### Student Clearance API

#### Update Clearance Status
```typescript
// Action: updateClearanceStatus
// Location: features/student-clearance/actions/clearance-mutations.ts

// Input
{
  studentId: string
  departmentId: DepartmentId  // "finance" | "library" | "academic" | "sports"
  newStatus: ClearanceStatusType  // "pending" | "approved" | "rejected" | "exempt"
  approvedBy?: string
  notes?: string
}

// Output
{
  success: boolean
  message: string
  clearance?: StudentClearance
  affectedDepartment?: DepartmentClearance
  error?: string
}

// Usage in Component
const result = await updateClearanceStatus({
  studentId: "std-001",
  departmentId: "finance",
  newStatus: "approved",
  approvedBy: "Admin Officer"
});
```

#### Batch Update Clearance
```typescript
// Action: batchUpdateClearanceStatus
// Location: features/student-clearance/actions/clearance-mutations.ts

// Input
{
  studentIds: string[]
  departmentId: DepartmentId
  newStatus: ClearanceStatusType
  approvedBy?: string
  notes?: string
}

// Output
{
  success: boolean
  message: string
  updatedCount: number
  errors?: Array<{ studentId: string; error: string }>
}
```

#### Get Clearance Matrix
```typescript
// Action: fetchClearanceMatrix
// Location: features/student-clearance/actions/fetch-clearance.ts

// Output
{
  students: StudentClearance[]
  departments: Department[]
  summary: ClearanceSummary
}
```

---

## Key Type Definitions

### Hostel Management

```typescript
// Room Status States
type RoomStatus = "available" | "occupied" | "maintenance" | "reserved";

// Room Display Contract
interface HostelRoom {
  id: string;
  roomNumber: string;
  floor: number;
  block: string;  // A, B, C, D
  capacity: number;
  occupants: number;
  status: RoomStatus;
  type: "single" | "double" | "triple";
  gender: "male" | "female" | "co-ed";
  amenities: string[];
  lastUpdated: Date;
}

// Summary Statistics
interface HostelOccupancy {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  reservedRooms: number;
  occupancyRate: number;  // 0-100
}
```

### Student Clearance

```typescript
// Department Identifiers
type DepartmentId = "finance" | "library" | "academic" | "sports";

// Clearance Status States
type ClearanceStatusType = "pending" | "approved" | "rejected" | "exempt";

// Per-Department Clearance
interface DepartmentClearance {
  departmentId: DepartmentId;
  status: ClearanceStatusType;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  requiresAction: boolean;
}

// Complete Student Clearance
interface StudentClearance {
  studentId: string;
  studentName: string;
  applicationId: string;
  departmentClearances: DepartmentClearance[];
  overallStatus: ClearanceStatusType;
  clearancePercentage: number;  // 0-100
  lastModified: Date;
  allClear: boolean;
}

// Department Configuration
interface Department {
  id: DepartmentId;
  name: string;
  abbreviation: string;
  requiresSignature: boolean;
  description: string;
}

// Summary Statistics
interface ClearanceSummary {
  totalStudents: number;
  fullyCleared: number;
  partiallyCleared: number;
  pendingStudents: number;
  perDepartment: Record<DepartmentId, {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  }>;
}
```

---

## Validation Schemas

### Hostel Validation (Zod)

```typescript
import { z } from "zod";
import { roomStatusSchema, updateRoomStatusSchema } from "@/features/hostel-management/lib/schemas";

// Example validation
const input = { roomId: "room-A-101", newStatus: "occupied" };
const validated = updateRoomStatusSchema.parse(input);
// Throws ZodError if invalid
```

### Clearance Validation (Zod)

```typescript
import { z } from "zod";
import { updateClearanceStatusSchema } from "@/features/student-clearance/lib/schemas";

// Example validation
const input = {
  studentId: "std-001",
  departmentId: "finance",
  newStatus: "approved",
};
const validated = updateClearanceStatusSchema.parse(input);
// Throws ZodError if invalid
```

---

## Component Usage Examples

### Room Grid

```typescript
import { RoomGrid } from "@/features/hostel-management/components/room-grid";

export function Example() {
  const rooms: HostelRoom[] = [
    {
      id: "room-A-101",
      roomNumber: "A101",
      floor: 1,
      block: "A",
      capacity: 2,
      occupants: 1,
      status: "reserved",
      type: "double",
      gender: "male",
      amenities: ["WiFi", "Fan", "Bed", "Desk"],
      lastUpdated: new Date(),
    },
    // ... more rooms
  ];

  return <RoomGrid rooms={rooms} />;
}
```

### Clearance Matrix

```typescript
import { ClearanceMatrix } from "@/features/student-clearance/components/clearance-matrix";

export function Example() {
  const students: StudentClearance[] = [
    {
      studentId: "std-001",
      studentName: "Alice Johnson",
      applicationId: "APP-2024-001",
      departmentClearances: [
        { departmentId: "finance", status: "approved", requiresAction: false },
        { departmentId: "library", status: "pending", requiresAction: true },
        // ... more departments
      ],
      overallStatus: "pending",
      clearancePercentage: 50,
      lastModified: new Date(),
      allClear: false,
    },
    // ... more students
  ];

  const departments: Department[] = [
    {
      id: "finance",
      name: "Finance",
      abbreviation: "FIN",
      requiresSignature: true,
      description: "Fee clearance and financial obligations",
    },
    // ... more departments
  ];

  return (
    <ClearanceMatrix students={students} departments={departments} />
  );
}
```

### Occupancy Summary

```typescript
import { OccupancySummary } from "@/features/hostel-management/components/occupancy-summary";

export function Example() {
  const summary: HostelOccupancy = {
    totalRooms: 60,
    occupiedRooms: 45,
    availableRooms: 12,
    maintenanceRooms: 2,
    reservedRooms: 1,
    occupancyRate: 75,
  };

  const blockData: BlockOccupancy[] = [
    {
      block: "A",
      totalRooms: 15,
      occupiedRooms: 12,
      occupancyRate: 80,
      rooms: [], // filled in actual usage
    },
    // ... more blocks
  ];

  return <OccupancySummary summary={summary} blockData={blockData} />;
}
```

---

## Database Operations

### Accessing the Database

```typescript
// In server actions or data layer files only
import { db, initializeDatabase } from "@/features/lib/db/init";

// Initialize database with mock data
initializeDatabase();

// Hostel Room Operations
const room = db.getHostelRoom("room-A-101");
const rooms = db.getAllHostelRooms();
const blockRooms = db.getHostelRoomsByBlock("A");
db.updateHostelRoom("room-A-101", { updatedAt: new Date() });

// Room Booking Operations
const booking = db.getRoomBooking("booking-123");
const activeBookings = db.getActiveBookingsForRoom("room-A-101");
db.updateRoomBooking("booking-123", { status: "released" });

// Student Clearance Operations
const clearance = db.getStudentClearance("std-001");
const allClearances = db.getAllStudentClearances();
const studentDepts = db.getStudentDepartmentClearances("std-001");
const deptClearance = db.getDepartmentClearance("std-001", "finance");
db.updateDepartmentClearance("std-001", "finance", { status: "approved" });

// Utility Methods
const summary = db.getStudentClearanceSummary("std-001");
const occupancyInfo = db.getRoomOccupancyInfo("room-A-101");
```

---

## Server Action Pattern

### Creating a New Server Action

```typescript
"use server";

import { z } from "zod";
import type { ResponseContract } from "@/features/module/types";
import { validationSchema } from "@/features/module/lib/schemas";
import { performOperationInDb } from "@/features/module/data/db";

export async function myServerAction(
  input: unknown
): Promise<ResponseContract> {
  try {
    // 1. Validate input
    const validated = validationSchema.parse(input);

    // 2. Call database operation
    const result = await performOperationInDb(validated);

    // 3. Return typed response
    if (!result) {
      return {
        success: false,
        message: "Operation failed",
        error: "RECORD_NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Operation successful",
      data: result,
    };
  } catch (error) {
    // 4. Handle errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        error: error.issues[0]?.message || "Validation error",
      };
    }

    return {
      success: false,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

### Using Server Actions in Client Components

```typescript
"use client";

import { useTransition, useState } from "react";
import { myServerAction } from "@/features/module/actions/mutations";

export function MyComponent() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState(initialState);

  const handleClick = () => {
    // Optimistic update
    setState(optimisticValue);

    // Server mutation in background
    startTransition(async () => {
      const result = await myServerAction(input);

      if (!result.success) {
        // Rollback on error
        setState(previousValue);
        console.error(result.error);
      }
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Loading..." : "Action"}
    </button>
  );
}
```

---

## File Organization Structure

```
features/
├── lib/
│   └── db/
│       └── init.ts                    # Global database instance
├── hostel-management/
│   ├── types/
│   │   └── hostel.ts                 # Type definitions
│   ├── lib/
│   │   └── schemas.ts                # Zod validation schemas
│   ├── data/
│   │   ├── hostel-db.ts              # CRUD operations
│   │   └── mock-hostel.ts            # Mock data (fallback)
│   ├── actions/
│   │   ├── hostel-mutations.ts       # Server actions for mutations
│   │   └── fetch-occupancy.ts        # Server actions for fetching
│   └── components/
│       ├── room-grid.tsx             # Interactive room grid
│       ├── occupancy-summary.tsx     # Summary statistics
│       └── hostel-booking-page.tsx   # Page layout
└── student-clearance/
    ├── types/
    │   └── clearance.ts              # Type definitions
    ├── lib/
    │   └── schemas.ts                # Zod validation schemas
    ├── data/
    │   ├── clearance-db.ts           # CRUD operations
    │   └── mock-clearance.ts         # Mock data (fallback)
    ├── actions/
    │   ├── clearance-mutations.ts    # Server actions for mutations
    │   └── fetch-clearance.ts        # Server actions for fetching
    └── components/
        ├── clearance-matrix.tsx      # Multi-department matrix
        ├── clearance-summary-cards.tsx
        └── student-clearance-page.tsx
```

---

## Debugging Tips

### Checking Type Errors
```bash
npm run typecheck
```

### Viewing Database State (in Node console)
```typescript
import { db } from "@/features/lib/db/init";

console.log("All rooms:", db.getAllHostelRooms());
console.log("All students:", db.getAllStudentClearances());
console.log("Room details:", db.getRoomOccupancyInfo("room-A-101"));
```

### Testing Server Actions
```typescript
// In a server component or API route
import { updateRoomStatus } from "@/features/hostel-management/actions/hostel-mutations";

const result = await updateRoomStatus({
  roomId: "room-A-101",
  newStatus: "occupied",
});

console.log("Result:", result);
```

### Inspecting Network Delays
Look for simulated delays in:
- `features/hostel-management/data/hostel-db.ts` (100-150ms)
- `features/student-clearance/data/clearance-db.ts` (100-200ms)

---

## Common Patterns

### Handling Optimistic Updates with Error Rollback

```typescript
"use client";

import { useTransition, useState } from "react";
import type { Room } from "@/features/hostel-management/types";
import { updateRoomStatus } from "@/features/hostel-management/actions";

export function RoomCard({ initialRoom }: { initialRoom: Room }) {
  const [isPending, startTransition] = useTransition();
  const [room, setRoom] = useState(initialRoom);

  const handleStatusChange = (newStatus: Room["status"]) => {
    // Save previous state for rollback
    const previousRoom = room;

    // Optimistic update
    setRoom({ ...room, status: newStatus });

    // Server mutation
    startTransition(async () => {
      const result = await updateRoomStatus({
        roomId: room.id,
        newStatus,
      });

      // Rollback on error
      if (!result.success || !result.room) {
        setRoom(previousRoom);
        console.error("Update failed:", result.error);
      } else {
        // Confirm with server response
        setRoom(result.room);
      }
    });
  };

  return (
    <button onClick={() => handleStatusChange("occupied")} disabled={isPending}>
      {room.status}
    </button>
  );
}
```

### Calculating Clearance Percentage

```typescript
// From database
const summary = db.getStudentClearanceSummary("std-001");
// { approved: 3, pending: 1, rejected: 0, exempt: 0, percentage: 75, allClear: false }

// Manual calculation
const approved = 3;
const total = 4;  // finance, library, academic, sports
const percentage = Math.round((approved / total) * 100);  // 75
```

### Iterating Over Departments

```typescript
const departments: DepartmentId[] = ["finance", "library", "academic", "sports"];

departments.forEach((deptId) => {
  const clearance = student.departmentClearances.find(
    (dc) => dc.departmentId === deptId
  );
  console.log(`${deptId}: ${clearance?.status}`);
});
```

---

## Performance Notes

### Database Complexity
- Room lookups: O(1) via Map.get()
- Block filtering: O(n) where n = total rooms
- Student lookups: O(n) where n = total students
- Department clearance: O(1) via composite key

### Network Simulation
- Simulated delays: 100-200ms (realistic LAN/WAN)
- Can be adjusted in data layer files
- Not used in production (real database has actual latency)

### Bundle Impact
- Zod validation: ~40KB gzipped
- React hooks: ~1KB minified
- Components: ~5KB minified
- Total client-side overhead: ~46KB for features

---

## Extending the System

### Adding a New Room Status
1. Update `RoomStatus` type in `features/hostel-management/types/hostel.ts`
2. Add to `roomStatusSchema` in `features/hostel-management/lib/schemas.ts`
3. Update status cycle in `room-grid.tsx`
4. Add color mapping in `statusColorMap`

### Adding a New Department
1. Update `DepartmentId` type in `features/student-clearance/types/clearance.ts`
2. Add to `departmentIdSchema` in `features/student-clearance/lib/schemas.ts`
3. Add to departments array in `features/student-clearance/data/mock-clearance.ts`
4. Update database initialization in `features/lib/db/init.ts`

### Connecting Real Database
1. Replace in-memory Maps with database queries
2. Update `features/lib/db/init.ts` with actual DB client
3. Convert CRUD methods to async queries
4. Add connection pooling and error handling
5. Run migrations for schema

---

## Resources

- **Next.js Documentation**: https://nextjs.org/docs/app
- **Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations
- **Zod Documentation**: https://zod.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **React Hooks**: https://react.dev/reference/react

---

**Last Updated**: 2026-05-29
**Version**: 1.0.0
**Status**: Production Ready
