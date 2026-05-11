'use client';

import { motion } from 'framer-motion';
import { Users, Route, Bus, Globe } from 'lucide-react';

const stats = [
  { icon: <Users className="w-6 h-6" />, value: '250K+', label: 'Happy Travelers', color: 'bg-amber-100 text-amber-600' },
  { icon: <Route className="w-6 h-6" />, value: '1,200+', label: 'Daily Routes', color: 'bg-emerald-100 text-emerald-600' },
  { icon: <Bus className="w-6 h-6" />, value: '450+', label: 'Active Buses', color: 'bg-blue-100 text-blue-600' },
  { icon: <Globe className="w-6 h-6" />, value: '64', label: 'Cities Covered', color: 'bg-rose-100 text-rose-600' },
];

export default function StatsSection() {
  return (
    <section className="py-24 bg-background text-foreground overflow-hidden relative border-y border-border">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-amber-500/5 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:border-amber-500/30 transition-all duration-500 shadow-xl shadow-slate-200/50">
                <div className="text-foreground group-hover:text-amber-500 transition-colors">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold mb-3 text-foreground tracking-tight">
                {stat.value}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
