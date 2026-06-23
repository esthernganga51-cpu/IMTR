import { fetchHostelOccupancy } from "@/features/hostel-management/actions/fetch-occupancy";
import { HostelBookingAdmin } from "@/features/hostel-management/components/hostel-booking-admin";

export default async function HostelBookingPage() {
  const data = await fetchHostelOccupancy();

  return <HostelBookingAdmin initialData={data} />;
}
