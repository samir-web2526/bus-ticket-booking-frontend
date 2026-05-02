'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Bus,
  Users,
  Activity,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Armchair,
  BadgeDollarSign,
  ArrowRight,
  Circle,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  totalBuses: number;
  activeBuses: number;
  inactiveBuses: number;
  totalSeats: number;
  avgPrice: number;
  totalPassengers: number;
  verifiedPassengers: number;
  activePassengers: number;
}

interface RecentBus {
  id: string;
  name: string;
  number: string;
  type: string;
  totalSeats: number;
  pricePerSeat: number;
  isActive: boolean;
}

interface RecentPassenger {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  isVerified: boolean;
  gender: string | null;
  joinedAt: string;
}

interface Props {
  stats: Stats;
  busTypeCount: Record<string, number>;
  recentBuses: RecentBus[];
  passengerGrowth: { months: string[]; counts: number[] };
  recentPassengers: RecentPassenger[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const typeLabel: Record<string, string> = {
  AC: 'AC',
  NON_AC: 'Non-AC',
  SLEEPER: 'Sleeper',
  DOUBLE_DECKER: 'Double Decker',
};

const typeTag: Record<string, { label: string; cls: string }> = {
  AC: { label: 'Premium', cls: 'bg-rose-400/10 text-rose-400 border-rose-400/30' },
  NON_AC: { label: 'Budget', cls: 'bg-green-400/10 text-green-400 border-green-400/30' },
  SLEEPER: { label: 'Luxury', cls: 'bg-purple-400/10 text-purple-400 border-purple-400/30' },
  DOUBLE_DECKER: { label: 'Special', cls: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30' },
};

const typeColors = ['#f59e0b', '#3b82f6', '#a78bfa', '#22c55e'];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconCls,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  iconCls: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-amber-400/20 transition-colors duration-300"
    >
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${iconCls}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">{label}</p>
      <p className="text-white font-black text-3xl leading-none mb-1">{value}</p>
      <p className="text-slate-500 text-xs">{sub}</p>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OperatorDashboardClient({
  stats,
  busTypeCount,
  recentBuses,
  passengerGrowth,
  recentPassengers,
}: Props) {
  const busTypeRef = useRef<HTMLCanvasElement>(null);
  const fleetRef = useRef<HTMLCanvasElement>(null);
  const growthRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<any[]>([]);

  useEffect(() => {
    const existing = document.getElementById('chartjs-cdn-op');
    if (existing) {
      initCharts();
    } else {
      const s = document.createElement('script');
      s.id = 'chartjs-cdn-op';
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      s.onload = initCharts;
      document.head.appendChild(s);
    }

    function initCharts() {
      const Chart = (window as any).Chart;
      if (!Chart) return;
      chartInstances.current.forEach((c) => c.destroy());
      chartInstances.current = [];

      const grid = 'rgba(255,255,255,0.05)';
      const tick = '#64748b';

      // 1. Bus type donut
      if (busTypeRef.current) {
        const keys = Object.keys(busTypeCount);
        chartInstances.current.push(
          new Chart(busTypeRef.current, {
            type: 'doughnut',
            data: {
              labels: keys.map((k) => typeLabel[k] ?? k),
              datasets: [
                {
                  data: keys.map((k) => busTypeCount[k]),
                  backgroundColor: typeColors,
                  borderWidth: 2,
                  borderColor: '#07111f',
                  hoverOffset: 8,
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
      }

      // 2. Fleet status donut
      if (fleetRef.current) {
        chartInstances.current.push(
          new Chart(fleetRef.current, {
            type: 'doughnut',
            data: {
              labels: ['Active', 'Inactive'],
              datasets: [
                {
                  data: [stats.activeBuses, stats.inactiveBuses],
                  backgroundColor: ['#22c55e', '#f43f5e'],
                  borderWidth: 2,
                  borderColor: '#07111f',
                  hoverOffset: 8,
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
      }

      // 3. Passenger growth line
      if (growthRef.current && passengerGrowth.months.length > 0) {
        chartInstances.current.push(
          new Chart(growthRef.current, {
            type: 'bar',
            data: {
              labels: passengerGrowth.months,
              datasets: [
                {
                  label: 'New Passengers',
                  data: passengerGrowth.counts,
                  backgroundColor: 'rgba(245,158,11,0.25)',
                  borderColor: '#f59e0b',
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
                x: { ticks: { color: tick, font: { size: 11 } }, grid: { display: false } },
                y: {
                  beginAtZero: true,
                  ticks: { color: tick, font: { size: 11 } },
                  grid: { color: grid },
                },
              },
            },
          })
        );
      }
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
      chartInstances.current = [];
    };
  }, [busTypeCount, stats, passengerGrowth]);

  const typeKeys = Object.keys(busTypeCount);

  return (
    <div className="min-h-screen bg-[#07111f] relative overflow-hidden p-6 lg:p-10">
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
              — Operator Panel
            </p>
            <h1 className="text-4xl lg:text-5xl font-black text-white">
              My <span className="text-amber-400">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              Fleet overview, passengers & analytics
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-400/10 border border-green-400/20 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">Live Data</span>
          </div>
        </motion.div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Bus}
            label="Total Buses"
            value={stats.totalBuses}
            sub={`${stats.activeBuses} active · ${stats.inactiveBuses} inactive`}
            iconCls="bg-amber-400/10 border-amber-400/20 text-amber-400"
            delay={0}
          />
          <StatCard
            icon={Armchair}
            label="Total Seats"
            value={stats.totalSeats.toLocaleString()}
            sub={`Avg ৳${stats.avgPrice} / seat`}
            iconCls="bg-blue-400/10 border-blue-400/20 text-blue-400"
            delay={0.05}
          />
          <StatCard
            icon={Users}
            label="Passengers"
            value={stats.totalPassengers.toLocaleString()}
            sub={`${stats.activePassengers} active`}
            iconCls="bg-green-400/10 border-green-400/20 text-green-400"
            delay={0.1}
          />
          <StatCard
            icon={CheckCircle2}
            label="Verified"
            value={stats.verifiedPassengers}
            sub={`of ${stats.totalPassengers} passengers`}
            iconCls="bg-purple-400/10 border-purple-400/20 text-purple-400"
            delay={0.15}
          />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Bus type donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
          >
            <p className="text-white font-bold text-sm mb-1">Bus Type Breakdown</p>
            <p className="text-slate-500 text-xs mb-5">Your fleet composition</p>
            <div className="relative h-44">
              {typeKeys.length > 0 ? (
                <canvas ref={busTypeRef} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-600 text-sm">No buses yet</p>
                </div>
              )}
            </div>
            {typeKeys.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                {typeKeys.map((k, i) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: typeColors[i] ?? '#888' }}
                    />
                    <span className="text-slate-400 text-xs">
                      {typeLabel[k] ?? k} ({busTypeCount[k]})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Fleet status donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
          >
            <p className="text-white font-bold text-sm mb-1">Fleet Status</p>
            <p className="text-slate-500 text-xs mb-5">Active vs inactive buses</p>
            <div className="relative h-44">
              <canvas ref={fleetRef} />
            </div>
            <div className="flex gap-6 mt-4">
              {[
                { label: 'Active', val: stats.activeBuses, color: '#22c55e' },
                { label: 'Inactive', val: stats.inactiveBuses, color: '#f43f5e' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-400 text-xs">
                    {s.label} ({s.val})
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Passenger growth bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
          >
            <p className="text-white font-bold text-sm mb-1">Passenger Growth</p>
            <p className="text-slate-500 text-xs mb-5">New sign-ups by month</p>
            <div className="relative h-44">
              {passengerGrowth.months.length > 0 ? (
                <canvas ref={growthRef} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-600 text-sm">No data yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Buses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Recent Buses</p>
                <p className="text-slate-500 text-xs mt-0.5">Latest additions to your fleet</p>
              </div>
              <Link
                href="/operator-dashboard/buses"
                className="flex items-center gap-1 text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {recentBuses.length === 0 ? (
                <div className="py-12 text-center">
                  <Bus className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No buses yet</p>
                </div>
              ) : (
                recentBuses.map((bus, i) => {
                  const tag = typeTag[bus.type];
                  return (
                    <motion.div
                      key={bus.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Bus className="w-4 h-4" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-semibold truncate">{bus.name}</p>
                          {tag && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tag.cls} shrink-0`}>
                              {tag.label}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5">
                          #{bus.number} · {bus.totalSeats} seats
                        </p>
                      </div>
                      {/* Price + status */}
                      <div className="text-right shrink-0">
                        <p className="text-amber-400 font-black text-sm">৳{bus.pricePerSeat}</p>
                        <span
                          className={`text-[10px] font-bold ${
                            bus.isActive ? 'text-green-400' : 'text-rose-400'
                          }`}
                        >
                          {bus.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Recent Passengers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Recent Passengers</p>
                <p className="text-slate-500 text-xs mt-0.5">Latest registered passengers</p>
              </div>
              <Link
                href="/operator-dashboard/passengers"
                className="flex items-center gap-1 text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {recentPassengers.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No passengers yet</p>
                </div>
              ) : (
                recentPassengers.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 font-black text-sm shrink-0">
                      {p.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                        {p.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5 truncate">{p.email}</p>
                    </div>
                    {/* Status + date */}
                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'ACTIVE'
                            ? 'bg-green-400/10 text-green-400'
                            : p.status === 'SUSPENDED'
                            ? 'bg-rose-400/10 text-rose-400'
                            : 'bg-slate-400/10 text-slate-400'
                        }`}
                      >
                        {p.status}
                      </span>
                      <p className="text-slate-600 text-[10px] mt-0.5">
                        {new Date(p.joinedAt).toLocaleDateString('en-BD', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Quick Links ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: 'My Buses', href: '/operator-dashboard/buses', icon: Bus, cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
            { label: 'My Passengers', href: '/operator-dashboard/passengers', icon: Users, cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
            { label: 'Bookings', href: '/operator-dashboard/bookings', icon: Activity, cls: 'text-green-400 bg-green-400/10 border-green-400/20' },
            { label: 'Add Bus', href: '/operator-dashboard/create-bus', icon: TrendingUp, cls: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 hover:border-amber-400/30 hover:bg-white/[0.05] transition-all duration-200 group"
              >
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${link.cls}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-slate-300 text-sm font-semibold group-hover:text-white transition-colors">
                  {link.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 ml-auto transition-colors" />
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}