'use client';

import { motion } from 'framer-motion';
import { Smartphone, Apple, PlayCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppDownloadSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-card border border-border shadow-2xl rounded-[48px] p-10 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex-1 text-center lg:text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-6xl font-black text-foreground font-heading leading-tight mb-6">
                Booking on the go is <span className="text-amber-500">Easier</span> than ever.
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto lg:mx-0 font-medium">
                Get the BusHub app for exclusive mobile-only discounts, real-time tracking, and easy ticket management.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-8 rounded-2xl flex items-center gap-3 border-none shadow-lg">
                  <Apple className="w-6 h-6 fill-current" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-300 leading-none">Download on</p>
                    <p className="text-lg font-black leading-none mt-1">App Store</p>
                  </div>
                </Button>
                <Button className="bg-amber-500 hover:bg-amber-400 text-white h-16 px-8 rounded-2xl flex items-center gap-3 border-none shadow-lg shadow-amber-100">
                  <PlayCircle className="w-6 h-6 fill-current" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-amber-100 leading-none">Get it on</p>
                    <p className="text-lg font-black leading-none mt-1">Google Play</p>
                  </div>
                </Button>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      U{i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                    <span className="text-foreground font-bold ml-2 text-sm">4.9/5</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">Trusted by 100k+ mobile users</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center relative lg:mb-[-120px]"
          >
            <div className="w-[300px] h-[600px] bg-card rounded-[50px] border-[8px] border-border relative shadow-2xl overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent" />
               <div className="p-6 mt-10">
                 <div className="w-12 h-12 bg-amber-500 rounded-xl mb-4" />
                 <div className="w-full h-4 bg-muted rounded-full mb-2" />
                 <div className="w-2/3 h-4 bg-muted rounded-full mb-8" />
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-muted/50 rounded-2xl" />
                    <div className="h-24 bg-muted/50 rounded-2xl" />
                    <div className="h-24 bg-muted/50 rounded-2xl" />
                    <div className="h-24 bg-muted/50 rounded-2xl" />
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
