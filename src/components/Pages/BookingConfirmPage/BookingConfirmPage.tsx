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
    <div className="min-h-screen bg-background flex justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-500/[0.03] rounded-full blur-[120px] -z-10" />
      
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <AnimatePresence mode="wait">
        {/* SUMMARY */}
        {step === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl relative z-10"
          >
            <div className="bg-card border border-border rounded-[48px] shadow-2xl overflow-hidden p-10 lg:p-16">
              {/* Header */}
              <div className="text-center mb-12">
                <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Final Review</p>
                <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6 font-heading tracking-tighter">Booking Summary</h2>
                <div className="flex items-center justify-center gap-3 bg-muted/50 px-6 py-2.5 rounded-full border border-border inline-flex">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-widest">
                    {schedule.route?.sourceCity}
                  </span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-widest">
                    {schedule.route?.destinationCity}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {locks.map((lock, idx) => (
                    <motion.div
                      key={lock.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex justify-between items-center p-6 bg-muted/30 border border-border/50 rounded-3xl hover:bg-muted/50 transition-all duration-300 group"
                    >
                      <div>
                        <p className="font-black text-foreground uppercase text-sm tracking-tight group-hover:text-amber-600 transition-colors">Seat {lock.seat.number}</p>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">{lock.seat.type} Class</p>
                      </div>
                      <span className="font-black text-foreground font-heading text-xl tracking-tight">৳{lock.seat.price.toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-8 border-t border-border mt-8">
                  <div className="flex justify-between items-end px-2">
                    <div>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Investment</p>
                       <p className="text-muted-foreground text-[10px] font-medium italic">Incl. all convenience fees</p>
                    </div>
                    <span className="text-5xl font-black text-foreground font-heading tracking-tighter leading-none">৳{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-10">
                  <Button
                    onClick={() => setStep('confirm')}
                    className="w-full h-16 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all border-none flex items-center justify-center gap-3"
                  >
                    Confirm Details
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CONFIRM */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl relative z-10"
          >
            <div className="bg-card border border-border rounded-[48px] shadow-2xl overflow-hidden p-10 lg:p-16">
              {/* Header */}
              <div className="text-center mb-12">
                <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Security Check</p>
                <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6 font-heading tracking-tighter">Final Confirmation</h2>
                <p className="text-muted-foreground font-medium text-lg italic max-w-xs mx-auto">Please verify your seat selections before proceeding to payment.</p>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-[32px] border border-border/50 p-8 space-y-4">
                  {locks.map((lock) => (
                    <motion.div
                      key={lock.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                          <Check size={12} className="text-emerald-600" />
                        </div>
                        <span className="text-foreground font-black text-sm uppercase tracking-tight">Seat {lock.seat.number}</span>
                      </div>
                      <span className="text-foreground/60 font-black text-sm tracking-tight">৳{lock.seat.price.toLocaleString()}</span>
                    </motion.div>
                  ))}
                  
                  <div className="pt-6 border-t border-border/50 mt-4 flex justify-between items-center">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Aggregate Total</span>
                    <span className="text-2xl font-black text-foreground font-heading tracking-tighter">৳{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-4 pt-6">
                  <Button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="w-full h-16 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all border-none flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Finalizing Booking...</>
                    ) : (
                      <><Zap className="w-5 h-5 text-amber-500" /> Confirm & Proceed</>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setStep('summary')}
                    disabled={isProcessing}
                    className="w-full h-12 rounded-2xl text-muted-foreground hover:bg-muted font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    Return to Summary
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PAYMENT */}
        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl relative z-10"
          >
            <div className="bg-card border border-border rounded-[48px] shadow-2xl overflow-hidden p-10 lg:p-16">
              {/* Header */}
              <div className="text-center mb-12">
                <p className="text-emerald-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Secure Gateway</p>
                <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6 font-heading tracking-tighter">Secure Payment</h2>
                <p className="text-muted-foreground font-medium text-lg italic max-w-xs mx-auto">Complete your transaction securely via our global payment partner.</p>
              </div>

              {/* Content */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 rounded-[40px] bg-slate-900 border border-slate-800 text-center relative overflow-hidden group shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.05] rounded-full blur-3xl -z-0" />
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 relative z-10">Amount Payable</p>
                  <p className="text-6xl font-black text-white font-heading tracking-tighter relative z-10 leading-none">৳{totalPrice.toLocaleString()}</p>
                </motion.div>

                <div className="bg-muted/30 border border-border/50 rounded-[32px] p-8 space-y-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 border-b border-border pb-4">Transaction Details</p>
                  {locks.map((lock) => (
                    <div key={lock.id} className="flex justify-between items-center text-sm font-black uppercase tracking-tight">
                      <span className="text-muted-foreground">Seat {lock.seat.number}</span>
                      <span className="text-foreground">৳{lock.seat.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-4 pt-6">
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full h-16 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-emerald-600/20 active:scale-95 transition-all border-none flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Initializing Stripe...</>
                    ) : (
                      <><Zap className="w-5 h-5 text-white" /> Secure Checkout</>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setStep('confirm')}
                    disabled={isProcessing}
                    className="w-full h-12 rounded-2xl text-muted-foreground hover:bg-muted font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    Back to Details
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}