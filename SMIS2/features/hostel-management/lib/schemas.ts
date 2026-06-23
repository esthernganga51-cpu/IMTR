import { z } from "zod";

// Hostel Management Schemas
export const roomStatusSchema = z.enum(["available", "occupied", "maintenance", "reserved"]);

export const bookRoomSchema = z.object({
  roomId: z.string().min(1, "Room ID required"),
  studentId: z.string().min(1, "Student ID required"),
  semester: z.string().min(1, "Semester required"),
  occupantCount: z.number().min(1, "At least 1 occupant").max(3, "Max 3 occupants"),
});

export const releaseRoomSchema = z.object({
  roomId: z.string().min(1, "Room ID required"),
  studentId: z.string().min(1, "Student ID required"),
});

export const updateRoomStatusSchema = z.object({
  roomId: z.string().min(1, "Room ID required"),
  newStatus: roomStatusSchema,
  reason: z.string().optional(),
});

export const updateRoomDetailsSchema = z.object({
  roomId: z.string().min(1, "Room ID required"),
  roomNumber: z.string().min(1, "Room number required"),
  block: z.string().min(1, "Block required"),
  floor: z.number().min(1, "Floor required"),
  capacity: z.number().min(1, "Capacity required"),
  type: z.enum(["single", "double", "triple"]),
  gender: z.enum(["male", "female", "co-ed"]),
  status: roomStatusSchema,
  amenities: z.string().optional(),
});

export const searchStudentHostelSchema = z.object({
  searchTerm: z.string().min(1, "Search term required"),
});

export type BookRoomInput = z.infer<typeof bookRoomSchema>;
export type ReleaseRoomInput = z.infer<typeof releaseRoomSchema>;
export type UpdateRoomStatusInput = z.infer<typeof updateRoomStatusSchema>;
export type UpdateRoomDetailsInput = z.infer<typeof updateRoomDetailsSchema>;
export type SearchStudentHostelInput = z.infer<typeof searchStudentHostelSchema>;
