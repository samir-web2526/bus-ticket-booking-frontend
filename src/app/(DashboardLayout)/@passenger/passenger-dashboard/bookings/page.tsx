import React from 'react'

import AllBookingsClient from '@/src/components/Pages/DashboardPages/PassengerDashboardPages/AllBookings'
import { getMyBookings } from '@/src/services/dashboard-services/bookings'
export const dynamic = 'force-dynamic'
export default async function Bookings() {
  const bookings = await getMyBookings();
  console.log(bookings);
  return (
    <div>
        <AllBookingsClient bookings={bookings.data || []} error={bookings.error} />
    </div>
  )
}
