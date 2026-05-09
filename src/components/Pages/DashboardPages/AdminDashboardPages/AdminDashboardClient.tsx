'use client';

import { useEffect, useRef } from 'react';
import { Bus, Users, UserCheck, TrendingUp, Activity, CheckCircle2, Route } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = { AC: 'AC', NON_AC: 'Non-AC', AC_SLEEPER: 'AC Sleeper', AC_CHAIR: 'AC Chair' };
const TYPE_COLORS = ['#3b82f6', '#22c55e', '#a78bfa', '#f97316'];

interface Props {
  stats: { totalBuses: number; activeBuses: number; inactiveBuses: number; totalOperators: number; activeOperators: number;deletedBuses: number; totalPassengers: number; verifiedPassengers: number; totalRoutes: number; routesWithSchedules: number; avgPricePerSeat: number };
  busTypeCount: Record<string, number>;
  topOperators: { name: string; count: number }[];
  routesBySchedules: { label: string; schedules: number; distance: number }[];
  passengerGrowth: { months: string[]; counts: number[] };
  recentOperators: { name: string; email: string; status: string; isVerified: boolean; joinedAt: string }[];
}

export default function AdminDashboardClient({ stats, busTypeCount, topOperators, routesBySchedules, passengerGrowth, recentOperators }: Props) {
  const busTypeRef = useRef<HTMLCanvasElement>(null);
  const routesRef = useRef<HTMLCanvasElement>(null);
  const passengerRef = useRef<HTMLCanvasElement>(null);
  const fleetRef = useRef<HTMLCanvasElement>(null);
  const charts = useRef<any[]>([]);

  useEffect(() => {
    const init = () => {
      const C = (window as any).Chart;
      if (!C) return;
      charts.current.forEach(c => c.destroy());
      charts.current = [];

      const grid = 'rgba(255,255,255,0.06)';
      const tick = '#64748b';
      const typeKeys = Object.keys(busTypeCount);

      if (busTypeRef.current && typeKeys.length > 0)
        charts.current.push(new C(busTypeRef.current, { type: 'doughnut', data: { labels: typeKeys.map(k => TYPE_LABELS[k] ?? k), datasets: [{ data: typeKeys.map(k => busTypeCount[k]), backgroundColor: TYPE_COLORS, borderWidth: 2, borderColor: '#0a1628', hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } } }));

      if (fleetRef.current)
        charts.current.push(new C(fleetRef.current, { type: 'doughnut', data: { labels: ['Active', 'Inactive'], datasets: [{ data: [stats.activeBuses, stats.inactiveBuses], backgroundColor: ['#22c55e', '#f59e0b'], borderWidth: 2, borderColor: '#0a1628', hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } } }));

      if (passengerRef.current && passengerGrowth.months.length > 0)
        charts.current.push(new C(passengerRef.current, { type: 'line', data: { labels: passengerGrowth.months, datasets: [{ data: passengerGrowth.counts, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#22c55e' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: tick, font: { size: 11 } }, grid: { color: grid } }, y: { ticks: { color: tick, font: { size: 11 } }, grid: { color: grid }, beginAtZero: true } } } }));

      if (routesRef.current && routesBySchedules.length > 0)
        charts.current.push(new C(routesRef.current, { type: 'bar', data: { labels: routesBySchedules.map(r => r.label), datasets: [{ data: routesBySchedules.map(r => r.schedules), backgroundColor: '#f59e0b', borderRadius: 6, borderSkipped: false }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: tick, font: { size: 11 } }, grid: { color: grid }, beginAtZero: true }, y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { display: false } } } } }));
    };

    const existing = document.getElementById('chartjs-cdn');
    if (existing) { init(); }
    else {
      const s = document.createElement('script');
      s.id = 'chartjs-cdn';
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => { charts.current.forEach(c => c.destroy()); charts.current = []; };
  }, [busTypeCount, routesBySchedules, passengerGrowth, stats]);

  const typeKeys = Object.keys(busTypeCount);

  const metricCards = [
    { label: 'Total Buses', value: stats.totalBuses, sub: `${stats.activeBuses} active`, icon: Bus, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    { label: 'Total Operators', value: stats.totalOperators, sub: `${stats.activeOperators} active`, icon: UserCheck, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    { label: 'Total Passengers', value: stats.totalPassengers, sub: `${stats.verifiedPassengers} verified`, icon: Users, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
    { label: 'Total Routes', value: stats.totalRoutes, sub: `${stats.routesWithSchedules} with schedules`, icon: Route, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
    { label: 'Avg Seat Price', value: `৳${stats.avgPricePerSeat}`, sub: 'per seat', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
    { label: 'Active Routes', value: stats.routesWithSchedules, sub: `of ${stats.totalRoutes} total`, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  ];

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-10">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,180,0,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,180,0,0.1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">— Overview</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">Admin <span className="text-amber-400">Dashboard</span></h1>
          <p className="text-slate-400 text-lg">Fleet, passengers & route overview</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {metricCards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:border-amber-400/20 transition-colors">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-slate-400 text-xs mb-1">{card.label}</p>
                <p className="text-white font-black text-2xl leading-none mb-1">{card.value}</p>
                <p className={`text-xs ${card.color}`}>{card.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Bus type */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <p className="text-white font-bold text-sm mb-4">Bus Types</p>
            <div className="relative h-48"><canvas ref={busTypeRef} /></div>
            <div className="flex flex-wrap gap-2 mt-4">
              {typeKeys.map((k, i) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_COLORS[i] }} />
                  <span className="text-slate-400 text-xs">{TYPE_LABELS[k] ?? k} ({busTypeCount[k]})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bus status */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <p className="text-white font-bold text-sm mb-4">Bus Status</p>
            <div className="relative h-48"><canvas ref={fleetRef} /></div>
            <div className="flex flex-wrap gap-3 mt-4">
              {[{ label: 'Active', val: stats.activeBuses, color: '#22c55e' }, { label: 'Inactive', val: stats.inactiveBuses, color: '#f59e0b' }].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-400 text-xs">{s.label} ({s.val})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Passenger growth */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <p className="text-white font-bold text-sm mb-1">New Passengers</p>
            <p className="text-slate-500 text-xs mb-4">Sign-ups per month</p>
            <div className="relative h-48">
              {passengerGrowth.months.length > 0 ? <canvas ref={passengerRef} /> : <div className="flex items-center justify-center h-full text-slate-500 text-sm">No data yet</div>}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top routes */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <p className="text-white font-bold text-sm mb-1">Top Routes</p>
            <p className="text-slate-500 text-xs mb-4">By number of schedules</p>
            <div className="relative" style={{ height: `${Math.max(routesBySchedules.length * 44 + 40, 180)}px` }}>
              {routesBySchedules.length > 0 ? <canvas ref={routesRef} /> : <div className="flex items-center justify-center h-full text-slate-500 text-sm">No route data</div>}
            </div>
          </div>

          {/* Top operators */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <p className="text-white font-bold text-sm mb-1">Top Operators</p>
            <p className="text-slate-500 text-xs mb-5">By number of buses</p>
            {topOperators.length === 0
              ? <p className="text-slate-500 text-sm">No data</p>
              : <div className="space-y-3">
                {topOperators.map((op, i) => {
                  const pct = Math.round((op.count / topOperators[0].count) * 100);
                  return (
                    <div key={op.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                          <span className="text-slate-300 text-sm">{op.name}</span>
                        </div>
                        <span className="text-amber-400 text-sm font-bold">{op.count} buses</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </div>

        {/* Recent operators */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <p className="text-white font-bold text-sm mb-4">Recent Operators</p>
          {recentOperators.length === 0
            ? <p className="text-slate-500 text-sm">No operators yet</p>
            : <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Name', 'Email', 'Status', 'Verified', 'Joined'].map(h => (
                      <th key={h} className="text-left text-slate-400 text-xs font-semibold pb-3 pr-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOperators.map(op => (
                    <tr key={op.email} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-6 text-white font-medium">{op.name}</td>
                      <td className="py-3 pr-6 text-slate-400">{op.email}</td>
                      <td className="py-3 pr-6">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${op.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>{op.status}</span>
                      </td>
                      <td className="py-3 pr-6">
                        {op.isVerified ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <span className="text-slate-500 text-xs">—</span>}
                      </td>
                      <td className="py-3 text-slate-400 text-xs">{new Date(op.joinedAt).toLocaleDateString('en-BD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  );
}