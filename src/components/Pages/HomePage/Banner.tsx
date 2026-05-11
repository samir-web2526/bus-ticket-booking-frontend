'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [stats, setStats] = useState({ routes: '...', buses: '...' });

  const router = useRouter();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const result = await getAllRoutes({ limit: 10 });
        const slidesData: SlideRoute[] = result.data.slice(0, 5).map((route, index) => ({
          id: route.id,
          sourceCity: route.sourceCity,
          destinationCity: route.destinationCity,
          distanceKm: route.distanceKm,
          estimatedTimeMinutes: route.estimatedTimeMinutes,
          stops: route.stops ?? [],
          schedules: route.schedules ?? [],
          createdAt: route.createdAt ?? '',
          updatedAt: route.updatedAt ?? '',
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
      <section className="relative min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-16 w-16 text-amber-500 animate-spin" />
          <p className="text-muted-foreground font-semibold text-sm">Loading routes...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-40 overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {slides.length > 0 && (
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slides[current].image}
              alt={`${slides[current].sourceCity} to ${slides[current].destinationCity}`}
              className="w-full h-full object-cover opacity-10 grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col gap-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex w-fit items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2"
          >
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
            <span className="text-amber-600 text-sm font-medium tracking-wide">
              Bangladesh&apos;s Premium Travel Network
            </span>
          </motion.div>

          <div>
            <h1
              className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight"
            >
              Travel
              <br />
              <span className="text-amber-600">Smarter,</span>
              <br />
              Arrive
              <br />
              <span className="text-foreground">Elite.</span>
            </h1>
            <p className="mt-10 text-muted-foreground text-xl max-w-xl leading-relaxed font-medium">
              Experience the pinnacle of intercity travel. Hundreds of verified routes, real-time seat selection, and 24/7 VIP support.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            <Button
              onClick={() => router.push('/find-buses')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base h-14 px-10 rounded-2xl transition-all duration-300 group shadow-xl shadow-slate-900/20 active:scale-95 border-none"
            >
              <Search className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Book Your Journey
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push('/routes')}
              className="border-border bg-background text-foreground font-medium text-base h-14 px-8 rounded-2xl hover:bg-muted hover:border-amber-500/30 transition-all duration-300 shadow-lg"
            >
              View All Routes
            </Button>
          </motion.div>

          <div className="flex gap-12 mt-6 border-t border-border pt-10">
            {[
              { value: stats.routes, label: 'Active Routes' },
              { value: '50K+', label: 'Happy Travelers' },
              { value: stats.buses, label: 'Luxury Fleet' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:col-span-5 flex-col items-end gap-8"
        >
          <AnimatePresence mode="wait">
            {slides.length > 0 && (
              <motion.div
                key={slides[current].id}
                initial={{ opacity: 0, y: 40, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -40, rotate: -2 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card border border-border shadow-2xl rounded-[40px] p-10 text-right max-w-md relative overflow-hidden group hover:border-amber-500/20 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                
                <p className="text-amber-600 text-xs font-semibold tracking-wider uppercase mb-4 relative z-10">
                  {slides[current].tag}
                </p>
                <h3 className="text-foreground text-3xl font-bold leading-tight mb-4 relative z-10">
                  {slides[current].sourceCity} <br />
                  <span className="text-amber-500">→</span> <br />
                  {slides[current].destinationCity}
                </h3>
                <div className="flex items-center justify-end gap-6 text-muted-foreground text-sm font-bold relative z-10 pt-6 border-t border-border/50">
                  <div className="text-right">
                     <p className="text-xs font-medium text-muted-foreground/60 mb-0.5">Distance</p>
                     <p className="text-foreground">{slides[current].distanceKm} KM</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs font-medium text-muted-foreground/60 mb-0.5">Duration</p>
                     <p className="text-foreground">
                        {Math.floor(slides[current].estimatedTimeMinutes / 60)}H{' '}
                        {slides[current].estimatedTimeMinutes % 60}M
                     </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {slides.length > 0 && (
            <div className="flex items-center gap-6">
              <button
                onClick={prev}
                className="w-14 h-14 rounded-2xl border border-border flex items-center justify-center text-muted-foreground hover:bg-card hover:border-amber-500 hover:text-amber-500 transition-all duration-300 bg-background shadow-xl shadow-slate-200/50 active:scale-95"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex gap-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === current ? 'w-12 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'w-2 bg-border hover:bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-14 h-14 rounded-2xl border border-border flex items-center justify-center text-muted-foreground hover:bg-card hover:border-amber-500 hover:text-amber-500 transition-all duration-300 bg-background shadow-xl shadow-slate-200/50 active:scale-95"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}