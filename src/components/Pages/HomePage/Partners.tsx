'use client';

import { motion } from 'framer-motion';

const partners = [
  { name: 'Green Line', logo: 'GL' },
  { name: 'Hanif Enterprise', logo: 'HE' },
  { name: 'Ena Transport', logo: 'ET' },
  { name: 'Shyamoli Paribahan', logo: 'SP' },
  { name: 'Saintmartin Travels', logo: 'ST' },
  { name: 'Shohag Paribahan', logo: 'SH' },
];

export default function PartnersSection() {
  return (
    <section className="py-24 bg-background border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-6">Strategic Alliances</p>
        <h2 className="text-3xl lg:text-5xl font-black text-foreground font-heading tracking-tighter">Trusted by 100+ <span className="text-amber-500 italic">Elite Operators</span></h2>
      </div>
      
      <div className="flex overflow-hidden relative group">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div 
          className="flex gap-20 py-4 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...partners, ...partners, ...partners].map((p, i) => (
            <div key={i} className="flex items-center gap-5 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group/partner">
              <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center font-black text-muted-foreground group-hover/partner:bg-slate-900 group-hover/partner:text-white group-hover/partner:border-slate-800 transition-all duration-500 shadow-sm group-hover/partner:shadow-2xl">
                {p.logo}
              </div>
              <span className="text-2xl font-black text-foreground font-heading tracking-tighter">{p.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
