"use client";

import { useEffect, useTransition, useState } from "react";
import type { HostelRoom, RoomStatus } from "@/features/hostel-management/types/hostel";
import { updateRoomStatus } from "@/features/hostel-management/actions/hostel-mutations";

const statusColorMap: Record<RoomStatus, string> = {
  available: "bg-emerald-100 border-emerald-300 text-emerald-900",
  occupied: "bg-rose-100 border-rose-300 text-rose-900",
  maintenance: "bg-slate-100 border-slate-300 text-slate-900",
  reserved: "bg-amber-100 border-amber-300 text-amber-900",
};

const statusLabelMap: Record<RoomStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  maintenance: "Maintenance",
  reserved: "Reserved",
};

type RoomGridProps = {
  rooms: HostelRoom[];
  selectedRoomId?: string;
  onRoomSelected?: (room: HostelRoom) => void;
  onRoomStatusUpdated?: (room: HostelRoom) => void;
};

export function RoomGrid({ rooms, selectedRoomId, onRoomSelected, onRoomStatusUpdated }: RoomGridProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticRooms, setOptimisticRooms] = useState(rooms);

  useEffect(() => {
    startTransition(() => setOptimisticRooms(rooms));
  }, [rooms, startTransition]);

  const handleStatusChange = (room: HostelRoom) => {
    const newStatus: RoomStatus =
      room.status === "available"
        ? "occupied"
        : room.status === "occupied"
        ? "maintenance"
        : "available";

    // Optimistic update
    setOptimisticRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, status: newStatus } : r))
    );

    // Server mutation in background
    startTransition(async () => {
      const result = await updateRoomStatus({
        roomId: room.id,
        newStatus,
      });

      if (!result.success) {
        if (result.room) {
          setOptimisticRooms((prev) =>
            prev.map((r) => (r.id === room.id ? result.room! : r))
          );
          onRoomStatusUpdated?.(result.room);
        }
      } else if (result.room) {
        onRoomStatusUpdated?.(result.room);
      }
    });
  };

  const groupedByFloor = optimisticRooms.reduce(
    (acc, room) => {
      const key = `${room.block}-F${room.floor}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(room);
      return acc;
    },
    {} as Record<string, HostelRoom[]>
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupedByFloor)
        .sort()
        .map(([floorKey, floorRooms]) => (
          <div key={floorKey} className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Block {floorKey}</h3>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {floorRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    handleStatusChange(room);
                    onRoomSelected?.(room);
                  }}
                  disabled={isPending}
                  title={`${room.roomNumber} - ${statusLabelMap[room.status]} - Capacity: ${room.capacity}`}
                  className={`rounded border-2 p-2 text-center text-xs font-medium transition-all hover:shadow-md disabled:opacity-50 ${statusColorMap[room.status]} ${room.id === selectedRoomId ? "ring-2 ring-sky-500" : ""}`}
                >
                  <div className="font-semibold">{room.roomNumber}</div>
                  <div className="text-[10px]">
                    {room.occupants}/{room.capacity}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
