import { getMyBookings } from '@/src/services/dashboard-services/bookings'
import React from 'react'

export default async function AllMyBookings() {
  const bookings = await getMyBookings();
  console.log(bookings);
  return (
    <div>AllBookings:{bookings.data?.length}</div>
  )
}
