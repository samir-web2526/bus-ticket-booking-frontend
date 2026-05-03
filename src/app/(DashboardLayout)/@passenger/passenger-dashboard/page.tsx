// passenger-dashboard/page.tsx — Server Component (data fetch করে Client এ pass করে)
import PassengerDashboardClient from '@/src/components/Pages/DashboardPages/PassengerDashboardPages/PassengerDashboardClient';
import { getMyBookings } from '@/src/services/dashboard-services/bookings';


export default async function PassengerDashboardPage() {
  const res = await getMyBookings();

  const bookings = Array.isArray(res?.data?.data)
    ? res.data.data
    : Array.isArray(res?.data)
    ? res.data
    : [];

  return <PassengerDashboardClient bookings={bookings} />;
}