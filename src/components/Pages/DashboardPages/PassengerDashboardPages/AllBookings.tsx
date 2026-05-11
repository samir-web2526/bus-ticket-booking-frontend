import { getMyBookings } from '@/src/services/dashboard-services/bookings';
import {
  Ticket, MapPin, Calendar, CreditCard, AlertCircle,
  CheckCircle2, XCircle, Clock, BusFront, Armchair, Banknote, ArrowRight, ArrowRightCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  totalFare: number;
  createdAt: string;
  bookingSeats: BookingSeat[];
  payment: Payment | null;
  schedule: {
    departure: string;
    arrival: string;
    bus: { name: string; number: string; type: string };
    route: {
      sourceCity: string;
      destinationCity: string;
      distanceKm: number;
      estimatedTimeMinutes: number;
    };
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const bookingStatusConfig: Record<string, { label: string; cls: string; dot: string; icon: React.ElementType }> = {
  CONFIRMED: { label: 'Confirmed', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dot: 'bg-emerald-500', icon: CheckCircle2 },
  PENDING:   { label: 'Pending',   cls: 'bg-amber-500/10  text-amber-600  border-amber-500/20',    dot: 'bg-amber-500', icon: Clock        },
  CANCELLED: { label: 'Cancelled', cls: 'bg-destructive/10 text-destructive border-destructive/20', dot: 'bg-destructive', icon: XCircle      },
  COMPLETED: { label: 'Completed', cls: 'bg-blue-500/10   text-blue-600   border-blue-500/20',     dot: 'bg-blue-500', icon: CheckCircle2 },
};

const busTypeLabel: Record<string, string> = {
  AC: 'Premium AC', NON_AC: 'Standard', SLEEPER: 'Sleeper', DOUBLE_DECKER: 'Double Decker',
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-BD', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, accent, icon: Icon, primary = false
}: {
  label: string; value: number; accent: string; icon: React.ElementType; primary?: boolean;
}) {
  return (
    <div className={`rounded-[32px] p-6 border transition-all duration-300 ${primary ? 'bg-slate-900 border-slate-800 text-white shadow-xl shadow-slate-900/20' : 'bg-card border-border shadow-sm'} flex items-center gap-5`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${primary ? 'bg-white/10 border border-white/10' : 'bg-muted border border-border'}`}>
        <Icon className={`w-6 h-6 ${primary ? 'text-amber-500' : 'text-amber-600'}`} />
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${primary ? 'text-slate-400' : 'text-muted-foreground'}`}>{label}</p>
        <p className="font-black text-2xl font-heading tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Payment Badge ────────────────────────────────────────────────────────────

function PaymentBadge({ payment }: { payment: Payment | null }) {
  if (!payment) return null;
  const isPaid = payment.status === 'PAID';
  return (
    <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
      isPaid
        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
        : 'bg-destructive/10 text-destructive border-destructive/20'
    }`}>
      <Banknote className="w-3 h-3" />
      {isPaid ? 'Secured' : 'Unpaid'}
    </span>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: Booking }) {
  const cfg = bookingStatusConfig[booking.status] ?? bookingStatusConfig.PENDING;
  const StatusIcon = cfg.icon;
  const seatNumbers = booking.bookingSeats.map((bs) => bs.seat.number).join(', ');
  const seatType = booking.bookingSeats[0]?.seat.type ?? '';

  return (
    <div className="bg-card border border-border hover:border-amber-500/30 hover:shadow-2xl hover:shadow-slate-900/[0.03] rounded-[40px] p-8 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        {/* Left Section: Route & Bus */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:bg-slate-900 group-hover:border-slate-800 transition-all duration-500">
              <BusFront className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <p className="text-foreground font-black text-xl font-heading tracking-tight italic uppercase">
                   {booking.schedule.route.sourceCity}
                 </p>
                 <ArrowRightCircle className="w-4 h-4 text-muted-foreground/30" />
                 <p className="text-foreground font-black text-xl font-heading tracking-tight italic uppercase">
                   {booking.schedule.route.destinationCity}
                 </p>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                {booking.schedule.bus.name} · {busTypeLabel[booking.schedule.bus.type] ?? booking.schedule.bus.type}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Departure</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-black text-foreground uppercase tracking-tight italic">{fmt(booking.schedule.departure)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Selected Seats</p>
              <div className="flex items-center gap-2">
                <Armchair className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-black text-foreground uppercase tracking-tight">{seatNumbers}</span>
                {seatType && (
                   <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[8px] font-black uppercase tracking-widest border border-border">
                     {seatType}
                   </span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Fare</p>
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-sm font-black text-foreground font-heading italic">৳{booking.totalFare.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Status & Actions */}
        <div className="flex flex-col items-start lg:items-end gap-4 shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-border lg:pl-8 lg:border-l">
          <div className={`flex items-center gap-2 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${cfg.cls} shadow-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
            <StatusIcon className="w-3.5 h-3.5" />
            {cfg.label}
          </div>
          
          <div className="flex items-center gap-3">
             <PaymentBadge payment={booking.payment} />
             <span className="text-muted-foreground text-[9px] font-black uppercase tracking-widest italic opacity-40">
               Booked {fmt(booking.createdAt)}
             </span>
          </div>

          <button className="hidden lg:flex items-center gap-2 text-[10px] font-black text-amber-600 hover:text-amber-500 uppercase tracking-widest transition-all group-hover:translate-x-1">
             Download Ticket <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AllMyBookings() {
  const res = await getMyBookings();
  const bookings: Booking[] = Array.isArray(res?.data) ? res.data : [];
  const hasError = !!res?.error;

  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const pending   = bookings.filter((b) => b.status === 'PENDING').length;
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Decorative bg elements */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.02] rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="text-amber-600 text-[10px] font-black tracking-[0.5em] uppercase mb-5 italic">— COMMAND HISTORY</p>
            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter font-heading uppercase italic">
              MY <span className="text-amber-500">BOOKINGS</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 bg-card border border-border px-8 py-4 rounded-[32px] shadow-2xl shadow-slate-900/[0.03] backdrop-blur-xl">
             <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-foreground text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">ACTIVE SESSION</span>
             </div>
             <div className="w-[1px] h-4 bg-border/50" />
             <div className="flex items-center gap-3">
                <Ticket className="w-4 h-4 text-amber-500" />
                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">{bookings.length} TOTAL LOGS</span>
             </div>
          </div>
        </div>

        {/* Error */}
        {hasError && (
          <div className="flex items-center gap-6 bg-destructive/5 border border-destructive/20 rounded-[40px] p-8 mb-12 shadow-2xl backdrop-blur-sm">
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center border border-destructive/20 shrink-0">
               <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
               <p className="text-destructive text-[10px] font-black uppercase tracking-[0.3em] mb-1 italic leading-none">SYSTEM SYNC FAILURE</p>
               <p className="text-foreground/70 text-sm font-medium italic">
                 {(res as { error: string }).error ?? 'Failed to synchronize booking database'}
               </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {!hasError && bookings.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <StatCard label="Total Log"     value={bookings.length} accent="" icon={Ticket} primary />
            <StatCard label="Confirmed"    value={confirmed}       accent="" icon={CheckCircle2} />
            <StatCard label="Action Needed" value={pending}         accent="" icon={Clock} />
            <StatCard label="Cancelled"    value={cancelled}       accent="" icon={XCircle} />
          </div>
        )}

        {/* Empty State */}
        {!hasError && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[56px] grayscale opacity-40">
            <div className="w-24 h-24 bg-muted rounded-[40px] flex items-center justify-center mb-8 shadow-xl">
               <Ticket className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-foreground font-black text-3xl font-heading tracking-tighter mb-4 italic uppercase">NO ACTIVE SESSIONS</h3>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.3em] italic">START YOUR JOURNEY BY EXPLORING THE VECTOR NETWORK</p>
          </div>
        )}

        {/* Bookings List */}
        {!hasError && bookings.length > 0 && (
          <div className="space-y-10">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <BookingCard booking={booking} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-24 pt-12 border-t border-border/30">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">MANAGING <span className="text-foreground font-black">{bookings.length}</span> SECURED TRANSACTIONS — DATA ENCRYPTED</p>
        </div>
      </div>
    </section>
  );
}