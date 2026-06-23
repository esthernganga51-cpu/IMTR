/**
 * Hostel Management API Contracts
 * API-first design with strict TypeScript types
 * Database-backed relational state tracking
 */

import type { HostelRoomRecord, RoomBookingRecord } from "@/features/lib/db/init";
import type { Student } from "@/features/student-management/types/student";

// Room Status enum - immutable state values
export type RoomStatus = "available" | "occupied" | "maintenance" | "reserved";

export interface HostelRoom {
  id: string;
  roomNumber: string;
  floor: number;
  block: string; // A, B, C, D
  capacity: number;
  occupants: number;
  status: RoomStatus;
  type: "single" | "double" | "triple";
  gender: "male" | "female" | "co-ed";
  amenities: string[];
  lastUpdated: Date;
}

export interface HostelOccupancy {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  reservedRooms: number;
  occupancyRate: number; // 0-100 percentage
}

export interface BlockOccupancy {
  block: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  rooms: HostelRoom[];
}

// API Contract for booking operations
export interface BookRoomRequest {
  roomId: string;
  studentId: string;
  semester: string;
  occupantCount: number;
}

export interface BookRoomResponse {
  success: boolean;
  message: string;
  room?: HostelRoom;
  error?: string;
  bookingId?: string;
}

// API Contract for releasing room
export interface ReleaseRoomRequest {
  roomId: string;
  studentId: string;
}

export interface ReleaseRoomResponse {
  success: boolean;
  message: string;
  room?: HostelRoom;
  error?: string;
}

// API Contract for updating room status
export interface UpdateRoomStatusRequest {
  roomId: string;
  newStatus: RoomStatus;
  reason?: string;
}

export interface UpdateRoomStatusResponse {
  success: boolean;
  message: string;
  room?: HostelRoom;
  error?: string;
}

export interface UpdateRoomDetailsRequest {
  roomId: string;
  roomNumber: string;
  block: string;
  floor: number;
  capacity: number;
  type: "single" | "double" | "triple";
  gender: "male" | "female" | "co-ed";
  status: RoomStatus;
  amenities: string;
}

export interface UpdateRoomDetailsResponse {
  success: boolean;
  message: string;
  room?: HostelRoom;
  error?: string;
}

export interface StudentHostelBookingResult {
  student: Student;
  bookings: Array<{
    bookingId: string;
    room: HostelRoom;
    semester: string;
    occupantCount: number;
    status: string;
    bookedAt: string;
    releasedAt?: string;
  }>;
}

export interface SearchStudentHostelResponse {
  success: boolean;
  message: string;
  students: StudentHostelBookingResult[];
  error?: string;
}

export interface RoomGridDisplayData {
  blocks: BlockOccupancy[];
  summary: HostelOccupancy;
  lastSync: Date;
}

// Database entity types
export type HostelRoomEntity = HostelRoomRecord;
export type RoomBookingEntity = RoomBookingRecord;
