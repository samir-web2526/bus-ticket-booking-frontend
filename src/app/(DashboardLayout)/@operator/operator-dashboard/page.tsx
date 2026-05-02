/* eslint-disable @typescript-eslint/no-explicit-any */
import OperatorDashboardClient from '@/src/components/Pages/DashboardPages/OperatorDashboardPages/OperatorDashboardClient';
import { getOperatorBuses } from '@/src/services/buses.service';
import { getOperatorPassengers } from '@/src/services/passengers.sevice';


export default async function OperatorDashboardPage() {
  const [busesRes, passengersRes] = await Promise.all([
    getOperatorBuses(),
    getOperatorPassengers({ page: 1, limit: 100 }),
  ]);

  // ── Buses ────────────────────────────────────────────────────────────────
  const rawBuses = busesRes?.data;
  const buses: any[] = Array.isArray(rawBuses)
    ? rawBuses
    : Array.isArray(rawBuses?.data)
    ? rawBuses.data
    : Array.isArray(rawBuses?.buses)
    ? rawBuses.buses
    : [];

  const activeBuses = buses.filter((b) => b.isActive && !b.isDeleted);
  const inactiveBuses = buses.filter((b) => !b.isActive && !b.isDeleted);

  // Bus type breakdown
  const busTypeCount: Record<string, number> = {};
  buses.forEach((b) => {
    busTypeCount[b.type] = (busTypeCount[b.type] || 0) + 1;
  });

  // Total seats & avg price
  const totalSeats = buses.reduce((s, b) => s + (b.totalSeats || 0), 0);
  const avgPrice =
    buses.length > 0
      ? Math.round(buses.reduce((s, b) => s + (b.pricePerSeat || 0), 0) / buses.length)
      : 0;

  // Recent 5 buses
  const recentBuses = [...buses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((b) => ({
      id: b.id,
      name: b.name,
      number: b.number,
      type: b.type,
      totalSeats: b.totalSeats,
      pricePerSeat: b.pricePerSeat,
      isActive: b.isActive,
    }));

  // ── Passengers ───────────────────────────────────────────────────────────
  const passengersData = passengersRes?.data;
  const passengers: any[] = Array.isArray(passengersData?.data)
    ? passengersData.data
    : Array.isArray(passengersData)
    ? passengersData
    : [];
  const totalPassengers = passengersData?.meta?.total ?? passengers.length;

  const verifiedPassengers = passengers.filter((p) => p.isVerified).length;
  const activePassengers = passengers.filter((p) => p.status === 'ACTIVE').length;

  // Passenger join by month (last 6 months)
  const joinedByMonth: Record<string, number> = {};
  passengers.forEach((p) => {
    if (!p.createdAt) return;
    const d = new Date(p.createdAt);
    const key = d.toLocaleString('en-BD', { month: 'short', year: '2-digit' });
    joinedByMonth[key] = (joinedByMonth[key] || 0) + 1;
  });
  const growthMonths = Object.keys(joinedByMonth).slice(-6);
  const growthCounts = growthMonths.map((m) => joinedByMonth[m]);

  // Recent 5 passengers
  const recentPassengers = [...passengers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone ?? null,
      status: p.status,
      isVerified: p.isVerified,
      gender: p.gender ?? null,
      joinedAt: p.createdAt,
    }));

  return (
    <OperatorDashboardClient
      stats={{
        totalBuses: buses.length,
        activeBuses: activeBuses.length,
        inactiveBuses: inactiveBuses.length,
        totalSeats,
        avgPrice,
        totalPassengers,
        verifiedPassengers,
        activePassengers,
      }}
      busTypeCount={busTypeCount}
      recentBuses={recentBuses}
      passengerGrowth={{ months: growthMonths, counts: growthCounts }}
      recentPassengers={recentPassengers}
    />
  );
}