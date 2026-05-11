"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Home, Ticket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card border border-border rounded-[48px] p-12 lg:p-20 text-center max-w-2xl w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </motion.div>

        <p className="text-emerald-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Transaction Complete</p>
        <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-6 font-heading tracking-tighter">Payment Received</h1>
        
        <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md mx-auto mb-12 italic">
          Your booking has been successfully processed. An e-ticket has been sent to your registered email address.
        </p>

        {sessionId && (
           <div className="bg-muted/30 border border-border/50 rounded-2xl py-4 px-6 mb-12 inline-flex flex-col items-center">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Receipt ID</p>
              <p className="text-foreground font-black text-xs uppercase tracking-tight opacity-60 font-mono">
                {sessionId.slice(0, 12)}...{sessionId.slice(-8)}
              </p>
           </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/passenger-dashboard/my-bookings">
            <Button className="w-full h-16 rounded-[24px] bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all border-none flex items-center justify-center gap-3">
              <Ticket className="w-4 h-4 text-amber-500" />
              View Tickets
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full h-16 rounded-[24px] border-border text-muted-foreground hover:bg-muted hover:text-foreground font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="mt-12 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          Securely processed by <span className="text-foreground opacity-60">Stripe Global</span>
        </p>
      </motion.div>
    </div>
  );
}