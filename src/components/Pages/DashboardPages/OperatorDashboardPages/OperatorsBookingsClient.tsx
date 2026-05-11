"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, CheckCircle, XCircle, AlertTriangle,
  Search, Filter, Bus, MapPin, User, CreditCard, Calendar, Activity, Zap, Database, Navigation, ShieldCheck, Hash, ChevronRight
} from "lucide-react";

type BookingStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED";

interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  status: BookingStatus;
  totalFare: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string; name: string; email: string; phone: string | null; role: string;
  };
  bookingSeats: {
    id: string; bookingId: string; seatId: string;
    seat: { id: string; busId: string; number: string; type: string; row: number; column: number; price: number };
  }[];
  schedule: {
    id: string; busId: string; routeId: string; departure: string; arrival: string; status: string;
    bus: { id: string; name: string; number: string; type: string };
    route: { id: string; sourceCity: string; destinationCity: string; distanceKm: number; estimatedTimeMinutes: number };
  };
}

interface Props { bookings: Booking[] }

const statusConfig: Record<BookingStatus, { label: string; icon: React.ElementType; cls: string; dot: string }> = {
  PENDING:   { label: "PENDING",   icon: Clock,         cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",   dot: "bg-amber-500"  },
  CONFIRMED: { label: "CONFIRMED", icon: CheckCircle,   cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
  EXPIRED:   { label: "EXPIRED",   icon: AlertTriangle, cls: "bg-slate-500/10 text-slate-500 border-slate-500/20",     dot: "bg-slate-400"   },
  CANCELLED: { label: "CANCELLED", icon: XCircle,       cls: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive"    },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black italic tracking-widest ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export default function OperatorBookingsClient({ bookings }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "ALL">("ALL");

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.user.name.toLowerCase().includes(q) ||
      b.user.email.toLowerCase().includes(q) ||
      b.schedule.bus.name.toLowerCase().includes(q) ||
      b.schedule.route.sourceCity.toLowerCase().includes(q) ||
      b.schedule.route.destinationCity.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    ALL:       bookings.length,
    PENDING:   bookings.filter((b) => b.status === "PENDING").length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    EXPIRED:   bookings.filter((b) => b.status === "EXPIRED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <section className="bg-background min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-amber-600 text-[10px] font-black tracking-[0.5em] uppercase mb-5 italic">— LOGISTICS CONTROL</p>
          <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter font-heading uppercase italic">
            BOOKING <span className="text-amber-500">MANIFEST</span>
          </h1>
          <div className="flex items-center gap-4 mt-6">
             <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
                <Database className="w-5 h-5" />
             </div>
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] italic opacity-40">
                ACTIVE DATA SYNC: <span className="text-foreground opacity-100">{bookings.length} TOTAL ENTRIES</span>
             </p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 bg-card border border-border p-2 rounded-[32px] shadow-2xl shadow-slate-900/[0.03] w-fit"
          >
            {(["ALL", "PENDING", "CONFIRMED", "EXPIRED", "CANCELLED"] as const).map((s) => {
              const cfg = s !== "ALL" ? statusConfig[s] : null;
              const active = filterStatus === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3 italic ${
                    active
                      ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cfg && <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-amber-500' : cfg.dot}`} />}
                  {s === "ALL" ? "GLOBAL" : statusConfig[s].label}
                  <span className="opacity-40 font-heading tracking-tighter text-xs">[{counts[s]}]</span>
                </button>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative w-full lg:max-w-md group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 group-focus-within:rotate-12 transition-transform" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH MANIFEST BY PASSENGER, BUS, ROUTE…"
              className="w-full bg-card border border-border text-foreground rounded-[24px] h-16 pl-14 pr-8 text-[10px] font-black uppercase tracking-widest focus:border-amber-500 focus:outline-none transition-all shadow-2xl shadow-slate-900/[0.03] placeholder:text-muted-foreground/30 italic"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl shadow-slate-900/[0.04] group"
        >
          <div className="grid grid-cols-[0.8fr_1.2fr_1.5fr_1fr_0.8fr_0.8fr_1fr] gap-6 px-10 py-6 border-b border-border bg-muted/10">
            {["ID VECTOR", "PERSONNEL", "VECTOR SPAN", "ASSET UNIT", "SLOT(S)", "YIELD", "INTEGRITY"].map((h) => (
              <p key={h} className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] italic opacity-40">{h}</p>
            ))}
          </div>
          
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-40 text-center grayscale opacity-40">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-8 animate-pulse" />
                <p className="text-foreground font-black text-2xl font-heading uppercase italic tracking-tighter">NO ENTRIES DETECTED</p>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-2 italic">AWAITING SYSTEM SYNCHRONIZATION</p>
              </motion.div>
            ) : (
              <div className="divide-y divide-border/40">
                {filtered.map((booking, i) => {
                  const seats = booking.bookingSeats.map((bs) => bs.seat.number).join(", ");
                  const dep = new Date(booking.schedule.departure);
                  const isPast = dep < new Date();

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="grid grid-cols-[0.8fr_1.2fr_1.5fr_1fr_0.8fr_0.8fr_1fr] gap-6 px-10 py-8 items-center hover:bg-muted/30 transition-all duration-500 group/row relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                           <Hash className="w-3 h-3 text-amber-500" />
                           <p className="text-foreground text-xs font-black italic tracking-tighter uppercase">{booking.id.slice(0, 8)}</p>
                        </div>
                        <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest flex items-center gap-2 italic opacity-40">
                          <Calendar className="w-3 h-3" />
                          {new Date(booking.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric" }).toUpperCase()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 min-w-0 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shrink-0 group-hover/row:scale-110 transition-transform shadow-lg">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground text-sm font-black uppercase tracking-tight truncate italic mb-1">{booking.user.name}</p>
                          <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest truncate italic opacity-40">{booking.user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 min-w-0 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 group-hover/row:rotate-6 transition-transform">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground text-sm font-black uppercase tracking-tight truncate italic mb-2">
                            {booking.schedule.route.sourceCity} <ChevronRight className="inline w-3 h-3 mx-1 text-amber-500" /> {booking.schedule.route.destinationCity}
                          </p>
                          <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest italic opacity-40 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {dep.toLocaleDateString("en-BD", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).toUpperCase()}
                            {isPast && <span className="text-destructive font-black underline underline-offset-4 tracking-[0.2em] ml-1">LATE</span>}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 min-w-0 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 group-hover/row:-rotate-6 transition-transform">
                          <Bus className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground text-sm font-black uppercase tracking-tight truncate italic mb-1 group-hover/row:text-amber-500 transition-colors">{booking.schedule.bus.name}</p>
                          <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest italic opacity-40">#{booking.schedule.bus.number}</p>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <p className="text-foreground text-sm font-black uppercase italic tracking-tighter mb-1">{seats}</p>
                        <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest italic opacity-40">
                          {booking.bookingSeats.length} SLOT{booking.bookingSeats.length !== 1 ? "S" : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                           <Zap className="w-4 h-4 fill-emerald-500" />
                        </div>
                        <p className="text-foreground text-lg font-black font-heading tracking-tighter italic uppercase">৳{booking.totalFare}</p>
                      </div>

                      <div className="relative z-10">
                         <StatusBadge status={booking.status} />
                      </div>
                      
                      <div className="absolute top-0 left-0 w-1 h-0 bg-amber-500 group-hover/row:h-full transition-all duration-500" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {filtered.length > 0 && (
          <div className="mt-12 pt-10 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-2xl">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 italic mb-1">Operational Diagnostics</p>
                   <p className="text-foreground font-black font-heading text-lg tracking-tighter italic uppercase">MANIFEST SECURE — LINK STABLE</p>
                </div>
             </div>
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic opacity-40">
               SYNCHRONIZED: <span className="text-foreground opacity-100">{filtered.length} OF {bookings.length} ENTRIES DISPLAYED</span>
             </p>
          </div>
        )}
      </div>
    </section>
  );
}
  );
}