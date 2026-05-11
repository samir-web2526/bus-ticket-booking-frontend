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

        <p className="text-emerald-600 text-sm font-medium uppercase tracking-wide mb-4">Transaction Complete</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Payment Received</h1>
        
        <p className="text-muted-foreground text-lg font-normal leading-relaxed max-w-md mx-auto mb-12">
          Your booking has been successfully processed. An e-ticket has been sent to your registered email address.
        </p>

        {sessionId && (
           <div className="bg-muted/30 border border-border/50 rounded-2xl py-4 px-6 mb-12 inline-flex flex-col items-center">
              <p className="text-xs font-medium text-muted-foreground mb-1">Receipt ID</p>
              <p className="text-foreground font-medium text-sm opacity-70 font-mono">
                {sessionId.slice(0, 12)}...{sessionId.slice(-8)}
              </p>
           </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/passenger-dashboard/my-bookings">
            <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-xl shadow-slate-900/20 active:scale-95 transition-all border-none flex items-center justify-center gap-3">
              <Ticket className="w-4 h-4 text-amber-500" />
              View Tickets
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-border text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-base transition-all flex items-center justify-center gap-3">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="mt-10 text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
          Securely processed by <span className="text-foreground opacity-70">Stripe</span>
        </p>
      </motion.div>
    </div>
  );
}