'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp, Loader2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllRoutes } from '@/src/services/routes.service';
import {Route} from '../../../services/routes.service'
import { Schedule } from '@/src/services/schedule.service';

// interface Schedule {
//   id: string;
//   departure: string;
//   arrival: string;
//   status: string;
//   bus: {
//     id: string;
//     name: string;
//     type: string;
//     totalSeats: number;
//     operator: {
//       id: string;
//       name: string;
//       email: string;
//       phone: string;
//       profileImage: string;
//     };
//   };
// }

// interface Route {
//   id: string;
//   sourceCity: string;
//   destinationCity: string;
//   distanceKm: number;
//   estimatedTimeMinutes: number;
//   stops: string[];
//   createdAt: string;
//   updatedAt: string;
//   schedules: Schedule[];
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
  return Math.floor(schedules.length * 150);
};

export default function AllRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  // const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });



  // useEffect(() => {
  //   const fetchRoutes = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const result = await getAllRoutes({ limit: 100 });

  //       if (result.error) {
  //         setError(result.error);
  //         console.error('Error fetching routes:', result.error);
  //         return;
  //       }

  //       setRoutes(result.data);
  //       setFilteredRoutes(result.data);
  //     } catch (err) {
  //       const message = err instanceof Error ? err.message : 'Failed to fetch routes';
  //       setError(message);
  //       console.error('Failed to fetch routes:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRoutes();
  // }, []);

  // useEffect(() => {
  //   if (!searchQuery.trim()) {
  //     setFilteredRoutes(routes);
  //     return;
  //   }

  //   const query = searchQuery.toLowerCase();
  //   const filtered = routes.filter(
  //     (route) =>
  //       route.sourceCity.toLowerCase().includes(query) ||
  //       route.destinationCity.toLowerCase().includes(query)
  //   );

  //   setFilteredRoutes(filtered);
  // }, [searchQuery, routes]);

  useEffect(() => {
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllRoutes({ limit: 100 });

      if (result.error) {
        setError(result.error);
        return;
      }

      setRoutes(result.data); // ONLY this
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  fetchRoutes();
}, []);

  const filteredRoutes = useMemo(() => {
  const query = searchQuery.toLowerCase();

  return routes.filter((route) =>
    route.sourceCity.toLowerCase().includes(query) ||
    route.destinationCity.toLowerCase().includes(query)
  );
}, [routes, searchQuery]);

  return (
    <div className="min-h-screen bg-[#050d1a]">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#0a1628] to-[#050d1a] border-b border-white/10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 lg:px-12 py-16 flex flex-col gap-8"
        >
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              — Explore All Routes
            </p>
            <h1
              className="text-5xl lg:text-6xl font-black text-white leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              All Available
              <br />
              <span className="text-amber-400">Routes</span>
            </h1>
            <p className="text-slate-400 text-lg mt-4 max-w-2xl">
              Browse through our extensive network of routes across Bangladesh. Find the perfect journey for your next trip.
            </p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 max-w-2xl"
          >
            <Search className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <Input
              placeholder="Search by city name (e.g., Dhaka, Sylhet, Chittagong)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 text-white placeholder:text-slate-400 focus:ring-0 text-lg"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <span className="text-amber-400 font-bold text-lg">{routes.length}</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Routes</p>
                <p className="text-white font-semibold">Available Now</p>
              </div>
            </div>

            {routes.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-400/10 border border-green-400/30 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-lg">
                    {routes.filter((r) => r.schedules.length > 0).length}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">With Schedules</p>
                  <p className="text-white font-semibold">Ready to Book</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Routes Grid Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading all routes...</p>
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

          {/* No Results State */}
          {!loading && !error && filteredRoutes.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-slate-400 text-lg mb-2">No routes found</p>
                <p className="text-slate-500 text-sm">
                  {searchQuery
                    ? `No routes matching "${searchQuery}"`
                    : 'Check back soon for more routes'}
                </p>
              </div>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filteredRoutes.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {filteredRoutes.map((route, i) => {
                  const tag = getRouteTag(route.distanceKm, route.schedules);
                  const { color, border } = getRouteColor(tag);
                  const price = getAveragePrice(route.schedules);

                    const stops = route.stops ?? [];

                  return (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className={`group relative bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 cursor-pointer overflow-hidden h-full flex flex-col`}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.03] rounded-2xl" />

                      {/* Tag */}
                      <Badge
                        className={`w-fit mb-4 border text-xs font-semibold ${
                          tagColors[tag] ?? 'bg-white/10 text-white border-white/20'
                        }`}
                      >
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>

                      {/* Route */}
                      <div className="flex items-center gap-2 mb-5 flex-1">
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
                      <div className="border-t border-white/10 pt-4 mb-4 space-y-3">
                        <div className="flex items-center justify-between">
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
                        <div className="text-xs text-slate-400">
                          <p>📍 {route.distanceKm} km</p>
                          {/* {route.stops.length > 0 && (
                            <p className="mt-1 text-slate-500">
                              {route.stops.length} stops • {route.stops.slice(0, 2).join(', ')}
                              {route.stops.length > 2 ? '...' : ''}
                            </p>
                          )} */}
                          {stops.length > 0 && (
  <p className="mt-1 text-slate-500">
    {stops.length} stops • {stops.slice(0, 2).join(', ')}
    {stops.length > 2 ? '...' : ''}
  </p>
)}
                        </div>

                        {/* Available Schedules */}
                        {route.schedules.length > 0 && (
                          <div className="text-xs text-green-400 flex items-center gap-1">
                            <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                            {route.schedules.length} schedule
                            {route.schedules.length !== 1 ? 's' : ''} available
                          </div>
                        )}
                      </div>

                      {/* Book button */}
                      <Button className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm h-11 rounded-xl transition-all duration-200 group/btn mt-auto">
                        View Schedule
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Results count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <p className="text-slate-400 text-sm">
                  Showing <span className="text-amber-400 font-semibold">{filteredRoutes.length}</span> of{' '}
                  <span className="text-amber-400 font-semibold">{routes.length}</span> routes
                </p>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}