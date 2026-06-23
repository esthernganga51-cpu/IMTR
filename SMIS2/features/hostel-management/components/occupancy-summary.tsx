"use client";

import type { HostelOccupancy, BlockOccupancy } from "@/features/hostel-management/types/hostel";

type OccupancySummaryProps = {
  summary: HostelOccupancy;
  blockData: BlockOccupancy[];
};

export function OccupancySummary({ summary, blockData }: OccupancySummaryProps) {
  const getOccupancyColor = (rate: number) => {
    if (rate < 30) return "text-emerald-600";
    if (rate < 60) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="space-y-4">
      {/* Overall Summary */}
      <div className="rounded-md border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground">Overall Occupancy</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div>
            <p className="text-xs text-muted-foreground">Total Rooms</p>
            <p className="mt-1 text-2xl font-bold">{summary.totalRooms}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Occupied</p>
            <p className="mt-1 text-2xl font-bold text-rose-600">{summary.occupiedRooms}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{summary.availableRooms}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reserved</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{summary.reservedRooms}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Occupancy Rate</p>
            <p className={`mt-1 text-2xl font-bold ${getOccupancyColor(summary.occupancyRate)}`}>
              {summary.occupancyRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Block Breakdown */}
      <div className="grid gap-3 md:grid-cols-2">
        {blockData.map((block) => (
          <div key={block.block} className="rounded-md border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Block {block.block}</p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  block.occupancyRate < 50
                    ? "bg-emerald-100 text-emerald-800"
                    : block.occupancyRate < 80
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                }`}
              >
                {block.occupancyRate}%
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {block.occupiedRooms} of {block.totalRooms} rooms occupied
            </p>
            {/* Progress bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${block.occupancyRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
