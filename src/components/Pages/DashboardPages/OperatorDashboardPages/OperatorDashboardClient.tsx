/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Users, CheckCircle2, ArrowRight, Armchair, Activity, ArrowUpRight, PlusCircle, Globe, ShieldCheck, Zap, Database, Navigation } from 'lucide-react';
import Link from 'next/link';

const TYPE_LABEL: Record<string, string> = {
  AC: 'Premium AC',
  NON_AC: 'Standard',
  SLEEPER: 'Sleeper',
  DOUBLE_DECKER: 'Double Decker',
};

const COLORS = ['#f59e0b', '#0f172a', '#10b981', '#3b82f6'];

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
                  borderWidth: 8,
                  borderColor: '#ffffff',
                  hoverOffset: 15,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '80%',
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
                  backgroundColor: ['#10b981', '#f59e0b'],
                  borderWidth: 8,
                  borderColor: '#ffffff',
                  hoverOffset: 15,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '80%',
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
                  backgroundColor: '#0f172a',
                  borderRadius: 12,
                  barThickness: 16,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: 'rgba(0,0,0,0.4)', font: { family: 'Inter', weight: '900', size: 10 } },
                },
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(0,0,0,0.03)' },
                  ticks: { color: 'rgba(0,0,0,0.4)', font: { family: 'Inter', weight: '900', size: 10 } },
                },
              },
            },
          })
        );
    };

    const existing = document.getElementById('chartjs-cdn');
    if (existing) {
      init();
    } else {
      const s = document.createElement('script');
      s.id = 'chartjs-cdn';
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => {
      charts.current.forEach((c) => c.destroy());
    };
  }, [busTypeCount, stats, passengerGrowth]);

  const typeKeys = Object.keys(busTypeCount);

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Operator Dashboard</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Fleet <span className="text-amber-600">Overview</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 bg-card border border-border px-8 py-4 rounded-[32px] shadow-2xl shadow-slate-900/[0.03] backdrop-blur-xl">
             <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-foreground text-sm font-medium leading-none">Live Session</span>
             </div>
             <div className="w-[1px] h-4 bg-border/50" />
             <div className="flex items-center gap-3">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-muted-foreground text-sm font-medium leading-none">Secure</span>
             </div>
          </div>
        </div>

        {/* METRICS HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Bus,
              label: 'Fleet Management',
              value: stats.totalBuses,
              sub: `${stats.activeBuses} Active Buses`,
              accent: true,
            },
            {
              icon: Armchair,
              label: 'Total Seats',
              value: stats.totalSeats.toLocaleString(),
              sub: `৳${stats.avgPrice} Average Price`,
              accent: false,
            },
            {
              icon: Users,
              label: 'Total Passengers',
              value: stats.totalPassengers.toLocaleString(),
              sub: `${stats.activePassengers} Active Users`,
              accent: false,
            },
            {
              icon: ShieldCheck,
              label: 'Verified Users',
              value: stats.verifiedPassengers,
              sub: `Fully Verified`,
              accent: false,
            },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-[40px] p-8 border transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden ${
                c.accent
                  ? 'bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-900/40'
                  : 'bg-card border-border shadow-sm hover:shadow-2xl hover:border-amber-500/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center mb-6 shadow-xl transition-all duration-500 ${
                c.accent 
                ? 'bg-white/10 group-hover:bg-amber-500/20' 
                : 'bg-muted border border-border group-hover:bg-amber-500/10 group-hover:border-amber-500/20 group-hover:rotate-12'
              }`}>
                <c.icon className={`w-6 h-6 ${c.accent ? 'text-amber-500' : 'text-amber-600'}`} />
              </div>
              <p className={`text-xs font-medium mb-2 opacity-60 ${c.accent ? 'text-slate-400' : 'text-muted-foreground'}`}>
                {c.label}
              </p>
              <p className="font-bold text-3xl tracking-tight mb-2">
                {c.value}
              </p>
              <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${c.accent ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                 <p className={`text-xs font-medium ${c.accent ? 'text-emerald-400/80' : 'text-emerald-600'}`}>
                   {c.sub}
                 </p>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          <div className="lg:col-span-4 bg-card border border-border rounded-[48px] p-10 shadow-2xl shadow-slate-900/[0.02] flex flex-col relative overflow-hidden">
             <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                   <p className="text-amber-600 text-sm font-medium tracking-wide mb-1">Bus Types</p>
                   <h3 className="text-2xl font-bold tracking-tight">Distribution</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center">
                   <Database className="w-5 h-5 text-muted-foreground/30" />
                </div>
             </div>
             <div className="relative h-64 mb-10">
              {typeKeys.length > 0 ? (
                <canvas ref={donutRef} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium opacity-40">
                  No data available
                </div>
              )}
            </div>
             <div className="grid grid-cols-1 gap-4 mt-auto">
               {typeKeys.map((k, i) => (
                 <div key={k} className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-2xl hover:bg-muted/40 transition-colors group">
                    <div className="flex items-center gap-4">
                       <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ background: COLORS[i] }} />
                       <span className="text-foreground text-sm font-medium">{TYPE_LABEL[k] ?? k}</span>
                    </div>
                    <span className="text-muted-foreground text-sm font-medium opacity-50 group-hover:opacity-100 transition-opacity">
                      {busTypeCount[k]} buses
                    </span>
                 </div>
               ))}
             </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-card border border-border rounded-[48px] p-10 shadow-2xl shadow-slate-900/[0.02] relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-10 shrink-0">
                   <div>
                      <p className="text-emerald-600 text-sm font-medium tracking-wide mb-1">Fleet Status</p>
                      <h3 className="text-2xl font-bold tracking-tight">Bus Availability</h3>
                   </div>
                   <Globe className="w-5 h-5 text-muted-foreground/30" />
                </div>
                <div className="relative h-56 mb-8 flex-1">
                  <canvas ref={fleetRef} />
                </div>
                <div className="flex items-center justify-center gap-10 shrink-0">
                   {[{ label: 'Active', val: stats.activeBuses, color: '#10b981' }, { label: 'Inactive', val: stats.inactiveBuses, color: '#f59e0b' }].map((s) => (
                     <div key={s.label} className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                           <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                           <span className="text-foreground text-sm font-medium">{s.label}</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-muted-foreground">{s.val}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-[48px] p-10 shadow-2xl shadow-slate-900/[0.02] relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-2">
                   <div>
                      <p className="text-blue-600 text-sm font-medium tracking-wide mb-1">Growth Analytics</p>
                      <h3 className="text-2xl font-bold tracking-tight">Passenger Growth</h3>
                   </div>
                   <Activity className="w-5 h-5 text-muted-foreground/30" />
                </div>
                <div className="relative h-64 flex-1">
                  {passengerGrowth.months.length > 0 ? (
                    <canvas ref={barRef} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium opacity-40">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* RECENT ASSETS */}
               <div className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl shadow-slate-900/[0.03] flex flex-col">
                  <div className="flex items-center justify-between p-10 border-b border-border/50 shrink-0">
                    <div>
                       <p className="text-slate-600 text-sm font-medium tracking-wide mb-1">Fleet Registry</p>
                       <h3 className="text-xl font-bold tracking-tight">Recent Buses</h3>
                    </div>
                    <Link href="/operator-dashboard/buses" className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-slate-900 hover:text-amber-500 transition-all duration-500 shadow-xl group">
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="divide-y divide-border/20 flex-1">
                    {recentBuses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30"><Bus className="w-12 h-12 mb-4" /><p className="text-base font-medium">No buses found</p></div>
                    ) : (
                      recentBuses.map((bus) => (
                        <div key={bus.id} className="flex items-center gap-6 p-8 hover:bg-muted/30 transition-all duration-500 group">
                          <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:border-slate-800 transition-all duration-700 shadow-lg">
                            <Bus className="w-6 h-6 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-semibold text-base tracking-tight mb-1 group-hover:text-amber-500 transition-colors">{bus.name}</p>
                            <p className="text-muted-foreground text-sm font-medium opacity-50">#{bus.number} · {bus.totalSeats} Seats</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-foreground font-semibold text-base leading-none mb-2 group-hover:text-emerald-500 transition-colors">৳{bus.pricePerSeat}</p>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${bus.isActive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                              {bus.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
               </div>

               {/* RECENT PASSENGERS */}
               <div className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl shadow-slate-900/[0.03] flex flex-col">
                  <div className="flex items-center justify-between p-10 border-b border-border/50 shrink-0">
                    <div>
                       <p className="text-amber-600 text-sm font-medium tracking-wide mb-1">Passenger List</p>
                       <h3 className="text-xl font-bold tracking-tight">Recent Passengers</h3>
                    </div>
                    <Link href="/operator-dashboard/my-passengers" className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-slate-900 hover:text-amber-500 transition-all duration-500 shadow-xl group">
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="divide-y divide-border/20 flex-1">
                    {recentPassengers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30"><Users className="w-12 h-12 mb-4" /><p className="text-base font-medium">No passengers found</p></div>
                    ) : (
                      recentPassengers.map((p) => (
                        <div key={p.id} className="flex items-center gap-6 p-8 hover:bg-muted/30 transition-all duration-500 group">
                          <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 text-muted-foreground font-bold text-xl group-hover:bg-slate-900 group-hover:text-amber-500 transition-all duration-700 shadow-lg">
                            {p.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="text-foreground font-semibold text-base tracking-tight group-hover:text-amber-500 transition-colors">{p.name}</p>
                              {p.isVerified && (
                                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                   <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                </div>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm font-medium opacity-60 truncate">{p.email}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-500 ${
                              p.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white'
                                : 'bg-destructive/10 text-destructive border-destructive/20 group-hover:bg-destructive group-hover:text-white'
                            }`}>
                              {p.status}
                            </span>
                            <p className="text-muted-foreground text-xs font-medium opacity-40 group-hover:opacity-100 transition-opacity mt-2">
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
            </div>
          </div>
        </div>

        {/* FAST ACTIONS HUB */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          {[
            { label: 'Manage Buses', href: '/operator-dashboard/buses', icon: Bus, desc: 'View and edit fleet' },
            { label: 'Passengers', href: '/operator-dashboard/my-passengers', icon: Users, desc: 'View passenger list' },
            { label: 'Bookings', href: '/operator-dashboard/bookings', icon: Activity, desc: 'Monitor reservations' },
          ].map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between bg-card border border-border rounded-[32px] p-8 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-slate-900/[0.08] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-xl group-hover:bg-slate-900 group-hover:border-slate-800 transition-all duration-500 group-hover:rotate-6">
                   <link.icon className="w-6 h-6 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                </div>
                <div>
                   <span className="text-foreground font-semibold text-lg block group-hover:text-amber-500 transition-colors leading-none mb-1">
                     {link.label}
                   </span>
                   <span className="text-xs font-medium text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                     {link.desc}
                   </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-amber-600 group-hover:translate-x-2 transition-all duration-500 relative z-10" />
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}