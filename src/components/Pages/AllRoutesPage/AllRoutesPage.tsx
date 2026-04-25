import { getAllRoutes } from '@/src/services/routes.service'
import React from 'react'

export default async function AllRoutesPage() {
    const routes = await getAllRoutes();
  return (
    <div>AllRoutesPage: {routes.data?.length ?? 0}</div>
  )
}
