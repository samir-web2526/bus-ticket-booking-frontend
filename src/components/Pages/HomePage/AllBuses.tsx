'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bus, Star, Wifi, Wind, Zap, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const buses = [
  {
    id: 1,
    name: 'Green Line Paribahan',
    type: 'AC Sleeper',
    rating: 4.8,
    reviews: 2340,
    amenities: ['wifi', 'ac', 'charging'],
    routes: 24,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    tag: 'Top Rated',
    price: 800,
  },
  {
    id: 2,
    name: 'Shyamoli NR',
    type: 'AC Chair',
    rating: 4.6,
    reviews: 1890,
    amenities: ['ac', 'charging'],
    routes: 18,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
    tag: 'Popular',
    price: 600,
  },
  {
    id: 3,
    name: 'Hanif Enterprise',
    type: 'Non-AC',
    rating: 4.3,
    reviews: 3120,
    amenities: [],
    routes: 32,
    image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80',
    tag: 'Budget',
    price: 350,
  },
  {
    id: 4,
    name: 'S.Alam Super Luxury',
    type: 'AC Sleeper',
    rating: 4.7,
    reviews: 1560,
    amenities: ['wifi', 'ac', 'charging'],
    routes: 12,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    tag: 'Luxury',
    price: 1100,
  },
  {
    id: 5,
    name: 'Ena Transport',
    type: 'AC Chair',
    rating: 4.4,
    reviews: 980,
    amenities: ['ac'],
    routes: 15,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    tag: 'Popular',
    price: 550,
  },
  {
    id: 6,
    name: 'Royal Coach',
    type: 'AC Sleeper',
    rating: 4.9,
    reviews: 450,
    amenities: ['wifi', 'ac', 'charging'],
    routes: 8,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
    tag: 'Premium',
    price: 1400,
  },
];

const filters = ['All', 'AC Sleeper', 'AC Chair', 'Non-AC'];

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-3.5 w-3.5" />,
  ac: <Wind className="h-3.5 w-3.5" />,
  charging: <Zap className="h-3.5 w-3.5" />,
};

const tagColors: Record<string, string> = {
  'Top Rated': 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  Popular: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  Budget: 'bg-green-400/10 text-green-400 border-green-400/30',
  Luxury: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
  Premium: 'bg-rose-400/10 text-rose-400 border-rose-400/30',
};

export default function BusesSection() {
  const [active, setActive] = useState('All');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const filtered =
    active === 'All' ? buses : buses.filter((b) => b.type === active);

  return (
    <section ref={ref} className="bg-[#07111f] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              — Our Fleet
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              All <span className="text-amber-400">Buses</span>
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  active === f
                    ? 'bg-amber-400 text-black border-amber-400'
                    : 'bg-transparent text-slate-300 border-white/20 hover:border-amber-400/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bus, i) => (
            <motion.div
              key={bus.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/30 transition-colors duration-300"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={bus.image}
                  alt={bus.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-transparent to-transparent" />
                <Badge
                  className={`absolute top-3 left-3 border text-xs font-semibold ${tagColors[bus.tag] ?? ''}`}
                >
                  {bus.tag}
                </Badge>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{bus.name}</h3>
                    <p className="text-slate-400 text-sm mt-0.5">{bus.type}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 rounded-lg px-2.5 py-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400 text-sm font-bold">{bus.rating}</span>
                  </div>
                </div>

                {/* Amenities */}
                {bus.amenities.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {bus.amenities.map((a) => (
                      <div
                        key={a}
                        className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-md px-2 py-1 text-slate-300"
                      >
                        {amenityIcons[a]}
                        <span className="text-xs capitalize">{a}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-slate-400 text-xs">{bus.routes} routes • {bus.reviews.toLocaleString()} reviews</p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-amber-400 font-black text-xl">৳{bus.price}</span>
                      <span className="text-slate-500 text-xs">/ seat</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-amber-400 hover:bg-amber-300 text-black font-bold group/btn"
                  >
                    Book
                    <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}