import { getAllUsers } from '@/src/services/dashboard-services/operators'
import React from 'react'

export default async function AllPassangers() {
  const passengers = await getAllUsers("PASSENGER");
  console.log(passengers);
  return (
    <div>AllPassangers:{passengers.data?.length}</div>
  )
}
