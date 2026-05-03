// passenger-dashboard/PassengerDashboardClient.tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket, CheckCircle2, Clock, XCircle, CreditCard,
  MapPin, BusFront, ArrowRight, Banknote, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingSeat {
  id: string;
  seat: { number: string; type: string; price: number };
}

interface Payment {
  status: 'PAID' | 'UNPAID';
  amount: number;
  paidAt: string | null;
}

interface Booking {
  id: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
  totalFare: number;
  createdAt: string;
  bookingSeats: BookingSeat[];
  payment: Payment | null;
  schedule: {
    departure: string;
    arrival: string;
    bus: { name: string; number: string; type: string };
    route: { sourceCity: string; destinationCity: string };
  };
}

interface Props { bookings: Booking[] }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; cls: string; dot: string; icon: React.ElementType }> = {
  CONFIRMED: { label: 'Confirmed', cls: 'bg-green-400/10 text-green-400 border-green-400/20', dot: 'bg-green-400',  icon: CheckCircle2 },
  PENDING:   { label: 'Pending',   cls: 'bg-amber-400/10 text-amber-400 border-amber-400/20', dot: 'bg-amber-400',  icon: Clock        },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-400/10   text-red-400   border-red-400/20',   dot: 'bg-red-400',    icon: XCircle      },
 EXPIRED: { label: 'Completed', cls: 'bg-blue-400/10  text-blue-400  border-blue-400/20',  dot: 'bg-blue-400',   icon: CheckCircle2 },
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-BD', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-BD', { month: 'short', day: 'numeric' });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PassengerDashboardClient({ bookings }: Props) {
  const barRef = useRef<HTMLCanvasElement>(null);
  const donutRef = useRef<HTMLCanvasElement>(null);
  const charts = useRef<any[]>([]);

  const confirmed  = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pending    = bookings.filter(b => b.status === 'PENDING').length;
  const cancelled  = bookings.filter(b => b.status === 'CANCELLED').length;
  const expired  = bookings.filter(b => b.status === 'EXPIRED').length;
  const totalSpent = bookings.filter(b => b.payment?.status === 'PAID').reduce((s, b) => s + b.totalFare, 0);
  const recentBookings = [...bookings].slice(0, 5);

  // Monthly booking count for bar chart
  const monthlyMap: Record<string, number> = {};
  bookings.forEach(b => {
    const m = new Date(b.createdAt).toLocaleDateString('en-BD', { month: 'short', year: '2-digit' });
    monthlyMap[m] = (monthlyMap[m] ?? 0) + 1;
  });
  const months = Object.keys(monthlyMap).slice(-6);
  const monthlyCounts = months.map(m => monthlyMap[m]);

  useEffect(() => {
    const init = () => {
      const C = (window as any).Chart;
      if (!C) return;
      charts.current.forEach(c => c.destroy());
      charts.current = [];

      // Bar chart — monthly bookings
      if (barRef.current && months.length > 0)
        charts.current.push(new C(barRef.current, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              data: monthlyCounts,
              backgroundColor: 'rgba(245,158,11,0.25)',
              borderColor: '#f59e0b',
              borderWidth: 2,
              borderRadius: 6,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { display: false } },
              y: { beginAtZero: true, ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } },
            },
          },
        }));

      // Donut chart — booking status breakdown
      if (donutRef.current && bookings.length > 0)
        charts.current.push(new C(donutRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
            datasets: [{
              data: [confirmed, pending, cancelled, expired],
              backgroundColor: ['#22c55e', '#f59e0b', '#f43f5e', '#3b82f6'],
              borderWidth: 2,
              borderColor: '#07111f',
              hoverOffset: 6,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '72%',
            plugins: { legend: { display: false } },
          },
        }));
    };

    if ((window as any).Chart) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.onload = init;
    document.head.appendChild(s);
    return () => { charts.current.forEach(c => c.destroy()); };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-[#07111f] p-6 lg:p-10">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,180,0,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,180,0,0.2) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">Passenger Panel</p>
            <h1 className="text-3xl lg:text-4xl font-black text-white">My <span className="text-amber-400">Dashboard</span></h1>
          </div>
          <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-xl">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold">{bookings.length} Bookings</span>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Ticket,      label: 'Total Bookings', value: bookings.length, sub: 'all time',             color: 'text-amber-400' },
            { icon: CheckCircle2,label: 'Expireds',       value: confirmed,       sub: `${expired} expired`, color: 'text-green-400' },
            { icon: Clock,       label: 'Pending',         value: pending,         sub: 'awaiting payment',    color: 'text-amber-400' },
            { icon: CreditCard,  label: 'Total Spent',     value: `৳${totalSpent.toLocaleString()}`, sub: 'paid bookings', color: 'text-blue-400' },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors"
            >
              <c.icon className={`w-5 h-5 mb-3 ${c.color}`} />
              <p className="text-white font-black text-2xl">{c.value}</p>
              <p className="text-slate-500 text-xs mt-1">{c.label}</p>
              <p className={`text-xs mt-0.5 ${c.color}`}>{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Bar — Monthly Activity */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <p className="text-white font-semibold text-sm">Booking Activity</p>
            </div>
            <p className="text-slate-500 text-xs mb-4">Monthly bookings (last 6 months)</p>
            <div className="relative h-44">
              {months.length > 0
                ? <canvas ref={barRef} />
                : <div className="flex items-center justify-center h-full text-slate-600 text-sm">No data yet</div>
              }
            </div>
          </div>

          {/* Donut — Status Breakdown */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-1">Status Breakdown</p>
            <p className="text-slate-500 text-xs mb-4">All booking statuses</p>
            <div className="relative h-44">
              {bookings.length > 0
                ? <canvas ref={donutRef} />
                : <div className="flex items-center justify-center h-full text-slate-600 text-sm">No bookings yet</div>
              }
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
              {[
                { label: 'Confirmed', color: '#22c55e', val: confirmed },
                { label: 'Pending',   color: '#f59e0b', val: pending   },
                { label: 'Cancelled', color: '#f43f5e', val: cancelled },
                { label: 'Completed', color: '#3b82f6', val: expired },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-slate-400 text-xs">{s.label} ({s.val})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <p className="text-white font-semibold text-sm">Recent Bookings</p>
            <Link
              href="/passenger-dashboard/bookings"
              className="text-amber-400 text-xs hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentBookings.length === 0
            ? <p className="text-slate-600 text-sm text-center py-12">No bookings yet</p>
            : recentBookings.map((b, i) => {
              const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING;
              const StatusIcon = cfg.icon;
              const isPaid = b.payment?.status === 'PAID';

              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
                    <BusFront className="w-4 h-4 text-amber-400" />
                  </div>

                  {/* Route */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <p className="text-white text-sm font-semibold truncate">
                        {b.schedule.route.sourceCity} → {b.schedule.route.destinationCity}
                      </p>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {b.schedule.bus.name} · {fmt(b.schedule.departure)}
                    </p>
                  </div>

                  {/* Fare */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-amber-400 text-sm font-bold">৳{b.totalFare.toLocaleString()}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Banknote className="w-3 h-3" style={{ color: isPaid ? '#4ade80' : '#f87171' }} />
                      <span className="text-xs" style={{ color: isPaid ? '#4ade80' : '#f87171' }}>
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0 ${cfg.cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>

                  {/* Date */}
                  <p className="text-slate-600 text-xs shrink-0 hidden lg:block">{fmtDate(b.createdAt)}</p>
                </motion.div>
              );
            })}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'My Bookings',  href: '/passenger-dashboard/bookings', icon: Ticket,      color: 'text-amber-400' },
            { label: 'Find a Bus',   href: '/find-buses',                    icon: BusFront,    color: 'text-blue-400'  },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-2">
                <link.icon className={`w-4 h-4 ${link.color}`} />
                <span className="text-slate-300 text-sm font-medium">{link.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}