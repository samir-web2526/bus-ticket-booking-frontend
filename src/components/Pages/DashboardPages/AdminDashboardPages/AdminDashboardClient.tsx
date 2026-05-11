/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import { Bus, Users, UserCheck, TrendingUp, Activity, CheckCircle2, Route, ArrowUpRight, ArrowRight, Zap, Database, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const TYPE_LABELS: Record<string, string> = { AC: 'Premium AC', NON_AC: 'Standard', SLEEPER: 'Sleeper', DOUBLE_DECKER: 'Double Decker' };
const TYPE_COLORS = ['#f59e0b', '#0f172a', '#10b981', '#3b82f6'];

interface Props {
  stats: { totalBuses: number; activeBuses: number; inactiveBuses: number; totalOperators: number; activeOperators: number; deletedBuses: number; totalPassengers: number; verifiedPassengers: number; totalRoutes: number; routesWithSchedules: number; avgPricePerSeat: number };
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

      const typeKeys = Object.keys(busTypeCount);

      if (busTypeRef.current && typeKeys.length > 0)
        charts.current.push(new C(busTypeRef.current, { type: 'doughnut', data: { labels: typeKeys.map(k => TYPE_LABELS[k] ?? k), datasets: [{ data: typeKeys.map(k => busTypeCount[k]), backgroundColor: TYPE_COLORS, borderWidth: 8, borderColor: '#ffffff', hoverOffset: 15 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '80%', plugins: { legend: { display: false } } } }));

      if (fleetRef.current)
        charts.current.push(new C(fleetRef.current, { type: 'doughnut', data: { labels: ['Active', 'Inactive'], datasets: [{ data: [stats.activeBuses, stats.inactiveBuses], backgroundColor: ['#10b981', '#f59e0b'], borderWidth: 8, borderColor: '#ffffff', hoverOffset: 15 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '80%', plugins: { legend: { display: false } } } }));

      if (passengerRef.current && passengerGrowth.months.length > 0)
        charts.current.push(new C(passengerRef.current, { type: 'line', data: { labels: passengerGrowth.months, datasets: [{ data: passengerGrowth.counts, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.05)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 0, pointHitRadius: 20 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false, beginAtZero: true } } } }));

      if (routesRef.current && routesBySchedules.length > 0)
        charts.current.push(new C(routesRef.current, { type: 'bar', data: { labels: routesBySchedules.map(r => r.label), datasets: [{ data: routesBySchedules.map(r => r.schedules), backgroundColor: '#0f172a', borderRadius: 12, barThickness: 16 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { display: false } }, y: { grid: { display: false }, ticks: { color: 'rgba(0,0,0,0.4)', font: { family: 'Inter', weight: '900', size: 10 } } } } } }));
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
    { label: 'FLEET CAPACITY', value: stats.totalBuses, sub: `${stats.activeBuses} ACTIVE ASSETS`, icon: Bus, primary: true },
    { label: 'AUTHORIZED OPERATORS', value: stats.totalOperators, sub: `${stats.activeOperators} VERIFIED NODES`, icon: ShieldCheck, primary: false },
    { label: 'NETWORK PASSENGERS', value: stats.totalPassengers, sub: `${stats.verifiedPassengers} SECURE USERS`, icon: UserCheck, primary: false },
    { label: 'TRANSIT VECTORS', value: stats.totalRoutes, sub: `${stats.routesWithSchedules} LIVE PATHS`, icon: Route, primary: false },
    { label: 'AVG SEAT YIELD', value: `৳${stats.avgPricePerSeat}`, sub: 'MARKET OPTIMIZED', icon: TrendingUp, primary: false },
    { label: 'SYSTEM THROUGHPUT', value: stats.routesWithSchedules, sub: 'REAL-TIME SYNC', icon: Activity, primary: false },
  ];

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-amber-600 text-[10px] font-black tracking-[0.5em] uppercase mb-5 italic">— CENTRAL COMMAND UNIT</p>
            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter font-heading uppercase italic">
              ADMIN <span className="text-amber-500">TERMINAL</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 bg-card border border-border px-8 py-4 rounded-[32px] shadow-2xl shadow-slate-900/[0.03] backdrop-blur-xl">
             <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-foreground text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">SYSTEM ONLINE</span>
             </div>
             <div className="w-[1px] h-4 bg-border/50" />
             <div className="flex items-center gap-3">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">V 4.0.1</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {metricCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div 
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-[40px] p-8 border transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden ${card.primary ? 'bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-900/40' : 'bg-card border-border shadow-sm hover:shadow-2xl hover:border-amber-500/30'}`}
              >
                <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center mb-6 shadow-xl transition-all duration-500 ${card.primary ? 'bg-white/10 group-hover:bg-amber-500/20' : 'bg-muted border border-border group-hover:bg-amber-500/10 group-hover:border-amber-500/20 group-hover:rotate-12'}`}>
                  <Icon className={`w-6 h-6 ${card.primary ? 'text-amber-500' : 'text-amber-600'}`} />
                </div>
                <p className={`text-[8px] font-black uppercase tracking-[0.2em] mb-2 italic opacity-60 ${card.primary ? 'text-slate-400' : 'text-muted-foreground'}`}>{card.label}</p>
                <p className="font-black text-4xl font-heading tracking-tighter mb-2 italic">{card.value}</p>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${card.primary ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                   <p className={`text-[10px] font-black italic uppercase tracking-tight ${card.primary ? 'text-emerald-400/80' : 'text-emerald-600'}`}>{card.sub}</p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          <div className="lg:col-span-4 bg-card border border-border rounded-[48px] p-10 shadow-2xl shadow-slate-900/[0.02] flex flex-col relative overflow-hidden">
             <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                   <p className="text-amber-600 text-[10px] font-black tracking-[0.3em] uppercase mb-1 italic">Fleet Intelligence</p>
                   <h3 className="text-2xl font-black font-heading uppercase italic tracking-tighter">Distribution</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center">
                   <Database className="w-5 h-5 text-muted-foreground/30" />
                </div>
             </div>
             <div className="relative h-64 mb-10"><canvas ref={busTypeRef} /></div>
             <div className="grid grid-cols-1 gap-4 mt-auto">
               {typeKeys.map((k, i) => (
                 <div key={k} className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-2xl hover:bg-muted/40 transition-colors group">
                    <div className="flex items-center gap-4">
                       <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ background: TYPE_COLORS[i] }} />
                       <span className="text-foreground text-[10px] font-black uppercase tracking-widest">{TYPE_LABELS[k] ?? k}</span>
                    </div>
                    <span className="text-muted-foreground font-black text-[10px] uppercase opacity-40 italic group-hover:opacity-100 transition-opacity">{Math.round((busTypeCount[k] / stats.totalBuses) * 100)}% Matrix</span>
                 </div>
               ))}
             </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-card border border-border rounded-[48px] p-10 shadow-2xl shadow-slate-900/[0.02] relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <p className="text-emerald-600 text-[10px] font-black tracking-[0.3em] uppercase mb-1 italic">Deployment Stats</p>
                      <h3 className="text-2xl font-black font-heading uppercase italic tracking-tighter">Operational Status</h3>
                   </div>
                   <Activity className="w-5 h-5 text-muted-foreground/30" />
                </div>
                <div className="relative h-56 mb-8"><canvas ref={fleetRef} /></div>
                <div className="flex items-center justify-center gap-10">
                   {[{ label: 'ACTIVE', val: stats.activeBuses, color: '#10b981' }, { label: 'OFFLINE', val: stats.inactiveBuses, color: '#f59e0b' }].map(s => (
                     <div key={s.label} className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                           <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                           <span className="text-foreground text-[11px] font-black uppercase tracking-widest">{s.label}</span>
                        </div>
                        <span className="text-2xl font-black font-heading tracking-tighter italic text-muted-foreground">{s.val}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-[48px] p-10 shadow-2xl shadow-slate-900/[0.02] relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-2">
                   <div>
                      <p className="text-blue-600 text-[10px] font-black tracking-[0.3em] uppercase mb-1 italic">Growth Telemetry</p>
                      <h3 className="text-2xl font-black font-heading uppercase italic tracking-tighter">User Base Expansion</h3>
                   </div>
                   <Users className="w-5 h-5 text-muted-foreground/30" />
                </div>
                <p className="text-4xl font-black font-heading mb-auto tracking-tighter italic text-amber-500">+{passengerGrowth.counts[passengerGrowth.counts.length - 1] || 0} <span className="text-foreground italic text-xl uppercase font-black">UNITS</span></p>
                <div className="h-44 w-full mt-8">
                  {passengerGrowth.months.length > 0 ? <canvas ref={passengerRef} /> : <div className="flex items-center justify-center h-full text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] opacity-20 italic">AWAITING SIGNAL...</div>}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[48px] p-12 shadow-2xl shadow-slate-900/[0.02]">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <p className="text-slate-600 text-[10px] font-black tracking-[0.3em] uppercase mb-1 italic">Infrastructure Density</p>
                    <h3 className="text-2xl font-black font-heading uppercase italic tracking-tighter">High Traffic Vectors</h3>
                 </div>
                 <Route className="w-5 h-5 text-muted-foreground/30" />
              </div>
              <div className="relative" style={{ height: `${Math.max(routesBySchedules.length * 48 + 40, 260)}px` }}>
                {routesBySchedules.length > 0 ? <canvas ref={routesRef} /> : <div className="flex items-center justify-center h-full text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] opacity-20 italic">NO ACTIVE VECTORS DETECTED</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
           <div className="lg:col-span-5 bg-card border border-border rounded-[48px] p-12 shadow-2xl shadow-slate-900/[0.02]">
             <div className="flex items-center justify-between mb-12">
                <div>
                   <p className="text-amber-600 text-[10px] font-black tracking-[0.3em] uppercase mb-1 italic">Strategic Alliances</p>
                   <h3 className="text-2xl font-black font-heading uppercase italic tracking-tighter">Market Authorities</h3>
                </div>
                <Globe className="w-5 h-5 text-muted-foreground/30" />
             </div>
             {topOperators.length === 0
               ? <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] opacity-20 text-center py-20 italic">TELEMETRY DATA UNAVAILABLE</p>
               : <div className="space-y-8">
                 {topOperators.map((op, i) => {
                   const pct = Math.round((op.count / topOperators[0].count) * 100);
                   return (
                     <div key={op.name} className="group">
                       <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-500 text-sm font-black flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 italic">{i + 1}</div>
                           <span className="text-foreground font-black text-lg font-heading uppercase italic tracking-tighter group-hover:text-amber-500 transition-colors">{op.name}</span>
                         </div>
                         <div className="text-right">
                            <span className="text-foreground font-black text-sm font-heading tracking-tight italic uppercase block leading-none">{op.count} UNIT FLEET</span>
                            <span className="text-muted-foreground text-[8px] font-black uppercase tracking-widest opacity-40 italic">MARKET SHARE: {pct}%</span>
                         </div>
                       </div>
                       <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden p-[2px]">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-slate-900 rounded-full group-hover:bg-amber-500 transition-colors relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" /></motion.div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             }
           </div>

           <div className="lg:col-span-7 bg-card border border-border rounded-[48px] p-12 shadow-2xl shadow-slate-900/[0.03] flex flex-col">
              <div className="flex items-center justify-between mb-12 shrink-0">
                 <div>
                    <p className="text-slate-600 text-[10px] font-black tracking-[0.3em] uppercase mb-1 italic">Personnel Intelligence</p>
                    <h3 className="text-2xl font-black font-heading uppercase italic tracking-tighter">Authorized Asset Log</h3>
                 </div>
                 <button className="flex items-center gap-3 text-[10px] font-black text-amber-600 uppercase tracking-widest hover:translate-x-2 transition-all duration-500 group/btn">ACCESS FULL DIRECTORY <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></button>
              </div>
              {recentOperators.length === 0
                ? <div className="flex-1 flex flex-col items-center justify-center py-20 grayscale opacity-20"><UserCheck className="w-16 h-16 mb-6" /><p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] italic">ZERO ENTRIES DETECTED IN CYCLE</p></div>
                : <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border/50">
                        {['AUTHORIZED ENTITY', 'COMMUNICATION NODE', 'CLEARANCE', 'joined'].map(h => (
                          <th key={h} className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] pb-8 pr-8 italic opacity-40">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {recentOperators.map((op, idx) => (
                        <motion.tr key={op.email} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 + 0.5 }} className="group hover:bg-muted/30 transition-all duration-500">
                          <td className="py-8 pr-8"><p className="text-foreground font-black text-base font-heading uppercase italic tracking-tighter group-hover:text-amber-500 transition-colors">{op.name}</p></td>
                          <td className="py-8 pr-8"><div className="flex flex-col"><span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-70">{op.email}</span><span className="text-[8px] font-black text-blue-600/40 uppercase tracking-widest italic leading-none">VERIFIED ENCRYPTION</span></div></td>
                          <td className="py-8 pr-8"><span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${op.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:bg-emerald-500 group-hover:text-white' : 'bg-destructive/10 text-destructive border-destructive/20 group-hover:bg-destructive group-hover:text-white'}`}>{op.status}</span></td>
                          <td className="py-8 text-muted-foreground text-[10px] font-black uppercase tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">{new Date(op.joinedAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
           </div>
        </div>
      </div>
    </section>
  );
}