/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// app/schedules/[id]/ScheduleDetailClient.tsx

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Bus, ArrowRight, Timer, AlertCircle,
  CheckCircle2, X, Loader2, ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Seat } from '@/src/services/seat.service';
import { createSeatLock, releaseAllLocks } from '@/src/services/seatlock.service';
import { getAvailableSeats } from '@/src/services/seat.service';


// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const seatCls = (seat: Seat, selected: boolean) => {
  if (selected) return 'bg-blue-600 border-blue-700 text-white scale-105 shadow-md shadow-blue-300';
  if (!seat.isAvailable) return 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed';
  if (seat.type === 'VIP') return 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100 hover:scale-105';
  if (seat.type === 'DELUXE') return 'bg-purple-50 border-purple-400 text-purple-700 hover:bg-purple-100 hover:scale-105';
  return 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100 hover:scale-105';
};

// ─── Seat Map ─────────────────────────────────────────────────────────────────

const SeatMap: React.FC<{
  seats: Seat[];
  selected: string[];
  onToggle: (seat: Seat) => void;
}> = ({ seats, selected, onToggle }) => {
  const maxRow = Math.max(...seats.map((s) => s.row), 1);

  return (
    <div className="space-y-2.5">
      {/* Driver */}
      <div className="flex justify-end mb-5">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 text-xs text-gray-500 font-semibold">
          <Bus className="w-4 h-4" /> DRIVER
        </div>
      </div>

      {Array.from({ length: maxRow }).map((_, rowIdx) => {
        const rowSeats = seats
          .filter((s) => s.row === rowIdx + 1)
          .sort((a, b) => a.column - b.column);

        return (
          <div key={rowIdx} className="flex items-center gap-2 justify-center">
            <div className="flex gap-2">
              {rowSeats.filter((s) => s.column <= 2).map((seat) => (
                <motion.button
                  key={seat.id}
                  whileTap={{ scale: 0.9 }}
                  disabled={!seat.isAvailable}
                  onClick={() => onToggle(seat)}
                  title={`${seat.number} — ৳${seat.price} (${seat.type})`}
                  className={`w-10 h-10 rounded-lg border-2 text-xs font-bold transition-all duration-150 ${seatCls(seat, selected.includes(seat.id))}`}
                >
                  {seat.number}
                </motion.button>
              ))}
            </div>
            <div className="w-5 border-r border-dashed border-gray-200 h-6" />
            <div className="flex gap-2">
              {rowSeats.filter((s) => s.column > 2).map((seat) => (
                <motion.button
                  key={seat.id}
                  whileTap={{ scale: 0.9 }}
                  disabled={!seat.isAvailable}
                  onClick={() => onToggle(seat)}
                  title={`${seat.number} — ৳${seat.price} (${seat.type})`}
                  className={`w-10 h-10 rounded-lg border-2 text-xs font-bold transition-all duration-150 ${seatCls(seat, selected.includes(seat.id))}`}
                >
                  {seat.number}
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center pt-4 border-t">
        {[
          { label: 'Standard', cls: 'bg-green-50 border-green-400' },
          { label: 'Deluxe', cls: 'bg-purple-50 border-purple-400' },
          { label: 'VIP', cls: 'bg-amber-50 border-amber-400' },
          { label: 'Selected', cls: 'bg-blue-600 border-blue-700' },
          { label: 'Booked', cls: 'bg-gray-100 border-gray-200' },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded border-2 ${cls}`} />
            <span className="text-xs text-gray-500">{label}</span>
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
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${urgent ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-amber-100 text-amber-700'}`}>
      <Timer className="w-4 h-4" />
      {mins}:{String(s).padStart(2, '0')}
    </div>
  );
};

// ─── Main Client Component ────────────────────────────────────────────────────

interface Props {
  scheduleId: string;
  schedule: any;
  initialSeats: Seat[];
}

export default function ScheduleDetailClient({ scheduleId, schedule, initialSeats }: Props) {
  const router = useRouter();

  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lockExpiry, setLockExpiry] = useState<string | null>(null);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'locked'>('select');

  const handleToggle = (seat: Seat) => {
    if (!seat.isAvailable) return;
    setSelectedIds((prev) =>
      prev.includes(seat.id) ? prev.filter((x) => x !== seat.id) : [...prev, seat.id]
    );
  };

  const handleLock = async () => {
    if (selectedIds.length === 0) return;
    setLocking(true);
    setError(null);

    // ✅ এখন সঠিকভাবে কল করছি
    const res = await createSeatLock(selectedIds, scheduleId);

    setLocking(false);
    if (res.error) { 
      setError(res.error); 
      return; 
    }
    
    // ✅ null check সঠিকভাবে
    if (res.data && res.data.length > 0) {
      setLockExpiry(res.data[0].expiresAt);
    }
    setStep('locked');
  };

  const handleRelease = useCallback(async () => {
    // ✅ সঠিক ফাংশন নাম
    const releaseRes = await releaseAllLocks(scheduleId);
    if (releaseRes.error) {
      setError(releaseRes.error);
      return;
    }

    setSelectedIds([]);
    setLockExpiry(null);
    setStep('select');

    // ✅ Seats রিফ্রেশ করছি
    const seatsRes = await getAvailableSeats(scheduleId);
    if (!seatsRes.error && seatsRes.data) {
      setSeats(seatsRes.data);
    }
  }, [scheduleId]);

  const selectedSeats = seats.filter((s) => selectedIds.includes(s.id));
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-blue-100 hover:text-white mb-4 text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to results
        </button>
        <h1 className="text-2xl font-bold">{schedule.bus?.name}</h1>
        <p className="text-blue-100 text-sm mt-1">{schedule.bus?.type} • {schedule.bus?.number}</p>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Route Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{schedule.route?.sourceCity}</p>
              <p className="text-base text-gray-500 mt-1">{fmt(schedule.departure)}</p>
              <p className="text-xs text-gray-400">{fmtDate(schedule.departure)}</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-14 bg-linear-to-r from-blue-300 to-cyan-300" />
                <ArrowRight className="w-5 h-5 text-blue-400" />
                <div className="h-0.5 w-14 bg-linear-to-r from-cyan-300 to-blue-300" />
              </div>
              <Badge variant="secondary" className="text-xs mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {Math.floor((schedule.route?.estimatedTimeMinutes ?? 0) / 60)}h{' '}
                {(schedule.route?.estimatedTimeMinutes ?? 0) % 60}m
              </Badge>
              <span className="text-xs text-gray-400">{schedule.route?.distanceKm} km</span>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{schedule.route?.destinationCity}</p>
              <p className="text-base text-gray-500 mt-1">{fmt(schedule.arrival)}</p>
              <p className="text-xs text-gray-400">{fmtDate(schedule.arrival)}</p>
            </div>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm flex-1">{error}</p>
              <button onClick={() => setError(null)}><X className="w-4 h-4 text-red-400" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Select Seats</h2>
              {step === 'locked' && lockExpiry && (
                <CountdownTimer expiresAt={lockExpiry} onExpire={handleRelease} />
              )}
            </div>

            {step === 'locked' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-1">Seats Locked!</h3>
                <p className="text-gray-400 text-sm mb-5">Reserved for 10 minutes</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedSeats.map((s) => (
                    <span key={s.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {s.number} ({s.type}) — ৳{s.price}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <SeatMap seats={seats} selected={selectedIds} onToggle={handleToggle} />
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4">Summary</h3>

            {selectedSeats.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No seats selected</p>
            ) : (
              <div className="space-y-2 mb-4">
                {selectedSeats.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Seat {s.number}{' '}
                      <span className="text-xs text-gray-400">({s.type})</span>
                    </span>
                    <span className="font-semibold">৳{s.price}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-blue-600 text-lg">৳{totalPrice}</span>
                </div>
              </div>
            )}

            {step === 'select' ? (
              <Button
                onClick={handleLock}
                disabled={selectedIds.length === 0 || locking}
                className="w-full h-11 rounded-xl font-semibold bg-linear-to-r from-blue-600 to-cyan-600 text-white"
              >
                {locking ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Locking...</>
                ) : (
                  `Lock ${selectedIds.length || ''} Seat${selectedIds.length !== 1 ? 's' : ''}`
                )}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => router.push(`/schedules/${scheduleId}/booking`)}
                  className="w-full h-11 rounded-xl font-semibold bg-linear-to-r from-green-500 to-emerald-600 text-white"
                >
                  Proceed to Book <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRelease}
                  className="w-full h-10 text-sm text-red-500 border-red-200 hover:bg-red-50"
                >
                  Release Seats
                </Button>
              </div>
            )}

            <div className="mt-5 pt-5 border-t space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5" />
                <span>{schedule.bus?.name} ({schedule.bus?.number})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{schedule.route?.sourceCity} → {schedule.route?.destinationCity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}