'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllRoutes, Route } from '@/src/services/routes.service';
import { useRouter } from 'next/navigation';
import { Schedule } from '@/src/services/schedule.service';

const getRouteTag = (distance: number, schedules: Schedule[]): string => {
  if (schedules.length === 0) return 'Available';
  if (distance < 100) return 'Short Trip';
  if (distance > 500) return 'Long Distance';
  return 'Popular';
};

const getRouteColor = (tag: string): { color: string; border: string } => {
  const colors: Record<string, { color: string; border: string }> = {
    'Short Trip':     { color: 'from-blue-50 to-cyan-50',     border: 'border-blue-200' },
    'Long Distance':  { color: 'from-amber-50 to-orange-50',  border: 'border-amber-200' },
    Popular:          { color: 'from-green-50 to-emerald-50', border: 'border-green-200' },
    Available:        { color: 'from-purple-50 to-violet-50', border: 'border-purple-200' },
  };
  return colors[tag] || colors.Available;
};

const tagColors: Record<string, string> = {
  'Short Trip':    'bg-blue-100 text-blue-700 border-blue-300',
  'Long Distance': 'bg-amber-100 text-amber-700 border-amber-300',
  Popular:         'bg-green-100 text-green-700 border-green-300',
  Available:       'bg-purple-100 text-purple-700 border-purple-300',
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const getAveragePrice = (schedules: Schedule[]): number => {
  if (schedules.length === 0) return 0;
  return Math.floor(schedules.length * 150);
};

export default function RoutesSection() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllRoutes({ limit: 4 });
        setRoutes(result.data);
        setTotal(result.meta?.total ?? result.data.length);
        if (result.error) {
          setError(result.error);
          return;
        }
        setRoutes(result.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch routes';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <section ref={ref} className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
        >
          <div>
            <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">
              — Explore Routes
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              Popular
              <br />
              <span className="text-amber-500">Destinations</span>
            </h2>
          </div>
          <Button
            onClick={() => router.push('/routes')}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:text-amber-600 bg-white hover:bg-amber-50 hover:border-amber-400 group shrink-0 transition-all duration-300 shadow-sm"
          >
            View all routes
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading routes...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-500 text-lg mb-2">Failed to load routes</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && routes.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 text-lg">No routes found</p>
          </div>
        )}

        {!loading && !error && routes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {routes.map((route, i) => {
              const tag = getRouteTag(route.distanceKm, route.schedules);
              const { color, border } = getRouteColor(tag);
              const price = getAveragePrice(route.schedules);
              const stops = route.stops ?? [];

              return (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`group relative bg-gradient-to-br ${color} border ${border} rounded-2xl p-5 cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 rounded-2xl pointer-events-none" />

                  <Badge className={`mb-4 border text-xs font-semibold ${tagColors[tag] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>

                  <div className="flex items-center gap-2 mb-4">
                    <div>
                      <p className="text-gray-900 font-bold text-lg leading-tight">{route.sourceCity}</p>
                      <p className="text-gray-400 text-xs">Origin</p>
                    </div>
                    <ArrowRight className="text-amber-500 h-4 w-4 flex-shrink-0 mx-1" />
                    <div>
                      <p className="text-gray-900 font-bold text-lg leading-tight">{route.destinationCity}</p>
                      <p className="text-gray-400 text-xs">Destination</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(route.estimatedTimeMinutes)}
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 font-black text-lg">৳{price || '---'}</p>
                      <p className="text-gray-400 text-xs">from</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3 border-t border-gray-200 pt-3">
                    <p>📍 {route.distanceKm} km • {stops.length} stops</p>
                    {stops.length > 0 && (
                      <p className="mt-1 text-gray-400">
                        {stops.slice(0, 2).join(', ')}{stops.length > 2 ? '...' : ''}
                      </p>
                    )}
                  </div>

                  {route.schedules.length > 0 && (
                    <div className="text-xs text-green-600 mb-3 flex items-center gap-1">
                      <span className="h-2 w-2 bg-green-500 rounded-full" />
                      {route.schedules.length} schedule{route.schedules.length !== 1 ? 's' : ''} available
                    </div>
                  )}

                  <div className="overflow-hidden h-0 group-hover:h-9 transition-all duration-300">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/routes/${route.id}`)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs h-9 shadow-md shadow-amber-100"
                    >
                      View Schedules
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && routes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 text-sm">
              Showing <span className="text-amber-500 font-semibold">{routes.length}</span> of{' '}
              <span className="text-amber-500 font-semibold">{total}</span> routes
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}