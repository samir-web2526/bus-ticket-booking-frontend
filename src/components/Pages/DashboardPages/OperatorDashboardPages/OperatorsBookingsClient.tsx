"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, CheckCircle, XCircle, AlertTriangle,
  Search, Filter, Bus, MapPin, User, CreditCard, Calendar,
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
  PENDING:   { label: "Pending",   icon: Clock,          cls: "bg-amber-400/10 text-amber-400 border-amber-400/30", dot: "bg-amber-400"  },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle,    cls: "bg-green-400/10 text-green-400 border-green-400/30", dot: "bg-green-400"  },
  EXPIRED:   { label: "Expired",   icon: AlertTriangle,  cls: "bg-slate-400/10 text-slate-400 border-slate-400/30", dot: "bg-slate-400"  },
  CANCELLED: { label: "Cancelled", icon: XCircle,        cls: "bg-rose-400/10  text-rose-400  border-rose-400/30",  dot: "bg-rose-400"   },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
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
    <section className="bg-[#07111f] min-h-screen py-12 px-4 lg:px-10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,180,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">— Operator Dashboard</p>
          <h1 className="text-white font-black text-3xl lg:text-4xl">
            Booking <span className="text-amber-400">Management</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">{bookings.length} total bookings</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {(["ALL", "PENDING", "CONFIRMED", "EXPIRED", "CANCELLED"] as const).map((s) => {
            const cfg = s !== "ALL" ? statusConfig[s] : null;
            const active = filterStatus === s;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  active
                    ? s === "ALL" ? "bg-amber-400/10 border-amber-400/30 text-amber-400" : cfg!.cls
                    : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-slate-300"
                }`}
              >
                {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                {s === "ALL" ? "All" : statusConfig[s].label}
                <span className="opacity-60">({counts[s]})</span>
              </button>
            );
          })}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative mb-6 max-w-md"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by passenger, bus, route…"
            className="w-full bg-white/[0.03] border border-white/10 text-white rounded-xl h-10 pl-9 pr-4 text-sm focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/10 transition-colors placeholder:text-slate-600"
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr_0.8fr_0.8fr_0.7fr_0.8fr] gap-4 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
            {["Booking ID", "Passenger", "Route", "Bus", "Seats", "Fare", "Status"].map((h) => (
              <p key={h} className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{h}</p>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No bookings found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((booking, i) => {
                const seats = booking.bookingSeats.map((bs) => bs.seat.number).join(", ");
                const dep = new Date(booking.schedule.departure);
                const isPast = dep < new Date();

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[1fr_1.2fr_1.2fr_0.8fr_0.8fr_0.7fr_0.8fr] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Booking ID */}
                    <div>
                      <p className="text-white text-xs font-mono font-semibold">#{booking.id.slice(0, 8)}…</p>
                      <p className="text-slate-600 text-xs mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric" })}
                      </p>
                    </div>

                    {/* Passenger */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{booking.user.name}</p>
                        <p className="text-slate-500 text-xs truncate">{booking.user.email}</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">
                          {booking.schedule.route.sourceCity} → {booking.schedule.route.destinationCity}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {dep.toLocaleDateString("en-BD", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          {isPast && <span className="ml-1 text-rose-400/70 text-[10px]">(past)</span>}
                        </p>
                      </div>
                    </div>

                    {/* Bus */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{booking.schedule.bus.name}</p>
                        <p className="text-slate-500 text-[10px]">{booking.schedule.bus.type}</p>
                      </div>
                    </div>

                    {/* Seats */}
                    <div>
                      <p className="text-white text-xs font-semibold">{seats}</p>
                      <p className="text-slate-500 text-[10px]">
                        {booking.bookingSeats.length} seat{booking.bookingSeats.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Fare */}
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <p className="text-amber-400 text-xs font-bold">৳{booking.totalFare}</p>
                    </div>

                    {/* Status */}
                    <StatusBadge status={booking.status} />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {filtered.length > 0 && (
          <p className="text-slate-600 text-xs text-right mt-3">
            Showing {filtered.length} of {bookings.length} bookings
          </p>
        )}
      </div>
    </section>
  );
}