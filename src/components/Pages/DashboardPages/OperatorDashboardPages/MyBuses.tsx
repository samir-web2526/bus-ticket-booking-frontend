import { getOperatorBuses } from '@/src/services/buses.service'
import React from 'react'

export default async function MyBuses() {
  const buses = await getOperatorBuses();
  console.log(buses);
  return (
    <div>MyBuses: {buses.data?.data?.length}</div>
  )
}
