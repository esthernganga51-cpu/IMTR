"use server";

import { z } from "zod";
import {
  bookRoomSchema,
  releaseRoomSchema,
  updateRoomDetailsSchema,
  updateRoomStatusSchema,
  searchStudentHostelSchema,
} from "@/features/hostel-management/lib/schemas";
import {
  bookRoomInDb,
  releaseRoomInDb,
  updateRoomDetailsInDb,
  updateRoomStatusInDb,
  getStudentHostelBookingsInDb,
} from "@/features/hostel-management/data/hostel-db";
import { searchStudents } from "@/features/student-management/data/student-db";
import type {
  BookRoomResponse,
  HostelRoom,
  ReleaseRoomResponse,
  UpdateRoomDetailsResponse,
  UpdateRoomStatusResponse,
  SearchStudentHostelResponse,
} from "@/features/hostel-management/types/hostel";

export async function bookRoom(input: unknown): Promise<BookRoomResponse> {
  try {
    const validated = bookRoomSchema.parse(input);
    const room = await bookRoomInDb(
      validated.roomId,
      validated.studentId,
      validated.occupantCount,
      validated.semester
    );

    if (!room) {
      return {
        success: false,
        message: "Room not available or not found",
        error: "ROOM_NOT_AVAILABLE",
      };
    }

    return {
      success: true,
      message: `Room ${validated.roomId} booked successfully`,
      room,
      bookingId: `BOOK-${Date.now()}`,
    };
  } catch (error) {
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

export async function releaseRoom(input: unknown): Promise<ReleaseRoomResponse> {
  try {
    const validated = releaseRoomSchema.parse(input);
    const room = await releaseRoomInDb(validated.roomId, validated.studentId);

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        error: "ROOM_NOT_FOUND",
      };
    }

    return {
      success: true,
      message: `Room ${validated.roomId} released successfully`,
      room,
    };
  } catch (error) {
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

export async function updateRoomStatus(input: unknown): Promise<UpdateRoomStatusResponse> {
  try {
    const validated = updateRoomStatusSchema.parse(input);
    const room = await updateRoomStatusInDb(validated.roomId, validated.newStatus);

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        error: "ROOM_NOT_FOUND",
      };
    }

    return {
      success: true,
      message: `Room status updated to ${validated.newStatus}`,
      room,
    };
  } catch (error) {
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

export async function updateRoomDetails(input: unknown): Promise<UpdateRoomDetailsResponse> {
  try {
    const validated = updateRoomDetailsSchema.parse(input);
    const room = await updateRoomDetailsInDb(validated.roomId, {
      roomNumber: validated.roomNumber,
      block: validated.block,
      floor: validated.floor,
      capacity: validated.capacity,
      type: validated.type,
      gender: validated.gender,
      status: validated.status,
      amenities: validated.amenities ?? "",
    });

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        error: "ROOM_NOT_FOUND",
      };
    }

    return {
      success: true,
      message: `Room ${validated.roomNumber} updated successfully`,
      room,
    };
  } catch (error) {
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

export async function searchStudentHostel(input: unknown): Promise<SearchStudentHostelResponse> {
  try {
    const validated = searchStudentHostelSchema.parse(input);
    const students = await searchStudents(validated.searchTerm);

    const results = await Promise.all(
      students.map(async (student) => {
        const bookings = await getStudentHostelBookingsInDb(student.id);
        return {
          student,
          bookings: bookings
            .filter((booking) => booking.room !== null)
            .map((booking) => ({
              bookingId: booking.bookingId,
              room: booking.room as HostelRoom,
              semester: booking.semester,
              occupantCount: booking.occupantCount,
              status: booking.status,
              bookedAt: booking.bookedAt.toISOString(),
              releasedAt: booking.releasedAt?.toISOString(),
            })),
        };
      })
    );

    return {
      success: true,
      message: `Found ${results.length} student(s)`,
      students: results,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        error: error.issues[0]?.message || "Validation error",
        students: [],
      };
    }

    return {
      success: false,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
      students: [],
    };
  }
}
