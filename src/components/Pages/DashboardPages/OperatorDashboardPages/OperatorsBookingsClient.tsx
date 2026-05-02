"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Bus,
  MapPin,
  User,
  CreditCard,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────
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
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
  };
  bookingSeats: {
    id: string;
    bookingId: string;
    seatId: string;
    seat: {
      id: string;
      busId: string;
      number: string;
      type: string;
      row: number;
      column: number;
      price: number;
    };
  }[];
  schedule: {
    id: string;
    busId: string;
    routeId: string;
    departure: string;
    arrival: string;
    status: string;
    bus: {
      id: string;
      name: string;
      number: string;
      type: string;
    };
    route: {
      id: string;
      sourceCity: string;
      destinationCity: string;
      distanceKm: number;
      estimatedTimeMinutes: number;
    };
  };
}

interface Props {
  bookings: Booking[];
}

// ─── Status Config ────────────────────────────────────────────────────────
const statusConfig: Record<
  BookingStatus,
  { label: string; icon: React.ElementType; cls: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    cls: "bg-amber-400/10 text-amber-400 border-amber-400/30",
    dot: "bg-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle,
    cls: "bg-green-400/10 text-green-400 border-green-400/30",
    dot: "bg-green-400",
  },
  EXPIRED: {
    label: "Expired",
    icon: AlertTriangle,
    cls: "bg-slate-400/10 text-slate-400 border-slate-400/30",
    dot: "bg-slate-400",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    cls: "bg-rose-400/10 text-rose-400 border-rose-400/30",
    dot: "bg-rose-400",
  },
};

// ─── Status Badge ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Update Status Modal ──────────────────────────────────────────────────
interface UpdateModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdated: () => void;
}

function UpdateStatusModal({ booking, onClose, onUpdated }: UpdateModalProps) {
  const [selected, setSelected] = useState<BookingStatus>(booking.status);
  const [loading, setLoading] = useState(false);

  const statuses: BookingStatus[] = ["PENDING", "CONFIRMED", "EXPIRED", "CANCELLED"];

  const handleUpdate = async () => {
    if (selected === booking.status) {
      toast.info("No change made");
      onClose();
      return;
    }
    try {
      setLoading(true);
      // TODO: replace with your actual update service call
      // await updateBookingStatus(booking.id, selected);
      await new Promise((r) => setTimeout(r, 800)); // simulated
      toast.success("Booking status updated!");
      onClose();
      onUpdated();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-[#07111f] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">
          — Update Status
        </p>
        <h2 className="text-white font-black text-xl mb-1">Change Booking</h2>
        <p className="text-slate-500 text-xs mb-6 font-mono">#{booking.id.slice(0, 8)}…</p>

        <div className="space-y-2 mb-6">
          {statuses.map((s) => {
            const cfg = statusConfig[s];
            const Icon = cfg.icon;
            return (
              <button
                key={s}
                onClick={() => setSelected(s)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-semibold ${
                  selected === s
                    ? `${cfg.cls} scale-[1.01]`
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <Icon className="w-4 h-4" />
                {cfg.label}
                {s === booking.status && (
                  <span className="ml-auto text-xs opacity-60">current</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-white/10 bg-white/5 text-slate-300 hover:text-white rounded-xl h-10 text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-xl h-10 text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────
interface DeleteModalProps {
  booking: Booking;
  onClose: () => void;
  onDeleted: () => void;
}

function DeleteModal({ booking, onClose, onDeleted }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      // TODO: replace with your actual delete service call
      // await deleteBooking(booking.id);
      await new Promise((r) => setTimeout(r, 800)); // simulated
      toast.success("Booking deleted!");
      onClose();
      onDeleted();
    } catch {
      toast.error("Failed to delete booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-[#07111f] border border-red-500/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
          <Trash2 className="w-5 h-5" />
        </div>
        <p className="text-red-400 text-xs font-semibold tracking-widest uppercase mb-1">
          — Danger Zone
        </p>
        <h2 className="text-white font-black text-xl mb-2">Delete Booking?</h2>
        <p className="text-slate-400 text-sm mb-6">
          Booking{" "}
          <span className="text-white font-semibold font-mono">#{booking.id.slice(0, 8)}…</span>{" "}
          will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-white/10 bg-white/5 text-slate-300 hover:text-white rounded-xl h-10 text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl h-10 text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Delete
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function OperatorBookingsClient({ bookings }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "ALL">("ALL");
  const [updateTarget, setUpdateTarget] = useState<Booking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);

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
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    EXPIRED: bookings.filter((b) => b.status === "EXPIRED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <section className="bg-[#07111f] min-h-screen py-12 px-4 lg:px-10 relative overflow-hidden">
      {/* Background grid */}
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
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">
            — Operator Dashboard
          </p>
          <h1 className="text-white font-black text-3xl lg:text-4xl">
            Booking <span className="text-amber-400">Management</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">{bookings.length} total bookings</p>
        </motion.div>

        {/* Stat Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
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
                      ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                      : `${cfg!.cls}`
                    : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-slate-300"
                }`}
              >
                {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                {s === "ALL" ? "All" : statusConfig[s].label}
                <span className="opacity-60">
                  ({counts[s]})
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr_0.8fr_0.8fr_0.7fr_auto] gap-4 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
            {["Booking ID", "Passenger", "Route", "Bus", "Seats", "Fare", "Status", "Actions"].map(
              (h) => (
                <p key={h} className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  {h}
                </p>
              )
            )}
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
                    className="grid grid-cols-[1fr_1.2fr_1.2fr_0.8fr_0.8fr_0.7fr_auto] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Booking ID */}
                    <div>
                      <p className="text-white text-xs font-mono font-semibold">
                        #{booking.id.slice(0, 8)}…
                      </p>
                      <p className="text-slate-600 text-xs mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.createdAt).toLocaleDateString("en-BD", {
                          month: "short",
                          day: "numeric",
                        })}
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
                          {dep.toLocaleDateString("en-BD", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isPast && (
                            <span className="ml-1 text-rose-400/70 text-[10px]">(past)</span>
                          )}
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

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setUpdateTarget(booking)}
                        className="w-8 h-8 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 hover:border-amber-400/40 text-amber-400 flex items-center justify-center transition-all"
                        title="Update status"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setDeleteTarget(booking)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 flex items-center justify-center transition-all"
                        title="Delete booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {filtered.length > 0 && (
          <p className="text-slate-600 text-xs text-right mt-3">
            Showing {filtered.length} of {bookings.length} bookings
          </p>
        )}
      </div>

      {/* Update Modal */}
      <AnimatePresence>
        {updateTarget && (
          <UpdateStatusModal
            key={updateTarget.id + "-update"}
            booking={updateTarget}
            onClose={() => setUpdateTarget(null)}
            onUpdated={() => {
              setUpdateTarget(null);
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            key={deleteTarget.id + "-delete"}
            booking={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={() => {
              setDeleteTarget(null);
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}