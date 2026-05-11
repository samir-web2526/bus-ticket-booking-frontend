'use client';

import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsletterSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card border border-border shadow-2xl rounded-[64px] p-10 md:p-20 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] bg-amber-500/5 rounded-full blur-[100px] rotate-12" />

          <div className="relative z-10 grid lg:grid-cols-2 items-center gap-20">
            <div>
              <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-8">Newsletter</p>
              <h2 className="text-4xl lg:text-7xl font-black text-foreground font-heading leading-tight mb-8 tracking-tighter">
                Don&apos;t miss the <br /><span className="text-amber-500 italic">Elite Deals.</span>
              </h2>
              <p className="text-muted-foreground text-xl font-medium mb-12 max-w-lg leading-relaxed italic">
                Subscribe to our newsletter and be the first to receive exclusive discounts, luxury travel guides, and new route alerts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Your primary email address"
                    className="h-16 px-8 rounded-2xl border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-amber-500/50 shadow-xl"
                  />
                </div>
                <Button className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/20 flex items-center gap-3 border-none transition-all active:scale-95">
                  Subscribe
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              <div className="mt-12 flex flex-wrap gap-8">
                {['Weekly updates', 'No spam policy', 'Cancel anytime'].map(text => (
                  <div key={text} className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <motion.div
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-96 h-96 bg-background rounded-[80px] border border-border flex items-center justify-center shadow-2xl relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-50 rounded-[80px]" />
                <div className="w-72 h-72 bg-card rounded-[48px] shadow-inner p-10 flex flex-col justify-center gap-6 border border-border relative z-10">
                  <div className="w-14 h-14 bg-amber-500 rounded-2xl mb-2 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Send className="w-7 h-7 text-white" />
                  </div>
                  <div className="h-4 w-full bg-muted rounded-full" />
                  <div className="h-4 w-2/3 bg-muted rounded-full" />
                  <div className="mt-4 h-14 w-full bg-amber-500/10 rounded-2xl flex items-center px-6">
                    <div className="h-2 w-32 bg-amber-500 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
