/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bus, Users, CheckCircle2, ArrowRight, Armchair, Activity } from 'lucide-react';
import Link from 'next/link';

const TYPE_LABEL: Record<string, string> = {
  AC: 'AC',
  NON_AC: 'Non-AC',
  SLEEPER: 'Sleeper',
  DOUBLE_DECKER: 'Double Decker',
};

const COLORS = ['#1f2937', '#6b7280', '#9ca3af', '#d1d5db'];

interface Props {
  stats: {
    totalBuses: number;
    activeBuses: number;
    inactiveBuses: number;
    totalSeats: number;
    avgPrice: number;
    totalPassengers: number;
    verifiedPassengers: number;
    activePassengers: number;
  };
  busTypeCount: Record<string, number>;
  recentBuses: {
    id: string;
    name: string;
    number: string;
    type: string;
    totalSeats: number;
    pricePerSeat: number;
    isActive: boolean;
  }[];
  passengerGrowth: { months: string[]; counts: number[] };
  recentPassengers: {
    id: string;
    name: string;
    email: string;
    status: string;
    isVerified: boolean;
    joinedAt: string;
  }[];
}

export default function OperatorDashboardClient({
  stats,
  busTypeCount,
  recentBuses,
  passengerGrowth,
  recentPassengers,
}: Props) {
  const donutRef = useRef<HTMLCanvasElement>(null);
  const fleetRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const charts = useRef<any[]>([]);

  useEffect(() => {
    const init = () => {
      const C = (window as any).Chart;
      if (!C) return;
      charts.current.forEach((c) => c.destroy());
      charts.current = [];

      const keys = Object.keys(busTypeCount);

      if (donutRef.current && keys.length > 0)
        charts.current.push(
          new C(donutRef.current, {
            type: 'doughnut',
            data: {
              labels: keys.map((k) => TYPE_LABEL[k] ?? k),
              datasets: [
                {
                  data: keys.map((k) => busTypeCount[k]),
                  backgroundColor: COLORS,
                  borderWidth: 2,
                  borderColor: '#ffffff',
                  hoverOffset: 6,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '72%',
              plugins: { legend: { display: false } },
            },
          })
        );

      if (fleetRef.current)
        charts.current.push(
          new C(fleetRef.current, {
            type: 'doughnut',
            data: {
              labels: ['Active', 'Inactive'],
              datasets: [
                {
                  data: [stats.activeBuses, stats.inactiveBuses],
                  backgroundColor: ['#1f2937', '#e5e7eb'],
                  borderWidth: 2,
                  borderColor: '#ffffff',
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '72%',
              plugins: { legend: { display: false } },
            },
          })
        );

      if (barRef.current && passengerGrowth.months.length > 0)
        charts.current.push(
          new C(barRef.current, {
            type: 'bar',
            data: {
              labels: passengerGrowth.months,
              datasets: [
                {
                  data: passengerGrowth.counts,
                  backgroundColor: 'rgba(31,41,55,0.12)',
                  borderColor: '#1f2937',
                  borderWidth: 2,
                  borderRadius: 6,
                  borderSkipped: false,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  ticks: { color: '#9ca3af', font: { size: 11 } },
                  grid: { display: false },
                },
                y: {
                  beginAtZero: true,
                  ticks: { color: '#9ca3af', font: { size: 11 } },
                  grid: { color: 'rgba(0,0,0,0.05)' },
                },
              },
            },
          })
        );
    };

    if ((window as any).Chart) {
      init();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.onload = init;
    document.head.appendChild(s);
    return () => {
      charts.current.forEach((c) => c.destroy());
    };
  }, [busTypeCount, stats, passengerGrowth]);

  const typeKeys = Object.keys(busTypeCount);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10 relative overflow-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">
              Operator Panel
            </p>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
              My <span className="text-gray-500">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-700 text-sm font-semibold">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Bus,
              label: 'Total Buses',
              value: stats.totalBuses,
              sub: `${stats.activeBuses} active · ${stats.inactiveBuses} inactive`,
              accent: true,
            },
            {
              icon: Armchair,
              label: 'Total Seats',
              value: stats.totalSeats.toLocaleString(),
              sub: `Avg ৳${stats.avgPrice} / seat`,
              accent: false,
            },
            {
              icon: Users,
              label: 'Passengers',
              value: stats.totalPassengers.toLocaleString(),
              sub: `${stats.activePassengers} active`,
              accent: false,
            },
            {
              icon: CheckCircle2,
              label: 'Verified',
              value: stats.verifiedPassengers,
              sub: `of ${stats.totalPassengers} total`,
              accent: false,
            },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl p-5 border transition-colors ${
                c.accent
                  ? 'bg-gray-900 border-gray-900'
                  : 'bg-gray-50 border-gray-100 hover:border-gray-200'
              }`}
            >
              <c.icon className={`w-5 h-5 mb-3 ${c.accent ? 'text-gray-300' : 'text-gray-400'}`} />
              <p className={`font-black text-2xl ${c.accent ? 'text-white' : 'text-gray-900'}`}>
                {c.value}
              </p>
              <p className={`text-xs mt-1 ${c.accent ? 'text-gray-400' : 'text-gray-400'}`}>
                {c.label}
              </p>
              <p className={`text-xs mt-0.5 font-medium ${c.accent ? 'text-gray-300' : 'text-gray-500'}`}>
                {c.sub}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-gray-900 font-semibold text-sm mb-1">Bus Types</p>
            <p className="text-gray-400 text-xs mb-4">How many of each type</p>
            <div className="relative h-44">
              {typeKeys.length > 0 ? (
                <canvas ref={donutRef} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-sm">
                  No buses yet
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
              {typeKeys.map((k, i) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-400 text-xs">
                    {TYPE_LABEL[k] ?? k} ({busTypeCount[k]})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-gray-900 font-semibold text-sm mb-1">Bus Status</p>
            <p className="text-gray-400 text-xs mb-4">Active vs inactive</p>
            <div className="relative h-44">
              <canvas ref={fleetRef} />
            </div>
            <div className="flex gap-6 mt-4">
              {[
                { label: 'Active', val: stats.activeBuses, color: '#1f2937' },
                { label: 'Inactive', val: stats.inactiveBuses, color: '#e5e7eb' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full border border-gray-200"
                    style={{ background: s.color }}
                  />
                  <span className="text-gray-400 text-xs">
                    {s.label} ({s.val})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-gray-900 font-semibold text-sm mb-1">New Passengers</p>
            <p className="text-gray-400 text-xs mb-4">Sign-ups per month</p>
            <div className="relative h-44">
              {passengerGrowth.months.length > 0 ? (
                <canvas ref={barRef} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-sm">
                  No data yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="text-gray-900 font-semibold text-sm">Recent Buses</p>
              <Link
                href="/operator-dashboard/buses"
                className="text-gray-400 text-xs hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentBuses.length === 0 ? (
              <p className="text-gray-300 text-sm text-center py-12">No buses yet</p>
            ) : (
              recentBuses.map((bus) => (
                <div
                  key={bus.id}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Bus className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">{bus.name}</p>
                    <p className="text-gray-400 text-xs">#{bus.number} · {bus.totalSeats} seats</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-900 text-sm font-bold">৳{bus.pricePerSeat}</p>
                    <p className={`text-xs ${bus.isActive ? 'text-emerald-600' : 'text-red-400'}`}>
                      {bus.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="text-gray-900 font-semibold text-sm">Recent Passengers</p>
              <Link
                href="/operator-dashboard/my-passengers"
                className="text-gray-400 text-xs hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentPassengers.length === 0 ? (
              <p className="text-gray-300 text-sm text-center py-12">No passengers yet</p>
            ) : (
              recentPassengers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-600 font-bold text-sm">
                    {p.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-gray-900 text-sm font-medium truncate">{p.name}</p>
                      {p.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs truncate">{p.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {p.status === 'ACTIVE'
                        ? 'Active'
                        : p.status === 'SUSPENDED'
                        ? 'Suspended'
                        : 'Inactive'}
                    </span>
                    <p className="text-gray-300 text-xs mt-1">
                      {new Date(p.joinedAt).toLocaleDateString('en-BD', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {[
            { label: 'My Buses', href: '/operator-dashboard/buses', icon: Bus },
            { label: 'My Passengers', href: '/operator-dashboard/my-passengers', icon: Users },
            { label: 'Bookings', href: '/operator-dashboard/bookings', icon: Activity },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-400 hover:bg-gray-100 transition-all group"
            >
              <div className="flex items-center gap-2">
                <link.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                <span className="text-gray-600 group-hover:text-gray-900 text-sm font-medium transition-colors">
                  {link.label}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}