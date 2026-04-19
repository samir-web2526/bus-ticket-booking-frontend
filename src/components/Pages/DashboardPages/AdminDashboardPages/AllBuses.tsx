import { getAllBuses } from '@/src/services/buses.service';
import React from 'react'

export default async function AllBuses() {
    const buses = await getAllBuses();
    console.log(buses);
  return (
    <div>AllBuses:{buses.data?.data?.length}</div>
  )
}
