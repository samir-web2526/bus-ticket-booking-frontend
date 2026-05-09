/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminDashboardClient from '@/src/components/Pages/DashboardPages/AdminDashboardPages/AdminDashboardClient';
import { getAllBuses } from '@/src/services/buses.service';
import { getAllUsers } from '@/src/services/dashboard-services/operators';
import { getAllRoutes } from '@/src/services/routes.service';
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [busesRes, operatorsRes, passengersRes, routesRes] = await Promise.all([
    getAllBuses(),
    getAllUsers('OPERATOR'),
    getAllUsers('PASSENGER'),
    getAllRoutes({ limit: 100 }),
  ]);

  const buses = busesRes.data?.data ?? [];
  const operators = (operatorsRes.data ?? []).filter((u: any) => u.role === 'OPERATOR');
  const passengers = (passengersRes.data ?? []).filter((u: any) => u.role === 'PASSENGER');
  const routes = routesRes.data ?? [];

  const activeBuses = buses.filter((b: any) => b.isActive && !b.isDeleted).length;
  const inactiveBuses = buses.filter((b: any) => !b.isActive && !b.isDeleted).length;
  const deletedBuses = buses.filter((b: any) => b.isDeleted).length;

  const activeOperators = operators.filter((o: any) => o.status === 'ACTIVE').length;
  const verifiedPassengers = passengers.filter((p: any) => p.isVerified).length;
  const routesWithSchedules = routes.filter((r: any) => r.schedules?.length > 0).length;

  const busTypeCount: Record<string, number> = {};
  buses.forEach((b: any) => {
    busTypeCount[b.type] = (busTypeCount[b.type] || 0) + 1;
  });

  const operatorBusMap: Record<string, { name: string; count: number }> = {};
  buses.forEach((b: any) => {
    const opId = b.operatorId;
    const opName = b.operator?.name ?? 'Unknown';
    if (!operatorBusMap[opId]) operatorBusMap[opId] = { name: opName, count: 0 };
    operatorBusMap[opId].count += 1;
  });
  const topOperators = Object.values(operatorBusMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const routesByDistance = [...routes].sort(
    (a: any, b: any) => (b.schedules?.length || 0) - (a.schedules?.length || 0)
  ).slice(0, 6);

  const joinedByMonth: Record<string, number> = {};
  passengers.forEach((p: any) => {
    const month = new Date(p.createdAt).toLocaleString('en-BD', { month: 'short', year: '2-digit' });
    joinedByMonth[month] = (joinedByMonth[month] || 0) + 1;
  });
  const passengerMonths = Object.keys(joinedByMonth).slice(-6);
  const passengerCounts = passengerMonths.map((m) => joinedByMonth[m]);

  const pricePerSeatAvg =
    buses.length > 0
      ? Math.round(buses.reduce((s: number, b: any) => s + (b.pricePerSeat || 0), 0) / buses.length)
      : 0;

  return (
    <AdminDashboardClient
      stats={{
        totalBuses: buses.length,
        activeBuses,
        inactiveBuses,
        deletedBuses,
        totalOperators: operators.length,
        activeOperators,
        totalPassengers: passengers.length,
        verifiedPassengers,
        totalRoutes: routes.length,
        routesWithSchedules,
        avgPricePerSeat: pricePerSeatAvg,
      }}
      busTypeCount={busTypeCount}
      topOperators={topOperators}
      routesBySchedules={routesByDistance.map((r: any) => ({
        label: `${r.sourceCity}–${r.destinationCity}`,
        schedules: r.schedules?.length || 0,
        distance: r.distanceKm,
      }))}
      passengerGrowth={{ months: passengerMonths, counts: passengerCounts }}
      recentOperators={operators.slice(0, 5).map((o: any) => ({
        name: o.name,
        email: o.email,
        status: o.status,
        isVerified: o.isVerified,
        joinedAt: o.createdAt,
      }))}
    />
  );
}