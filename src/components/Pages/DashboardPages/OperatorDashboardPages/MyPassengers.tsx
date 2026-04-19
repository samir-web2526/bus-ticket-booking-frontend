import { getOperatorBookings } from '@/src/services/dashboard-services/bookings'
import React from 'react'

export default async function MyPassengers() {
  const bookings = await getOperatorBookings();
  console.log(bookings);
  return (
    <div>
      <h1>My Passengers:{bookings.data?.data?.length ?? 0}</h1>
    </div>
  )
}
