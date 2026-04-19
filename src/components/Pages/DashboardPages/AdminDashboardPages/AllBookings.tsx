 import { getAllBookings } from '@/src/services/dashboard-services/bookings'
import React from 'react'
 
 export default async function AllBookings() {
  const bookings = await getAllBookings();
  console.log(bookings);
   return (
     <div>AllBookings: {bookings.data?.data?.length}</div>
   )
 }
 