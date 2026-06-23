import { AdminShell } from "@/features/admin-dashboard/components/admin-shell";
import HostelBookingPage from "@/features/hostel-management/components/hostel-booking-page";

export const metadata = {
  title: "Hostel Booking | IMTR Admin Portal",
  description: "Manage hostel room availability and student bookings",
};

export default function Page() {
  return (
    <AdminShell>
      <HostelBookingPage />
    </AdminShell>
  );
}
