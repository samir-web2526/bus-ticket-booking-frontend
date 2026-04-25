
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllRoutes } from '@/src/services/routes.service';
import { useRouter } from 'next/navigation';
import { getAllBuses } from '@/src/services/buses.service';


interface Route {
  id: string;
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  stops: string[];
  createdAt: string;
  updatedAt: string;
  schedules: unknown[];
}

interface SlideRoute extends Route {
  image: string;
  tag: string;
}

const defaultImage = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80';

const getRouteImage = (distance: number, index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80',
    'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1200&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  ];
  return images[index % images.length];
};

const getRouteTag = (distance: number): string => {
  if (distance < 100) return 'Quick Getaway';
  if (distance < 300) return 'Popular Route';
  if (distance < 500) return 'Long Journey';
  return 'Epic Adventure';
};

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<SlideRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
  routes: '...',
  buses: '...',
});

  const router = useRouter();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const result = await getAllRoutes({ limit: 10 });

        const slidesData: SlideRoute[] = result.data.slice(0, 5).map((route, index) => ({
          ...route,
          image: getRouteImage(route.distanceKm, index),
          tag: getRouteTag(route.distanceKm),
        }));

        setSlides(slidesData);
      } catch (err) {
        console.error('Failed to fetch routes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const routesResult = await getAllRoutes({ limit: 1 });
      setStats((prev) => ({
        ...prev,
        routes: routesResult.meta?.total ? `${routesResult.meta.total}+` : '0',
      }));

      const busesResult = await getAllBuses();
      console.log(busesResult)
      setStats((prev) => ({
        ...prev,
        buses: busesResult.data?.meta?.total ? `${busesResult.data.meta.total}+` : '0',
      }));
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  fetchStats();
}, []);


  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-[#050d1a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-amber-400 animate-spin" />
          <p className="text-slate-400">Loading routes...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050d1a]">
      {/* Slider background */}
      <AnimatePresence mode="wait">
        {slides.length > 0 && (
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slides[current].image}
              alt={`${slides[current].sourceCity} to ${slides[current].destinationCity}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050d1a] via-[#050d1acc] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-transparent to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center py-24">
        {/* LEFT — Text + Search */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex w-fit items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-400 text-sm font-medium tracking-wide">
              Bangladesh&apos;s #1 Bus Booking
            </span>
          </motion.div>

          {/* Headline */}
          <div>
            <h1
              className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Travel
              <br />
              <span className="text-amber-400">Smarter,</span>
              <br />
              Arrive
              <br />
              <span className="text-amber-400">Better.</span>
            </h1>
            <p className="mt-5 text-slate-300 text-lg max-w-sm leading-relaxed">
              Book intercity buses instantly. Hundreds of routes, real-time seat selection, and secure payments.
            </p>
          </div>
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
>
  <Button
    onClick={()=>router.push('/find-buses')}
    className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-base h-12 px-8 rounded-xl transition-all duration-200 group"
  >
    <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
    Find Buses
    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
  </Button>
</motion.div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
  { value: stats.routes, label: 'Routes' },
  { value: '50K+', label: 'Happy Riders' },
  { value: stats.buses, label: 'Buses' },
].map((stat, i) => (
  <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 + i * 0.1 }}
  >
    <p className="text-2xl font-black text-amber-400">{stat.value}</p>
    <p className="text-sm text-slate-400">{stat.label}</p>
  </motion.div>
))}
          </div>
        </motion.div>

        {/* RIGHT — Slide info card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex flex-col items-end gap-4"
        >
          {/* Slide info */}
          <AnimatePresence mode="wait">
            {slides.length > 0 && (
              <motion.div
                key={slides[current].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-right max-w-xs"
              >
                <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">
                  {slides[current].tag}
                </p>
                <p className="text-white text-xl font-bold">
                  {slides[current].sourceCity} → {slides[current].destinationCity}
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  {slides[current].distanceKm} km • {Math.floor(slides[current].estimatedTimeMinutes / 60)}h{' '}
                  {slides[current].estimatedTimeMinutes % 60}m
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slider controls */}
          {slides.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050d1a] to-transparent z-10" />
    </section>
  );
}