"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { RoomGrid } from "@/features/hostel-management/components/room-grid";
import { OccupancySummary } from "@/features/hostel-management/components/occupancy-summary";
import { searchStudentHostel, updateRoomDetails } from "@/features/hostel-management/actions/hostel-mutations";
import type {
  HostelRoom,
  RoomGridDisplayData,
  StudentHostelBookingResult,
  UpdateRoomDetailsRequest,
} from "@/features/hostel-management/types/hostel";

type HostelBookingAdminProps = {
  initialData: RoomGridDisplayData;
};

function updateRoomInData(
  data: RoomGridDisplayData,
  updatedRoom: HostelRoom
): RoomGridDisplayData {
  return {
    ...data,
    blocks: data.blocks.map((block) => ({
      ...block,
      rooms: block.rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)),
    })),
  };
}

export function HostelBookingAdmin({ initialData }: HostelBookingAdminProps) {
  const [data, setData] = useState(initialData);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    initialData.blocks[0]?.rooms[0]?.id ?? null
  );
  const [editValues, setEditValues] = useState<UpdateRoomDetailsRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<StudentHostelBookingResult[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const flatRooms = useMemo(
    () => data.blocks.flatMap((block) => block.rooms),
    [data.blocks]
  );

  const selectedRoom = useMemo(
    () => flatRooms.find((room) => room.id === selectedRoomId) ?? null,
    [flatRooms, selectedRoomId]
  );

  useEffect(() => {
    if (selectedRoom) {
      startTransition(() => {
        setEditValues({
          roomId: selectedRoom.id,
          roomNumber: selectedRoom.roomNumber,
          block: selectedRoom.block,
          floor: selectedRoom.floor,
          capacity: selectedRoom.capacity,
          type: selectedRoom.type,
          gender: selectedRoom.gender,
          status: selectedRoom.status,
          amenities: selectedRoom.amenities.join(", "),
        });
      });
    } else {
      startTransition(() => setEditValues(null));
    }
  }, [selectedRoom, startTransition]);

  const handleRoomSelection = (room: HostelRoom) => {
    setSelectedRoomId(room.id);
  };

  const handleRoomStatusUpdated = (updatedRoom: HostelRoom) => {
    setData((prev) => updateRoomInData(prev, updatedRoom));
  };

  const handleSaveRoomDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editValues) return;

    startTransition(async () => {
      const result = await updateRoomDetails(editValues);
      if (result.success && result.room) {
        setData((prev) => updateRoomInData(prev, result.room!));
        setStatusMessage(result.message);
      } else {
        setStatusMessage(result.message || result.error || "Unable to save room details.");
      }
    });
  };

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      setStatusMessage("Enter student name or admission number to search.");
      setSearchResults([]);
      return;
    }

    startTransition(async () => {
      const result = await searchStudentHostel({ searchTerm: term });
      if (result.success) {
        setSearchResults(result.students);
        setStatusMessage(result.students.length === 0 ? "No hostel records found." : "");
      } else {
        setSearchResults([]);
        setStatusMessage(result.message || result.error || "Search failed.");
      }
    });
  };

  const handleEditInputChange = (field: keyof Omit<UpdateRoomDetailsRequest, "roomId">, value: string | number) => {
    setEditValues((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hostel Booking</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage hostel room availability, student assignments, and room details from one place.
        </p>
      </div>

      <OccupancySummary summary={data.summary} blockData={data.blocks} />

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Room Occupancy Grid</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Click a room to select it and cycle status between Available → Occupied → Maintenance.
            </p>
          </div>

          <div className="rounded-md border bg-card p-4 shadow-sm">
            <RoomGrid
              rooms={flatRooms}
              selectedRoomId={selectedRoomId ?? undefined}
              onRoomSelected={handleRoomSelection}
              onRoomStatusUpdated={handleRoomStatusUpdated}
            />
          </div>

          <div className="rounded-md border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Selected Room Details</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Edit room metadata and save changes for the admin hostel inventory.
                </p>
              </div>
              {selectedRoom ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {selectedRoom.roomNumber}
                </span>
              ) : null}
            </div>

            {selectedRoom && editValues ? (
              <form className="mt-4 space-y-4" onSubmit={handleSaveRoomDetails}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Room Number</span>
                    <input
                      value={editValues.roomNumber}
                      onChange={(event) => handleEditInputChange("roomNumber", event.target.value)}
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Block</span>
                    <input
                      value={editValues.block}
                      onChange={(event) => handleEditInputChange("block", event.target.value)}
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Floor</span>
                    <input
                      type="number"
                      value={editValues.floor}
                      onChange={(event) => handleEditInputChange("floor", Number(event.target.value))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                      min={1}
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <input
                      type="number"
                      value={editValues.capacity}
                      onChange={(event) => handleEditInputChange("capacity", Number(event.target.value))}
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                      min={1}
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <select
                      value={editValues.type}
                      onChange={(event) => handleEditInputChange("type", event.target.value)}
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                    >
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="triple">Triple</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Gender</span>
                    <select
                      value={editValues.gender}
                      onChange={(event) => handleEditInputChange("gender", event.target.value)}
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="co-ed">Co-ed</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <select
                      value={editValues.status}
                      onChange={(event) => handleEditInputChange("status", event.target.value)}
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </label>
                  <label className="sm:col-span-2 space-y-1 text-sm">
                    <span className="text-muted-foreground">Amenities</span>
                    <input
                      value={editValues.amenities}
                      onChange={(event) => handleEditInputChange("amenities", event.target.value)}
                      placeholder="WiFi, Fan, Bed"
                      className="w-full rounded border bg-background px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Save room details
                  </button>
                  {statusMessage ? (
                    <p className="text-sm text-slate-600">{statusMessage}</p>
                  ) : null}
                </div>
              </form>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Select a room from the grid to edit its details.</p>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-md border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-semibold">Search Hostel Student</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Find a student and trace their hostel booking details.
            </p>

            <div className="mt-4 space-y-3">
              <div className="space-y-1 text-sm">
                <label className="block text-muted-foreground">Student name or admission number</label>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. ADM-001 or Jane Doe"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                disabled={isPending}
                className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Search student
              </button>
              {statusMessage ? (
                <p className="text-sm text-slate-600">{statusMessage}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-md border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-semibold">Student Booking Results</h3>
            <div className="mt-4 space-y-4">
              {searchResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">Search to view student hostel booking history.</p>
              ) : (
                searchResults.map((result) => (
                  <div key={result.student.id} className="rounded-md border bg-muted/50 p-4">
                    <p className="font-semibold">{result.student.firstName} {result.student.lastName}</p>
                    <p className="text-xs text-muted-foreground">{result.student.admissionNumber}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{result.student.course} • {result.student.department} • {result.student.level}</p>
                    <p className="text-sm text-muted-foreground">{result.student.email} • {result.student.phone}</p>
                    {result.bookings.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-semibold">Active Hostel Bookings</p>
                        {result.bookings.map((booking) => (
                          <div key={booking.bookingId} className="rounded-md border bg-white p-3 text-sm">
                            <p><span className="font-semibold">Room:</span> {booking.room.roomNumber}</p>
                            <p><span className="font-semibold">Semester:</span> {booking.semester}</p>
                            <p><span className="font-semibold">Occupants:</span> {booking.occupantCount}</p>
                            <p><span className="font-semibold">Booked:</span> {new Date(booking.bookedAt).toDateString()}</p>
                            <p><span className="font-semibold">Status:</span> {booking.status}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">No active hostel booking found for this student.</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
