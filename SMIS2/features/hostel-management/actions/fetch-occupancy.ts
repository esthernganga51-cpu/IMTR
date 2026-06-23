"use server";

import { getHostelOccupancyFromDb } from "@/features/hostel-management/data/hostel-db";

export async function fetchHostelOccupancy() {
  return await getHostelOccupancyFromDb();
}
