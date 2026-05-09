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
      <section className="relative min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
          <p className="text-gray-400">Loading routes...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
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
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center py-24">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex w-fit items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5"
          >
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-700 text-sm font-medium tracking-wide">
              Bangladesh&apos;s #1 Bus Booking
            </span>
          </motion.div>

          <div>
            <h1
              className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Travel
              <br />
              <span className="text-amber-500">Smarter,</span>
              <br />
              Arrive
              <br />
              <span className="text-amber-500">Better.</span>
            </h1>
            <p className="mt-5 text-gray-500 text-lg max-w-sm leading-relaxed">
              Book intercity buses instantly. Hundreds of routes, real-time seat selection, and secure payments.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => router.push('/find-buses')}
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-base h-12 px-8 rounded-xl transition-all duration-200 group shadow-lg shadow-amber-100"
            >
              <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Find Buses
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

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
                <p className="text-2xl font-black text-amber-500">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex flex-col items-end gap-4"
        >
          <AnimatePresence mode="wait">
            {slides.length > 0 && (
              <motion.div
                key={slides[current].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-gray-200 shadow-xl rounded-2xl px-6 py-4 text-right max-w-xs"
              >
                <p className="text-amber-500 text-xs font-semibold tracking-widest uppercase mb-1">
                  {slides[current].tag}
                </p>
                <p className="text-gray-900 text-xl font-bold">
                  {slides[current].sourceCity} → {slides[current].destinationCity}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {slides[current].distanceKm} km •{' '}
                  {Math.floor(slides[current].estimatedTimeMinutes / 60)}h{' '}
                  {slides[current].estimatedTimeMinutes % 60}m
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {slides.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-amber-400 hover:text-amber-500 transition-colors bg-white shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? 'w-8 bg-amber-500' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-amber-400 hover:text-amber-500 transition-colors bg-white shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}