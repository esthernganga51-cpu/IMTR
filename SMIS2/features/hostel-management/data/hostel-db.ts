/**
 * Hostel Database Operations
 * CRUD operations for hostel rooms and bookings with state consistency
 */

"use server";

import { db, initializeDatabase } from "@/features/lib/db/init";
import type { HostelRoom, HostelOccupancy, BlockOccupancy, RoomGridDisplayData } from "@/features/hostel-management/types/hostel";
import type { RoomStatus } from "@/features/hostel-management/types/hostel";

// Initialize on module load
initializeDatabase();

export async function getHostelOccupancyFromDb(): Promise<RoomGridDisplayData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const rooms = db.getAllHostelRooms();
  const blocks = ["A", "B", "C", "D"];
  const convertedRooms = rooms.map(convertRoomToHostelRoom);

  const blockData: BlockOccupancy[] = blocks.map((block) => {
    const blockRooms = convertedRooms.filter((r) => r.block === block);
    const occupiedCount = blockRooms.filter((r) => r.status === "occupied").length;

    return {
      block,
      totalRooms: blockRooms.length,
      occupiedRooms: occupiedCount,
      occupancyRate: blockRooms.length > 0 ? Math.round((occupiedCount / blockRooms.length) * 100) : 0,
      rooms: blockRooms,
    };
  });

  const totalRooms = convertedRooms.length;
  const occupiedRooms = convertedRooms.filter((r) => r.status === "occupied").length;
  const availableRooms = convertedRooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = convertedRooms.filter((r) => r.status === "maintenance").length;
  const reservedRooms = convertedRooms.filter((r) => r.status === "reserved").length;

  const summary: HostelOccupancy = {
    totalRooms,
    occupiedRooms,
    availableRooms,
    maintenanceRooms,
    reservedRooms,
    occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
  };

  return {
    blocks: blockData,
    summary,
    lastSync: new Date(),
  };
}

function convertRoomToHostelRoom(room: ReturnType<typeof db.getAllHostelRooms>[0]): HostelRoom {
  const bookings = db.getActiveBookingsForRoom(room.id);
  const occupants = bookings.reduce((sum, b) => sum + b.occupantCount, 0);
  const explicitStatus: RoomStatus = room.status ?? "available";

  let status: RoomStatus = explicitStatus;
  if (occupants > 0) {
    status = occupants >= room.capacity ? "occupied" : "reserved";
  }

  return {
    id: room.id,
    roomNumber: room.roomNumber,
    floor: room.floor,
    block: room.block,
    capacity: room.capacity,
    occupants,
    status,
    type: room.type,
    gender: room.gender,
    amenities: room.amenities.split(","),
    lastUpdated: room.updatedAt,
  };
}

export async function bookRoomInDb(roomId: string, studentId: string, occupantCount: number, semester: string): Promise<HostelRoom | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  const room = db.getHostelRoom(roomId);
  if (!room) return null;

  // Check capacity
  const bookings = db.getActiveBookingsForRoom(roomId);
  const currentOccupants = bookings.reduce((sum, b) => sum + b.occupantCount, 0);
  
  if (currentOccupants + occupantCount > room.capacity) {
    return null;
  }

  // Create booking record
  const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  db.insertRoomBooking({
    id: bookingId,
    roomId,
    studentId,
    semester,
    occupantCount,
    status: "active",
    bookedAt: new Date(),
  });

  return convertRoomToHostelRoom(room);
}

export async function releaseRoomInDb(roomId: string, studentId: string): Promise<HostelRoom | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  const room = db.getHostelRoom(roomId);
  if (!room) return null;

  // Find and release booking
  const bookings = db.getActiveBookingsForRoom(roomId);
  for (const booking of bookings) {
    if (booking.studentId === studentId) {
      db.updateRoomBooking(booking.id, {
        status: "released",
        releasedAt: new Date(),
      });
      break;
    }
  }

  return convertRoomToHostelRoom(room);
}

export async function updateRoomStatusInDb(roomId: string, newStatus: RoomStatus): Promise<HostelRoom | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  const room = db.getHostelRoom(roomId);
  if (!room) return null;

  // Update room in database
  db.updateHostelRoom(roomId, {
    status: newStatus,
    updatedAt: new Date(),
  });

  return convertRoomToHostelRoom(room);
}

export async function updateRoomDetailsInDb(
  roomId: string,
  updates: {
    roomNumber: string;
    block: string;
    floor: number;
    capacity: number;
    type: "single" | "double" | "triple";
    gender: "male" | "female" | "co-ed";
    status: RoomStatus;
    amenities: string;
  }
): Promise<HostelRoom | null> {
  const room = db.getHostelRoom(roomId);
  if (!room) return null;

  db.updateHostelRoom(roomId, {
    ...updates,
    updatedAt: new Date(),
  });

  return convertRoomToHostelRoom(db.getHostelRoom(roomId)!);
}

export async function getRoomDetailsInDb(roomId: string): Promise<{ room: HostelRoom; bookingCount: number } | null> {
  const room = db.getHostelRoom(roomId);
  if (!room) return null;

  const bookings = db.getActiveBookingsForRoom(roomId);

  return {
    room: convertRoomToHostelRoom(room),
    bookingCount: bookings.length,
  };
}

export async function getStudentHostelBookingsInDb(studentId: string) {
  const bookings = db.getRoomBookingsByStudent(studentId).filter((booking) => booking.status === "active");
  return bookings.map((booking) => {
    const room = db.getHostelRoom(booking.roomId);
    return {
      bookingId: booking.id,
      semester: booking.semester,
      occupantCount: booking.occupantCount,
      status: booking.status,
      bookedAt: booking.bookedAt,
      releasedAt: booking.releasedAt,
      room: room ? convertRoomToHostelRoom(room) : null,
    };
  });
}

export async function getBlockOccupancyInDb(block: string): Promise<BlockOccupancy | null> {
  const rooms = db.getHostelRoomsByBlock(block);
  if (rooms.length === 0) return null;

  const occupiedCount = rooms.filter((r) => {
    const bookings = db.getActiveBookingsForRoom(r.id);
    return bookings.length > 0;
  }).length;

  return {
    block,
    totalRooms: rooms.length,
    occupiedRooms: occupiedCount,
    occupancyRate: Math.round((occupiedCount / rooms.length) * 100),
    rooms: rooms.map((room) => convertRoomToHostelRoom(room)),
  };
}
