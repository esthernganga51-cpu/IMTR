import type { HostelRoom, RoomGridDisplayData } from "@/features/hostel-management/types/hostel";

// Mock hostel data - 4 blocks with 15 rooms each
const createMockRooms = (): HostelRoom[] => {
  const rooms: HostelRoom[] = [];
  const blocks = ["A", "B", "C", "D"];
  const genders = ["male", "female", "co-ed"] as const;
  const types = ["single", "double", "triple"] as const;
  const statuses = ["available", "occupied", "reserved"] as const;

  blocks.forEach((block) => {
    for (let floor = 1; floor <= 3; floor++) {
      for (let room = 1; room <= 5; room++) {
        const roomNum = floor * 100 + room;
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const roomType = types[Math.floor(Math.random() * types.length)];
        const capacity = roomType === "single" ? 1 : roomType === "double" ? 2 : 3;
        const occupants = randomStatus === "occupied" ? capacity : 0;

        rooms.push({
          id: `room-${block}-${roomNum}`,
          roomNumber: `${block}${roomNum}`,
          floor,
          block,
          capacity,
          occupants,
          status: randomStatus,
          type: roomType,
          gender: genders[Math.floor(Math.random() * genders.length)],
          amenities: ["WiFi", "Fan", "Bed", "Desk"],
          lastUpdated: new Date(),
        });
      }
    }
  });

  return rooms;
};

let hostelRooms = createMockRooms();

export async function getHostelOccupancy(): Promise<RoomGridDisplayData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const blocks = ["A", "B", "C", "D"];
  const blockData = blocks.map((block) => {
    const blockRooms = hostelRooms.filter((r) => r.block === block);
    const occupiedCount = blockRooms.filter((r) => r.status === "occupied").length;
    return {
      block,
      totalRooms: blockRooms.length,
      occupiedRooms: occupiedCount,
      occupancyRate: Math.round((occupiedCount / blockRooms.length) * 100),
      rooms: blockRooms,
    };
  });

  const totalRooms = hostelRooms.length;
  const occupiedRooms = hostelRooms.filter((r) => r.status === "occupied").length;
  const availableRooms = hostelRooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = hostelRooms.filter((r) => r.status === "maintenance").length;
  const reservedRooms = hostelRooms.filter((r) => r.status === "reserved").length;

  return {
    blocks: blockData,
    summary: {
      totalRooms,
      occupiedRooms,
      availableRooms,
      maintenanceRooms,
      reservedRooms,
      occupancyRate: Math.round((occupiedRooms / totalRooms) * 100),
    },
    lastSync: new Date(),
  };
}

export async function bookRoom(
  roomId: string,
  studentId: string,
  occupantCount: number
): Promise<HostelRoom | null> {
  const room = hostelRooms.find((r) => r.id === roomId);
  if (!room || room.status !== "available" || room.capacity < occupantCount) {
    return null;
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  room.status = "occupied";
  room.occupants = occupantCount;
  room.lastUpdated = new Date();

  return room;
}

export async function releaseRoom(roomId: string): Promise<HostelRoom | null> {
  const room = hostelRooms.find((r) => r.id === roomId);
  if (!room) return null;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  room.status = "available";
  room.occupants = 0;
  room.lastUpdated = new Date();

  return room;
}

export async function updateRoomStatus(
  roomId: string,
  newStatus: string
): Promise<HostelRoom | null> {
  const room = hostelRooms.find((r) => r.id === roomId);
  if (!room) return null;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  room.status = newStatus as "available" | "occupied" | "maintenance" | "reserved";
  room.lastUpdated = new Date();

  return room;
}

export function resetHostelData(): void {
  hostelRooms = createMockRooms();
}
