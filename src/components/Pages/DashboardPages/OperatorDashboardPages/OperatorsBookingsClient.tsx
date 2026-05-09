"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  PENDING:   { label: "Pending",   icon: Clock,         cls: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400"  },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle,   cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  EXPIRED:   { label: "Expired",   icon: AlertTriangle, cls: "bg-gray-100 text-gray-500 border-gray-200",     dot: "bg-gray-400"   },
  CANCELLED: { label: "Cancelled", icon: XCircle,       cls: "bg-red-50 text-red-600 border-red-200",         dot: "bg-red-400"    },
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
    <section className="bg-white min-h-screen py-24 px-4 lg:px-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">— Operator Dashboard</p>
          <h1 className="text-gray-900 font-black text-3xl lg:text-4xl">
            Booking <span className="text-gray-500">Management</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">{bookings.length} total bookings</p>
        </motion.div>

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
                    ? s === "ALL"
                      ? "bg-gray-900 border-gray-900 text-white"
                      : cfg!.cls
                    : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                {s === "ALL" ? "All" : statusConfig[s].label}
                <span className="opacity-60">({counts[s]})</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative mb-6 max-w-md"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by passenger, bus, route…"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl h-10 pl-9 pr-4 text-sm focus:border-gray-400 focus:outline-none transition-colors placeholder:text-gray-400"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr_0.8fr_0.8fr_0.7fr_0.8fr] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
            {["Booking ID", "Passenger", "Route", "Bus", "Seats", "Fare", "Status"].map((h) => (
              <p key={h} className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</p>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Filter className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No bookings found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
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
                    className="grid grid-cols-[1fr_1.2fr_1.2fr_0.8fr_0.8fr_0.7fr_0.8fr] gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-gray-900 text-xs font-mono font-semibold">#{booking.id.slice(0, 8)}…</p>
                      <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-900 text-xs font-semibold truncate">{booking.user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{booking.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-gray-900 text-xs font-semibold truncate">
                          {booking.schedule.route.sourceCity} → {booking.schedule.route.destinationCity}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {dep.toLocaleDateString("en-BD", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          {isPast && <span className="ml-1 text-red-400 text-[10px]">(past)</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <Bus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-gray-900 text-xs font-semibold truncate">{booking.schedule.bus.name}</p>
                        <p className="text-gray-400 text-[10px]">{booking.schedule.bus.type}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-900 text-xs font-semibold">{seats}</p>
                      <p className="text-gray-400 text-[10px]">
                        {booking.bookingSeats.length} seat{booking.bookingSeats.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <p className="text-gray-900 text-xs font-bold">৳{booking.totalFare}</p>
                    </div>

                    <StatusBadge status={booking.status} />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {filtered.length > 0 && (
          <p className="text-gray-400 text-xs text-right mt-3">
            Showing {filtered.length} of {bookings.length} bookings
          </p>
        )}
      </div>
    </section>
  );
}