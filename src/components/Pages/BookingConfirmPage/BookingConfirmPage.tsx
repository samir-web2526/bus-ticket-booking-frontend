'use client';

import { useState } from 'react';
import { Check, ChevronRight, Loader2, MapPin, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createBooking } from '@/src/services/booking.service';
import { createPayment } from '@/src/services/payment.service';

interface Seat {
  id: string;
  number: string;
  type: string;
  price: number;
}

interface Lock {
  id: string;
  seat: Seat;
}

interface Schedule {
  id: string;
  route?: {
    sourceCity: string;
    destinationCity: string;
  };
}

interface Props {
  locks: Lock[];
  schedule: Schedule;
}

export default function BookingConfirmPage({ locks, schedule }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<'summary' | 'confirm' | 'payment'>(
    'summary'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalPrice = locks.reduce((sum, l) => sum + l.seat.price, 0);

  const handleConfirm = async () => {
    setIsProcessing(true);

    const { data, error } = await createBooking(schedule.id);

    setIsProcessing(false);

    if (error || !data) {
      toast.error(error ?? 'Booking failed. Please try again.');
      return;
    }

    setBookingId(data.id);
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!bookingId) {
      toast.error('Booking not found. Please go back and try again.');
      return;
    }

    setIsProcessing(true);

    const { data, error } = await createPayment(bookingId);

    setIsProcessing(false);

    if (error || !data?.checkoutUrl) {
      toast.error(error ?? 'Payment initialization failed.');
      return;
    }

    window.location.href = data.checkoutUrl;
  };

  return (
    <div className="min-h-screen bg-[#050d1a] flex justify-center items-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient accent */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <AnimatePresence mode="wait">
        {/* SUMMARY */}
        {step === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 px-8 py-6 border-b border-white/10">
                <h2 className="text-2xl font-black text-white mb-1">Booking Summary</h2>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  {schedule.route?.sourceCity} → {schedule.route?.destinationCity}
                </p>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-4">
                {locks.map((lock, idx) => (
                  <motion.div
                    key={lock.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-white">Seat {lock.seat.number}</p>
                      <p className="text-xs text-slate-500">{lock.seat.type}</p>
                    </div>
                    <span className="font-bold text-amber-400">৳{lock.seat.price.toLocaleString()}</span>
                  </motion.div>
                ))}

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-3xl font-black text-amber-400">৳{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('confirm')}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                >
                  Proceed to Confirm
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* CONFIRM */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 px-8 py-6 border-b border-white/10">
                <h2 className="text-2xl font-black text-white">Confirm Booking</h2>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-4">
                {/* Seats List */}
                <ScrollArea className="h-48 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="space-y-2">
                    {locks.map((lock) => (
                      <motion.div
                        key={lock.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex gap-2 items-center">
                          <Check size={16} className="text-amber-400" />
                          <span className="text-white font-medium">Seat {lock.seat.number}</span>
                        </div>
                        <span className="text-amber-400 font-semibold">৳{lock.seat.price.toLocaleString()}</span>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-3xl font-black text-amber-400">৳{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('summary')}
                    disabled={isProcessing}
                    className="w-full border-2 border-white/20 hover:border-white/40 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:from-amber-400/50 disabled:to-amber-500/50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Booking...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Confirm Booking
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PAYMENT */}
        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 px-8 py-6 border-b border-white/10">
                <h2 className="text-2xl font-black text-white mb-1">Payment</h2>
                <p className="text-slate-400 text-sm">
                  You'll be redirected to Stripe to complete payment securely.
                </p>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/30"
                >
                  <p className="text-slate-400 text-sm mb-2">Amount to Pay</p>
                  <p className="text-4xl font-black text-amber-400">৳{totalPrice.toLocaleString()}</p>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Booking Details</p>
                  {locks.map((lock) => (
                    <div key={lock.id} className="flex justify-between text-sm">
                      <span className="text-slate-400">Seat {lock.seat.number}</span>
                      <span className="text-white font-semibold">৳{lock.seat.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('confirm')}
                    disabled={isProcessing}
                    className="w-full border-2 border-white/20 hover:border-white/40 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-green-500/50 disabled:to-emerald-600/50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Pay ৳{totalPrice.toLocaleString()}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}