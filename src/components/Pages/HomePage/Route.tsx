'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const routes = [
  { id: 1, from: 'Dhaka', to: "Cox's Bazar", duration: '10h 30m', price: 1200, tag: 'Popular', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { id: 2, from: 'Dhaka', to: 'Chittagong', duration: '5h 45m', price: 600, tag: 'Fastest', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
  { id: 3, from: 'Dhaka', to: 'Sylhet', duration: '4h 30m', price: 500, tag: 'Scenic', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30' },
  { id: 4, from: 'Dhaka', to: 'Rajshahi', duration: '5h 00m', price: 550, tag: 'Popular', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30' },
  { id: 5, from: 'Chittagong', to: "Cox's Bazar", duration: '2h 30m', price: 350, tag: 'Short Trip', color: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/30' },
  { id: 6, from: 'Dhaka', to: 'Khulna', duration: '7h 00m', price: 750, tag: 'New', color: 'from-teal-500/20 to-cyan-500/20', border: 'border-teal-500/30' },
  { id: 7, from: 'Dhaka', to: 'Barisal', duration: '4h 00m', price: 480, tag: 'Popular', color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30' },
  { id: 8, from: 'Dhaka', to: 'Mymensingh', duration: '2h 00m', price: 280, tag: 'Short Trip', color: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/30' },
];

const tagColors: Record<string, string> = {
  Popular: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  Fastest: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  Scenic: 'bg-green-400/10 text-green-400 border-green-400/30',
  New: 'bg-rose-400/10 text-rose-400 border-rose-400/30',
  'Short Trip': 'bg-purple-400/10 text-purple-400 border-purple-400/30',
};

export default function RoutesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#050d1a] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
        >
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              — Explore Routes
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Popular
              <br />
              <span className="text-amber-400">Destinations</span>
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5 hover:border-amber-400 group shrink-0"
          >
            View all routes
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {routes.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group relative bg-gradient-to-br ${route.color} border ${route.border} rounded-2xl p-5 cursor-pointer overflow-hidden`}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.03] rounded-2xl" />

              {/* Tag */}
              <Badge
                className={`mb-4 border text-xs font-semibold ${tagColors[route.tag] ?? 'bg-white/10 text-white border-white/20'}`}
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                {route.tag}
              </Badge>

              {/* Route */}
              <div className="flex items-center gap-2 mb-4">
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{route.from}</p>
                  <p className="text-slate-400 text-xs">Origin</p>
                </div>
                <ArrowRight className="text-amber-400 h-4 w-4 flex-shrink-0 mx-1" />
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{route.to}</p>
                  <p className="text-slate-400 text-xs">Destination</p>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {route.duration}
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-black text-lg">৳{route.price}</p>
                  <p className="text-slate-500 text-xs">from</p>
                </div>
              </div>

              {/* Book button — appears on hover */}
              <div className="mt-4 overflow-hidden h-0 group-hover:h-9 transition-all duration-300">
                <Button
                  size="sm"
                  className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs h-9"
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}