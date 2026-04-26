import { getMyBookings } from '@/src/services/dashboard-services/bookings';
import {
  Ticket,
  MapPin,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  BusFront,
  Armchair,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingSeat {
  id: string;
  seat: {
    number: string;
    type: string;
    price: number;
  };
}

interface Booking {
  id: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  totalFare: number;
  createdAt: string;
  bookingSeats: BookingSeat[];
  schedule: {
    departure: string;
    arrival: string;
    bus: {
      name: string;
      number: string;
      type: string;
    };
    route: {
      sourceCity: string;
      destinationCity: string;
      distanceKm: number;
      estimatedTimeMinutes: number;
    };
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig: Record<
  string,
  { label: string; cls: string; icon: React.ElementType }
> = {
  CONFIRMED: { label: 'Confirmed', cls: 'bg-green-400/10 text-green-400 border-green-400/20', icon: CheckCircle2 },
  PENDING:   { label: 'Pending',   cls: 'bg-amber-400/10 text-amber-400 border-amber-400/20', icon: Clock        },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-400/10   text-red-400   border-red-400/20',   icon: XCircle      },
  COMPLETED: { label: 'Completed', cls: 'bg-blue-400/10  text-blue-400  border-blue-400/20',  icon: CheckCircle2 },
};

const busTypeLabel: Record<string, string> = {
  AC: 'AC', NON_AC: 'Non-AC', SLEEPER: 'Sleeper', DOUBLE_DECKER: 'Double Decker',
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-BD', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, accent, icon: Icon,
}: {
  label: string; value: number; accent: string; icon: React.ElementType;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">{label}</p>
        <p className="text-white font-black text-2xl" style={{ fontFamily: "'Sora', sans-serif" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking }: { booking: Booking }) {
  const cfg = statusConfig[booking.status] ?? statusConfig.PENDING;
  const StatusIcon = cfg.icon;
  const seatNumbers = booking.bookingSeats.map((bs) => bs.seat.number).join(', ');
  const seatType = booking.bookingSeats[0]?.seat.type ?? '';

  return (
    <div className="bg-white/[0.03] border border-white/10 hover:border-amber-400/20 rounded-2xl p-5 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

        {/* Left */}
        <div className="flex-1 min-w-0">
          {/* Route */}
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-white font-bold text-base">
              {booking.schedule.route.sourceCity}
              <span className="text-slate-500 mx-2">→</span>
              {booking.schedule.route.destinationCity}
            </span>
          </div>

          {/* Bus */}
          <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
            <BusFront className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
            {booking.schedule.bus.name}
            &nbsp;·&nbsp;#{booking.schedule.bus.number}
            &nbsp;·&nbsp;{busTypeLabel[booking.schedule.bus.type] ?? booking.schedule.bus.type}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {fmt(booking.schedule.departure)}
            </span>
            <span className="flex items-center gap-1.5">
              <Armchair className="w-3.5 h-3.5 text-amber-400" />
              Seat {seatNumbers}
              {seatType && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-semibold border border-amber-400/20">
                  {seatType}
                </span>
              )}
            </span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              ৳{booking.totalFare.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${cfg.cls}`}>
            <StatusIcon className="w-3 h-3" />
            {cfg.label}
          </span>
          <p className="text-slate-600 text-xs">{fmt(booking.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AllMyBookings() {
  const res = await getMyBookings();

  const bookings: Booking[] = Array.isArray(res?.data?.data)
    ? res.data.data
    : Array.isArray(res?.data)
    ? res.data
    : [];

  const hasError = !!res && 'error' in res;

  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const pending   = bookings.filter((b) => b.status === 'PENDING').length;
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            — Passenger
          </p>
          <h1
            className="text-4xl lg:text-5xl font-black text-white"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            My <span className="text-amber-400">Bookings</span>
          </h1>
        </div>

        {/* Error */}
        {hasError && (
          <div className="flex items-center gap-3 bg-red-400/10 border border-red-400/20 rounded-2xl p-5 mb-8">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">
              {(res as { error: string }).error ?? 'Failed to load bookings'}
            </p>
          </div>
        )}

        {/* Stats */}
        {!hasError && bookings.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total"     value={bookings.length} accent="bg-amber-400/10 text-amber-400" icon={Ticket}      />
            <StatCard label="Confirmed" value={confirmed}        accent="bg-green-400/10 text-green-400" icon={CheckCircle2} />
            <StatCard label="Pending"   value={pending}          accent="bg-amber-400/10 text-amber-400" icon={Clock}        />
            <StatCard label="Cancelled" value={cancelled}        accent="bg-red-400/10   text-red-400"   icon={XCircle}      />
          </div>
        )}

        {/* Empty */}
        {!hasError && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Ticket className="w-16 h-16 text-slate-700" />
            <p className="text-slate-400 text-lg">You have no bookings yet</p>
          </div>
        )}

        {/* List */}
        {!hasError && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}