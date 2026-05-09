
import PassengerDashboardClient from '@/src/components/Pages/DashboardPages/PassengerDashboardPages/PassengerDashboardClient';
import { getMyBookings } from '@/src/services/dashboard-services/bookings';
export const dynamic = "force-dynamic";

export default async function PassengerDashboardPage() {
  const res = await getMyBookings();

  const bookings = Array.isArray(res?.data?.data)
    ? res.data.data
    : Array.isArray(res?.data)
    ? res.data
    : [];

  return <PassengerDashboardClient bookings={bookings} />;
}