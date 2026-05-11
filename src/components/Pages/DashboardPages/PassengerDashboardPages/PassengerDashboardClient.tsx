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
  CONFIRMED: { label: 'Confirmed', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dot: 'bg-emerald-500', icon: CheckCircle2 },
  PENDING:   { label: 'Pending',   cls: 'bg-amber-500/10  text-amber-600  border-amber-500/20',    dot: 'bg-amber-500',   icon: Clock        },
  CANCELLED: { label: 'Cancelled', cls: 'bg-destructive/10 text-destructive border-destructive/20', dot: 'bg-destructive', icon: XCircle      },
  EXPIRED:   { label: 'Completed', cls: 'bg-blue-500/10   text-blue-600   border-blue-500/20',     dot: 'bg-blue-500',    icon: CheckCircle2 },
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
  const barRef   = useRef<HTMLCanvasElement>(null);
  const donutRef = useRef<HTMLCanvasElement>(null);
  const charts   = useRef<any[]>([]);

  const confirmed  = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pending    = bookings.filter(b => b.status === 'PENDING').length;
  const cancelled  = bookings.filter(b => b.status === 'CANCELLED').length;
  const expired    = bookings.filter(b => b.status === 'EXPIRED').length;
  const totalSpent = bookings
    .filter(b => b.payment?.status === 'PAID')
    .reduce((s, b) => s + b.totalFare, 0);
  const recentBookings = [...bookings].slice(0, 5);

  // Monthly booking count
  const monthlyMap: Record<string, number> = {};
  bookings.forEach(b => {
    const m = new Date(b.createdAt).toLocaleDateString('en-BD', { month: 'short', year: '2-digit' });
    monthlyMap[m] = (monthlyMap[m] ?? 0) + 1;
  });
  const months       = Object.keys(monthlyMap).slice(-6);
  const monthlyCounts = months.map(m => monthlyMap[m]);

  useEffect(() => {
    const init = () => {
      const C = (window as any).Chart;
      if (!C) return;
      charts.current.forEach(c => c.destroy());
      charts.current = [];

      if (barRef.current && months.length > 0)
        charts.current.push(new C(barRef.current, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              data: monthlyCounts,
              backgroundColor: 'rgba(245,158,11,0.15)',
              borderColor: '#f59e0b',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: 'var(--muted-foreground)', font: { size: 10, weight: 'bold' } }, grid: { display: false } },
              y: { beginAtZero: true, ticks: { color: 'var(--muted-foreground)', font: { size: 10, weight: 'bold' }, stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.03)' } },
            },
          },
        }));

      if (donutRef.current && bookings.length > 0)
        charts.current.push(new C(donutRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
            datasets: [{
              data: [confirmed, pending, cancelled, expired],
              backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
              borderWidth: 0,
              hoverOffset: 12,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '80%',
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
    <div className="min-h-screen bg-background p-6 lg:p-12 relative overflow-hidden">
      {/* Decorative bg blobs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.02] rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-end justify-between flex-wrap gap-8"
        >
          <div>
            <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Central Intelligence</p>
            <h1 className="text-4xl lg:text-6xl font-black text-foreground tracking-tighter font-heading">
              Passenger <span className="text-amber-500 italic">Command</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-card border border-border px-6 py-3 rounded-full shadow-xl">
            <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
              <Ticket className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-foreground text-[10px] font-black uppercase tracking-widest">{bookings.length} Registered Bookings</span>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Ticket,       label: 'Total Bookings', value: bookings.length,                   sub: 'Aggregated History', primary: true  },
            { icon: CheckCircle2, label: 'Confirmed',       value: confirmed,                          sub: 'Ready for Travel', primary: false },
            { icon: Clock,        label: 'Pending',          value: pending,                            sub: 'Action Required', primary: false },
            { icon: CreditCard,   label: 'Net Investment',   value: `৳${totalSpent.toLocaleString()}`, sub: 'Lifetime Value', primary: false },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`rounded-[40px] p-8 border transition-all duration-500 hover:scale-[1.02] ${
                c.primary
                  ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-900/20 text-white'
                  : 'bg-card border-border shadow-xl hover:border-amber-500/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${c.primary ? 'bg-white/10 border-white/10' : 'bg-muted border-border'}`}>
                <c.icon className={`w-6 h-6 ${c.primary ? 'text-amber-500' : 'text-amber-600'}`} />
              </div>
              <p className={`font-black text-4xl font-heading tracking-tighter ${c.primary ? 'text-white' : 'text-foreground'}`}>{c.value}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${c.primary ? 'text-slate-400' : 'text-muted-foreground'}`}>{c.label}</p>
              <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 italic ${c.primary ? 'text-amber-500/70' : 'text-amber-600/70'}`}>{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-card border border-border rounded-[48px] p-10 shadow-2xl shadow-slate-900/[0.02]"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-foreground font-black text-xl font-heading tracking-tight">Booking Activity</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">6-Month Trend Analysis</p>
                </div>
              </div>
            </div>
            <div className="relative h-64">
              {months.length > 0
                ? <canvas ref={barRef} />
                : <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                    <Clock className="w-8 h-8 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting system data</p>
                  </div>
              }
            </div>
          </motion.div>

          {/* Donut Chart */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.5 }}
             className="lg:col-span-4 bg-card border border-border rounded-[48px] p-10 shadow-2xl shadow-slate-900/[0.02] flex flex-col"
          >
            <div className="mb-10">
              <p className="text-foreground font-black text-xl font-heading tracking-tight">Status Metrics</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Operational Breakdown</p>
            </div>
            
            <div className="relative h-48 mb-10">
              {bookings.length > 0
                ? <canvas ref={donutRef} />
                : <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                    <Ticket className="w-8 h-8 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No metrics available</p>
                  </div>
              }
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              {[
                { label: 'Confirmed', color: '#10b981', val: confirmed },
                { label: 'Pending',   color: '#f59e0b', val: pending   },
                { label: 'Cancelled', color: '#ef4444', val: cancelled },
                { label: 'Completed', color: '#3b82f6', val: expired   },
              ].map(s => (
                <div key={s.label} className="bg-muted/30 border border-border/50 p-4 rounded-3xl group hover:bg-muted transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full shrink-0 group-hover:scale-150 transition-transform" style={{ background: s.color }} />
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</span>
                  </div>
                  <p className="text-lg font-black text-foreground font-heading">{s.val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl mb-12"
        >
          <div className="flex items-center justify-between px-10 py-8 border-b border-border">
            <div>
              <p className="text-foreground font-black text-xl font-heading tracking-tight">Recent Activity</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Transaction Log</p>
            </div>
            <Link
              href="/passenger-dashboard/bookings"
              className="px-6 py-2.5 bg-muted hover:bg-slate-900 hover:text-white text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-3 border border-border group"
            >
              Full History <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {recentBookings.length === 0
              ? <div className="text-center py-24">
                  <Ticket className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Stationary: No active bookings detected</p>
                </div>
              : recentBookings.map((b, i) => {
                const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING;
                const StatusIcon = cfg.icon;
                const isPaid = b.payment?.status === 'PAID';

                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-8 px-10 py-6 hover:bg-muted/20 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:border-slate-800 transition-all duration-500">
                      <BusFront className="w-6 h-6 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                        <p className="text-foreground font-black text-lg font-heading tracking-tight truncate uppercase italic">
                          {b.schedule.route.sourceCity} <ArrowRight className="inline w-3 h-3 mx-1 text-muted-foreground/30" /> {b.schedule.route.destinationCity}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                           {b.schedule.bus.name}
                         </p>
                         <span className="w-1 h-1 bg-border rounded-full" />
                         <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest italic">
                           {fmt(b.schedule.departure)}
                         </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-foreground font-black text-xl font-heading tracking-tight italic leading-none mb-2">৳{b.totalFare.toLocaleString()}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <Banknote className={`w-3.5 h-3.5 ${isPaid ? 'text-emerald-500' : 'text-red-500'}`} />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isPaid ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isPaid ? 'SECURED' : 'UNPAID'}
                        </span>
                      </div>
                    </div>

                    <div className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shrink-0 ${cfg.cls} shadow-sm`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </div>

                    <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest shrink-0 hidden lg:block italic">{fmtDate(b.createdAt)}</p>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Command Links */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
           className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            { label: 'Booking Archive', href: '/passenger-dashboard/bookings', icon: Ticket, sub: 'Manage your history' },
            { label: 'Route Discovery',  href: '/find-buses',                   icon: BusFront, sub: 'Explore new paths' },
            { label: 'Account Matrix',  href: '/passenger-dashboard/profile',  icon: CreditCard, sub: 'Security & settings' },
          ].map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-6 bg-card border border-border rounded-[32px] p-8 hover:border-amber-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl -z-0" />
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center border border-border group-hover:bg-slate-900 group-hover:border-slate-800 transition-all duration-500">
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
              </div>
              <div>
                <p className="text-foreground font-black text-sm uppercase tracking-widest mb-1">{link.label}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic opacity-60">{link.sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground/30 group-hover:text-amber-500 group-hover:translate-x-2 transition-all" />
            </Link>
          ))}
        </motion.div>

      </div>
    </div>
  );
}: BusFront },
          ].map(link => (
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