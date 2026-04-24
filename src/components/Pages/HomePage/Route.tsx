

'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllRoutes } from '@/src/services/routes.service';


interface Schedule {
  id: string;
  departure: string;
  arrival: string;
  status: string;
  bus: {
    id: string;
    name: string;
    type: string;
    totalSeats: number;
    operator: {
      id: string;
      name: string;
      email: string;
      phone: string;
      profileImage: string;
    };
  };
}

interface Route {
  id: string;
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  stops: string[];
  createdAt: string;
  updatedAt: string;
  schedules: Schedule[];
}

// interface RoutesResponse {
//   data: Route[];
//   meta?: {
//     page: number;
//     limit: number;
//     total: number;
//   };
//   error: string | null;
// }

const getRouteTag = (distance: number, schedules: Schedule[]): string => {
  if (schedules.length === 0) return 'Available';
  if (distance < 100) return 'Short Trip';
  if (distance > 500) return 'Long Distance';
  return 'Popular';
};

const getRouteColor = (tag: string): { color: string; border: string } => {
  const colors: Record<string, { color: string; border: string }> = {
    'Short Trip': {
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
    },
    'Long Distance': {
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
    },
    Popular: {
      color: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
    },
    Available: {
      color: 'from-purple-500/20 to-violet-500/20',
      border: 'border-purple-500/30',
    },
  };
  return colors[tag] || colors.Available;
};

const tagColors: Record<string, string> = {
  'Short Trip': 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  'Long Distance': 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  Popular: 'bg-green-400/10 text-green-400 border-green-400/30',
  Available: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const getAveragePrice = (schedules: Schedule[]): number => {
  if (schedules.length === 0) return 0;
  // Assuming we need to calculate from schedules or use a base calculation
  return Math.floor(schedules.length * 150);
};

export default function RoutesSection() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllRoutes({ limit: 8 });

        if (result.error) {
          setError(result.error);
          console.error('Error fetching routes:', result.error);
          return;
        }

        setRoutes(result.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch routes';
        setError(message);
        console.error('Failed to fetch routes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading routes...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-400 text-lg mb-2">Failed to load routes</p>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && routes.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-slate-400 text-lg">No routes found</p>
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && routes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {routes.map((route, i) => {
              const tag = getRouteTag(route.distanceKm, route.schedules);
              const { color, border } = getRouteColor(tag);
              const price = getAveragePrice(route.schedules);

              return (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`group relative bg-gradient-to-br ${color} border ${border} rounded-2xl p-5 cursor-pointer overflow-hidden`}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.03] rounded-2xl" />

                  {/* Tag */}
                  <Badge
                    className={`mb-4 border text-xs font-semibold ${tagColors[tag] ?? 'bg-white/10 text-white border-white/20'}`}
                  >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>

                  {/* Route */}
                  <div className="flex items-center gap-2 mb-4">
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">
                        {route.sourceCity}
                      </p>
                      <p className="text-slate-400 text-xs">Origin</p>
                    </div>
                    <ArrowRight className="text-amber-400 h-4 w-4 flex-shrink-0 mx-1" />
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">
                        {route.destinationCity}
                      </p>
                      <p className="text-slate-400 text-xs">Destination</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(route.estimatedTimeMinutes)}
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-black text-lg">
                        ৳{price || '---'}
                      </p>
                      <p className="text-slate-500 text-xs">from</p>
                    </div>
                  </div>

                  {/* Distance and Stops */}
                  <div className="text-xs text-slate-400 mb-3 border-t border-white/10 pt-3">
                    <p>📍 {route.distanceKm} km • {route.stops.length} stops</p>
                    {route.stops.length > 0 && (
                      <p className="mt-1 text-slate-500">
                        {route.stops.slice(0, 2).join(', ')}
                        {route.stops.length > 2 ? '...' : ''}
                      </p>
                    )}
                  </div>

                  {/* Available Schedules */}
                  {route.schedules.length > 0 && (
                    <div className="text-xs text-green-400 mb-3 flex items-center gap-1">
                      <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                      {route.schedules.length} schedule{route.schedules.length !== 1 ? 's' : ''} available
                    </div>
                  )}

                  {/* Book button — appears on hover */}
                  <div className="overflow-hidden h-0 group-hover:h-9 transition-all duration-300">
                    <Button
                      size="sm"
                      className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs h-9"
                    >
                      Book Now
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Results count */}
        {!loading && routes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-slate-400 text-sm">
              Showing <span className="text-amber-400 font-semibold">{routes.length}</span> routes
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}