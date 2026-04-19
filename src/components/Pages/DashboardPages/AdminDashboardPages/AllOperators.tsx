
import { getAllUsers } from '@/src/services/dashboard-services/operators';
import React from 'react'

export default async function AllOperators() {
  const operators = await getAllUsers("OPERATOR");
  console.log(operators);
  return (
    <div>AllOperators:{operators.data?.length}</div>
  )
}
