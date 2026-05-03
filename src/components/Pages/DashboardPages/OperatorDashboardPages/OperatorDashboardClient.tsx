'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bus, Users, CheckCircle2, ArrowRight, Armchair, Activity } from 'lucide-react';
import Link from 'next/link';

const TYPE_LABEL: Record<string, string> = { AC: 'AC', NON_AC: 'Non-AC', SLEEPER: 'Sleeper', DOUBLE_DECKER: 'Double Decker' };
const COLORS = ['#f59e0b', '#3b82f6', '#a78bfa', '#22c55e'];

interface Props {
  stats: { totalBuses: number; activeBuses: number; inactiveBuses: number; totalSeats: number; avgPrice: number; totalPassengers: number; verifiedPassengers: number; activePassengers: number };
  busTypeCount: Record<string, number>;
  recentBuses: { id: string; name: string; number: string; type: string; totalSeats: number; pricePerSeat: number; isActive: boolean }[];
  passengerGrowth: { months: string[]; counts: number[] };
  recentPassengers: { id: string; name: string; email: string; status: string; isVerified: boolean; joinedAt: string }[];
}

export default function OperatorDashboardClient({ stats, busTypeCount, recentBuses, passengerGrowth, recentPassengers }: Props) {
  const donutRef = useRef<HTMLCanvasElement>(null);
  const fleetRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLCanvasElement>(null);
  const charts = useRef<any[]>([]);

  useEffect(() => {
    const init = () => {
      const C = (window as any).Chart;
      if (!C) return;
      charts.current.forEach(c => c.destroy());
      charts.current = [];

      const keys = Object.keys(busTypeCount);
      if (donutRef.current && keys.length > 0)
        charts.current.push(new C(donutRef.current, {
          type: 'doughnut',
          data: { labels: keys.map(k => TYPE_LABEL[k] ?? k), datasets: [{ data: keys.map(k => busTypeCount[k]), backgroundColor: COLORS, borderWidth: 2, borderColor: '#07111f', hoverOffset: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } },
        }));

      if (fleetRef.current)
        charts.current.push(new C(fleetRef.current, {
          type: 'doughnut',
          data: { labels: ['Active', 'Inactive'], datasets: [{ data: [stats.activeBuses, stats.inactiveBuses], backgroundColor: ['#22c55e', '#f43f5e'], borderWidth: 2, borderColor: '#07111f' }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } },
        }));

      if (barRef.current && passengerGrowth.months.length > 0)
        charts.current.push(new C(barRef.current, {
          type: 'bar',
          data: { labels: passengerGrowth.months, datasets: [{ data: passengerGrowth.counts, backgroundColor: 'rgba(245,158,11,0.25)', borderColor: '#f59e0b', borderWidth: 2, borderRadius: 6, borderSkipped: false }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } } } },
        }));
    };

    if ((window as any).Chart) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.onload = init;
    document.head.appendChild(s);
    return () => { charts.current.forEach(c => c.destroy()); };
  }, [busTypeCount, stats, passengerGrowth]);

  const typeKeys = Object.keys(busTypeCount);

  return (
    <div className="min-h-screen bg-[#07111f] p-6 lg:p-10">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,180,0,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,180,0,0.2) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">Operator Panel</p>
            <h1 className="text-3xl lg:text-4xl font-black text-white">My <span className="text-amber-400">Dashboard</span></h1>
          </div>
          <div className="flex items-center gap-2 bg-green-400/10 border border-green-400/20 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">Live</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Bus, label: 'Total Buses', value: stats.totalBuses, sub: `${stats.activeBuses} active · ${stats.inactiveBuses} inactive`, color: 'text-amber-400' },
            { icon: Armchair, label: 'Total Seats', value: stats.totalSeats.toLocaleString(), sub: `Avg ৳${stats.avgPrice} / seat`, color: 'text-blue-400' },
            { icon: Users, label: 'Passengers', value: stats.totalPassengers.toLocaleString(), sub: `${stats.activePassengers} active`, color: 'text-green-400' },
            { icon: CheckCircle2, label: 'Verified', value: stats.verifiedPassengers, sub: `of ${stats.totalPassengers} total`, color: 'text-purple-400' },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
              <c.icon className={`w-5 h-5 mb-3 ${c.color}`} />
              <p className="text-white font-black text-2xl">{c.value}</p>
              <p className="text-slate-500 text-xs mt-1">{c.label}</p>
              <p className={`text-xs mt-0.5 ${c.color}`}>{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-1">Bus Types</p>
            <p className="text-slate-500 text-xs mb-4">How many of each type</p>
            <div className="relative h-44">
              {typeKeys.length > 0 ? <canvas ref={donutRef} /> : <div className="flex items-center justify-center h-full text-slate-600 text-sm">No buses yet</div>}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
              {typeKeys.map((k, i) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-slate-400 text-xs">{TYPE_LABEL[k] ?? k} ({busTypeCount[k]})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-1">Bus Status</p>
            <p className="text-slate-500 text-xs mb-4">Active vs inactive</p>
            <div className="relative h-44"><canvas ref={fleetRef} /></div>
            <div className="flex gap-6 mt-4">
              {[{ label: 'Active', val: stats.activeBuses, color: '#22c55e' }, { label: 'Inactive', val: stats.inactiveBuses, color: '#f43f5e' }].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-400 text-xs">{s.label} ({s.val})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-1">New Passengers</p>
            <p className="text-slate-500 text-xs mb-4">Sign-ups per month</p>
            <div className="relative h-44">
              {passengerGrowth.months.length > 0 ? <canvas ref={barRef} /> : <div className="flex items-center justify-center h-full text-slate-600 text-sm">No data yet</div>}
            </div>
          </div>
        </div>

        {/* Recent lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <p className="text-white font-semibold text-sm">Recent Buses</p>
              <Link href="/operator-dashboard/buses" className="text-amber-400 text-xs hover:text-amber-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentBuses.length === 0
              ? <p className="text-slate-600 text-sm text-center py-12">No buses yet</p>
              : recentBuses.map(bus => (
                <div key={bus.id} className="flex items-center gap-4 px-6 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                    <Bus className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{bus.name}</p>
                    <p className="text-slate-500 text-xs">#{bus.number} · {bus.totalSeats} seats</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-amber-400 text-sm font-bold">৳{bus.pricePerSeat}</p>
                    <p className={`text-xs ${bus.isActive ? 'text-green-400' : 'text-rose-400'}`}>{bus.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <p className="text-white font-semibold text-sm">Recent Passengers</p>
              <Link href="/operator-dashboard/my-passengers" className="text-amber-400 text-xs hover:text-amber-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentPassengers.length === 0
              ? <p className="text-slate-600 text-sm text-center py-12">No passengers yet</p>
              : recentPassengers.map(p => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center shrink-0 text-blue-400 font-bold text-sm">
                    {p.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white text-sm font-medium truncate">{p.name}</p>
                      {p.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />}
                    </div>
                    <p className="text-slate-500 text-xs truncate">{p.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400' : 'bg-slate-400/10 text-slate-400'}`}>
                      {p.status === 'ACTIVE' ? 'Active' : p.status === 'SUSPENDED' ? 'Suspended' : 'Inactive'}
                    </span>
                    <p className="text-slate-600 text-xs mt-1">{new Date(p.joinedAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {[
            { label: 'My Buses', href: '/operator-dashboard/buses', icon: Bus, color: 'text-amber-400' },
            { label: 'My Passengers', href: '/operator-dashboard/my-passengers', icon: Users, color: 'text-blue-400' },
            { label: 'Bookings', href: '/operator-dashboard/bookings', icon: Activity, color: 'text-green-400' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-all group">
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