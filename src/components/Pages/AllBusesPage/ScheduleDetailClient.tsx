

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Bus, ArrowRight, Timer, AlertCircle,
  CheckCircle2, X, Loader2, ChevronLeft, Zap, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Seat } from '@/src/services/seat.service';
import { createSeatLock, releaseAllLocks, SeatLock } from '@/src/services/seatlock.service';
import { getAvailableSeats } from '@/src/services/seat.service';
import { toast } from 'sonner';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const seatCls = (seat: Seat, selected: boolean) => {
  if (selected) return 'bg-amber-500 border-amber-600 text-white scale-105 shadow-xl shadow-amber-500/20 font-bold';
  if (!seat.isAvailable) return 'bg-muted/50 border-border text-muted-foreground/30 cursor-not-allowed';
  if (seat.type === 'VIP') return 'bg-amber-500/5 border-amber-500/20 text-amber-600 hover:bg-amber-500/10 hover:scale-110 transition-all';
  if (seat.type === 'DELUXE') return 'bg-purple-500/5 border-purple-500/20 text-purple-600 hover:bg-purple-500/10 hover:scale-110 transition-all';
  return 'bg-muted/30 border-border text-foreground hover:bg-muted/50 hover:scale-110 transition-all';
};

// ─── Seat Map ─────────────────────────────────────────────────────────────────

const SeatMap: React.FC<{
  seats: Seat[];
  selected: string[];
  onToggle: (seat: Seat) => void;
}> = ({ seats, selected, onToggle }) => {
  const maxRow = Math.max(...seats.map((s) => s.row), 1);

  return (
    <div className="space-y-4">
      {/* Driver */}
      <div className="flex justify-end mb-8">
        <div className="flex items-center gap-3 bg-muted border border-border rounded-2xl px-5 py-2.5 text-xs text-muted-foreground font-medium">
          <Bus className="w-4 h-4" /> Driver
        </div>
      </div>

      {Array.from({ length: maxRow }).map((_, rowIdx) => {
        const rowSeats = seats
          .filter((s) => s.row === rowIdx + 1)
          .sort((a, b) => a.column - b.column);

        return (
          <motion.div
            key={rowIdx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: rowIdx * 0.05 }}
            className="flex items-center gap-4 justify-center"
          >
            <div className="flex gap-3">
              {rowSeats.filter((s) => s.column <= 2).map((seat) => (
                <motion.button
                  key={seat.id}
                  whileTap={{ scale: 0.85 }}
                  disabled={!seat.isAvailable}
                  onClick={() => onToggle(seat)}
                  className={`w-12 h-12 rounded-xl border-2 text-xs font-bold transition-all duration-200 ${seatCls(seat, selected.includes(seat.id))}`}
                >
                  {seat.number}
                </motion.button>
              ))}
            </div>
            <div className="w-8 border-t-2 border-dashed border-border h-0" />
            <div className="flex gap-3">
              {rowSeats.filter((s) => s.column > 2).map((seat) => (
                <motion.button
                  key={seat.id}
                  whileTap={{ scale: 0.85 }}
                  disabled={!seat.isAvailable}
                  onClick={() => onToggle(seat)}
                  className={`w-12 h-12 rounded-xl border-2 text-xs font-bold transition-all duration-200 ${seatCls(seat, selected.includes(seat.id))}`}
                >
                  {seat.number}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-12 justify-center pt-8 border-t border-border">
        {[
          { label: 'Standard', cls: 'bg-muted/30 border-border' },
          { label: 'Deluxe', cls: 'bg-purple-500/5 border-purple-500/20' },
          { label: 'VIP', cls: 'bg-amber-500/5 border-amber-500/20' },
          { label: 'Selected', cls: 'bg-amber-500 border-amber-600' },
          { label: 'Booked', cls: 'bg-muted/50 border-border opacity-50' },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded-lg border-2 ${cls}`} />
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Countdown Timer ──────────────────────────────────────────────────────────

const CountdownTimer: React.FC<{ expiresAt: string; onExpire: () => void }> = ({
  expiresAt, onExpire,
}) => {
  const [secs, setSecs] = React.useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  );

  React.useEffect(() => {
    const id = setInterval(() => {
      setSecs((prev) => {
        if (prev <= 1) { clearInterval(id); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onExpire]);

  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  const urgent = secs < 60;

  return (
    <motion.div
      animate={{ scale: urgent ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 1, repeat: urgent ? Infinity : 0 }}
      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium ${
        urgent
          ? 'bg-destructive/10 text-destructive border border-destructive/20 shadow-lg shadow-destructive/10'
          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
      }`}
    >
      <Timer className="w-4 h-4" />
      {mins}:{String(s).padStart(2, '0')}
    </motion.div>
  );
};

// ─── Main Client Component ────────────────────────────────────────────────────

interface Props {
  scheduleId: string;
  schedule: any;
  initialSeats: Seat[];
  initialLocks: SeatLock[];
}

export default function ScheduleDetailClient({
  scheduleId, schedule, initialSeats, initialLocks,
}: Props) {
  const router = useRouter();

  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => initialLocks.map((l) => l.seatId)
  );
  const [lockExpiry, setLockExpiry] = useState<string | null>(
    () => initialLocks[0]?.expiresAt ?? null
  );
  const [step, setStep] = useState<'select' | 'locked'>(
    () => initialLocks.length > 0 ? 'locked' : 'select'
  );

  const [locking, setLocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (seat: Seat) => {
    if (!seat.isAvailable) return;
    setSelectedIds((prev) =>
      prev.includes(seat.id) ? prev.filter((x) => x !== seat.id) : [...prev, seat.id]
    );
  };

  React.useEffect(() => {
    if (initialLocks.length > 0) {
      toast('Reservation Active!', {
        description: 'Complete your booking or release seats.',
        duration: Infinity,
        action: {
          label: 'Book Now',
          onClick: () => router.push(`/schedules/${scheduleId}/booking`),
        },
      });
    }
  }, []);

  const handleLock = async () => {
    if (selectedIds.length === 0) return;
    setLocking(true);
    setError(null);

    const res = await createSeatLock(selectedIds, scheduleId);

    setLocking(false);
    if (res.error) {
      setError(res.error);
      toast.error('Reservation failed', {
        description: res.error,
      });
      return;
    }

    if (res.data && res.data.length > 0) {
      setLockExpiry(res.data[0].expiresAt);
    }
    setStep('locked');

    toast.success(`${selectedIds.length} seat${selectedIds.length !== 1 ? 's' : ''} reserved!`, {
      description: 'Reserved for 10 minutes. Proceed to booking.',
      duration: 5000,
    });
  };

  const handleRelease = useCallback(async () => {
    const releaseRes = await releaseAllLocks(scheduleId);
    if (releaseRes.error) {
      setError(releaseRes.error);
      return;
    }

    setSelectedIds([]);
    setLockExpiry(null);
    setStep('select');

    const seatsRes = await getAvailableSeats(scheduleId);
    if (!seatsRes.error && seatsRes.data) {
      setSeats(seatsRes.data);
    }
  }, [scheduleId]);

  const selectedSeats = seats.filter((s) => selectedIds.includes(s.id)).length > 0
    ? seats.filter((s) => selectedIds.includes(s.id))
    : initialLocks.map((l) => l.seat);
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const availableCount = seats.filter((s) => s.isAvailable).length;

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-muted/20 border-b border-border py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-amber-600 hover:text-amber-500 mb-8 text-xs font-medium transition-all group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Fleet
                </button>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                  {schedule.bus?.name}
                </h1>
                <div className="flex items-center gap-4">
                  <Badge className="bg-amber-500 text-white border-none px-4 py-1.5 rounded-xl text-xs font-bold">
                    {schedule.bus?.type}
                  </Badge>
                  <span className="text-muted-foreground text-xs font-medium">
                    Bus: {schedule.bus?.number}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card border border-border p-8 rounded-[40px] shadow-2xl flex items-center gap-8"
              >
                <div className="text-center px-6 border-r border-border last:border-none">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Available Seats</p>
                  <p className="text-4xl font-bold text-foreground">{availableCount}</p>
                  <p className="text-xs font-medium text-amber-600 mt-1">remaining</p>
                </div>
                <div className="text-center px-6">
                   <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
                      <Zap className="w-6 h-6 fill-amber-500" />
                   </div>
                </div>
              </motion.div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 space-y-12">
        {/* ROUTE INFO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-[48px] p-12 lg:p-20 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl -z-10" />
          
          <div className="grid md:grid-cols-3 gap-16 items-center">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground mb-4">From</p>
              <h3 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{schedule.route?.sourceCity}</h3>
              <p className="text-2xl text-amber-600 font-semibold">{fmt(schedule.departure)}</p>
              <p className="text-xs font-medium text-muted-foreground/60 mt-2">{fmtDate(schedule.departure)}</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative w-full flex items-center justify-center">
                 <div className="absolute w-full h-px bg-border" />
                 <div className="relative z-10 w-16 h-16 bg-muted rounded-full border border-border flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-500">
                    <ArrowRight className="w-8 h-8 text-muted-foreground group-hover:text-white transition-colors" />
                 </div>
              </div>
              <div className="text-center">
                <Badge className="bg-muted text-foreground border-border px-5 py-2 rounded-full text-xs font-bold mb-2 shadow-sm">
                  {Math.floor((schedule.route?.estimatedTimeMinutes ?? 0) / 60)}H {(schedule.route?.estimatedTimeMinutes ?? 0) % 60}M
                </Badge>
                <p className="text-xs font-medium text-muted-foreground">{schedule.route?.distanceKm} km distance</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground mb-4">To</p>
              <h3 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{schedule.route?.destinationCity}</h3>
              <p className="text-2xl text-amber-600 font-semibold">{fmt(schedule.arrival)}</p>
              <p className="text-xs font-medium text-muted-foreground/60 mt-2">{fmtDate(schedule.arrival)}</p>
            </div>
          </div>
        </motion.div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-destructive/5 border border-destructive/20 rounded-3xl p-6 flex items-start gap-4 shadow-xl"
            >
              <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
              <p className="text-destructive font-medium text-sm flex-1">{error}</p>
              <button onClick={() => setError(null)} className="hover:scale-110 transition-transform">
                <X className="w-5 h-5 text-destructive/40" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* SEAT SELECTION MAP */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-card border border-border rounded-[48px] p-10 lg:p-16 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <Users className="w-5 h-5" />
                 </div>
                 <h2 className="text-3xl font-bold text-foreground">Select Seats</h2>
              </div>
              {step === 'locked' && lockExpiry && (
                <CountdownTimer expiresAt={lockExpiry} onExpire={handleRelease} />
              )}
            </div>

            {step === 'locked' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-4">Reservation Successful</h3>
                <p className="text-muted-foreground font-medium text-lg mb-10 max-w-sm mx-auto">Your seats are secured for the next 10 minutes. Please finalize your details.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {selectedSeats.map((s) => (
                    <Badge key={s.id} className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-5 py-2.5 rounded-2xl text-xs font-medium shadow-sm">
                      {s.number} • {s.type} • ৳{s.price}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ) : (
              <SeatMap seats={seats} selected={selectedIds} onToggle={handleToggle} />
            )}
          </motion.div>

          {/* SUMMARY & ACTION */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-card border border-border rounded-[48px] p-10 shadow-2xl sticky top-32">
              <h3 className="text-sm font-medium text-muted-foreground mb-10 text-center">Travel Summary</h3>
              
              {selectedSeats.length === 0 ? (
                <div className="text-center py-16 opacity-30">
                   <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <Bus className="w-8 h-8" />
                   </div>
                   <p className="text-xs font-medium">No seats selected</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedSeats.map((s) => (
                      <div key={s.id} className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
                        <div>
                          <p className="text-foreground font-semibold text-sm">Seat {s.number}</p>
                          <p className="text-xs font-medium text-muted-foreground">{s.type} Class</p>
                        </div>
                        <p className="text-amber-600 font-semibold text-lg">৳{s.price}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-8 border-t border-border flex flex-col gap-2">
                    <div className="flex justify-between items-center px-2">
                       <span className="text-xs font-medium text-muted-foreground">Total Amount</span>
                       <span className="text-4xl font-bold text-foreground">৳{totalPrice}</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground px-2 opacity-50">Including all convenience fees</p>
                  </div>

                  <div className="pt-8 space-y-4">
                    {step === 'select' ? (
                      <Button
                        onClick={handleLock}
                        disabled={selectedIds.length === 0 || locking}
                        className="w-full h-16 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-2xl shadow-slate-900/20 active:scale-95 transition-all border-none"
                      >
                        {locking ? (
                          <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processing...</>
                        ) : (
                          `Reserve ${selectedIds.length} Seat${selectedIds.length !== 1 ? 's' : ''}`
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => router.push(`/schedules/${scheduleId}/booking`)}
                          className="w-full h-16 rounded-3xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-base shadow-2xl shadow-amber-500/20 active:scale-95 transition-all border-none flex items-center justify-center gap-3"
                        >
                          Checkout Securely <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleRelease}
                          className="w-full h-12 rounded-2xl text-destructive hover:bg-destructive/10 font-medium text-base transition-all"
                        >
                          Cancel Reservation
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}