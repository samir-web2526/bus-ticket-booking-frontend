'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp, Loader2, Search, Plus, Pencil, Navigation, Map, ShieldCheck, Zap, Globe, Route as RouteIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllRoutes } from '@/src/services/routes.service';
import { Route } from '../../../services/routes.service';
import { Schedule } from '@/src/services/schedule.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const getRouteTag = (distance: number, schedules: Schedule[]): string => {
  if (schedules.length === 0) return 'Available';
  if (distance < 100) return 'Short Trip';
  if (distance > 500) return 'Long Distance';
  return 'Popular';
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
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllRoutes({ limit: 100 });
        if (result.error) { setError(result.error); return; }
        setRoutes(result.data);
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
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-48 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[120px] -z-10" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[120px] -z-10" />
        
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-7xl mx-auto px-6"
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-16">
            <div className="max-w-4xl text-center lg:text-left">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
                <div className="w-12 h-[1px] bg-amber-500" />
                <p className="text-amber-600 text-sm font-medium tracking-wide">
                  Our Network
                </p>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-8">
                Explore Our<br />
                <span className="text-amber-600">Routes</span>
              </h1>
              
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <p className="text-muted-foreground text-lg font-normal leading-relaxed max-w-xl">
                  Exploring the sophisticated vector network of inter-city routes. 
                  Engineered for maximum operational efficiency and seamless connectivity.
                </p>
                <div className="hidden lg:block w-[1px] h-20 bg-border/50" />
                <div className="flex items-center gap-6">
                  <div className="text-center lg:text-left">
                     <p className="text-xs font-medium text-amber-600 mb-1">Status</p>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-sm font-semibold text-foreground">System Online</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="shrink-0">
              <Link href="/admin-dashboard/create-route">
                <Button className="h-16 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-105 active:scale-95 group border-none">
                  <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300 text-amber-500" /> Add Route
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SEARCH & ANALYTICS BAR */}
      <div className="relative max-w-7xl mx-auto px-6 -mt-20 mb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center bg-card border border-border rounded-[56px] p-10 shadow-2xl shadow-slate-900/[0.03] backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-8 relative group"
          >
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-amber-500 group-focus-within:scale-110 transition-transform" />
            </div>
            <Input
              placeholder="Search routes by city name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 border border-border/50 rounded-2xl pl-16 pr-6 h-16 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-amber-500/20 focus-visible:border-amber-500/50 text-base font-normal transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-4 flex items-center justify-end gap-12 pr-4"
          >
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-[24px] bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl shadow-slate-900/20">
                <span className="text-amber-500 font-bold text-2xl leading-none">{routes.length}</span>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1 opacity-60">Active</p>
                <p className="text-foreground font-semibold text-sm">Routes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-[24px] bg-amber-500 border border-amber-400 flex items-center justify-center shadow-2xl shadow-amber-500/20">
                <span className="text-white font-bold text-2xl leading-none">
                  {routes.filter((r) => r.schedules.length > 0).length}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1 opacity-60">Live</p>
                <p className="text-foreground font-semibold text-sm">Schedules</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ROUTES GRID */}
      <section className="pb-48 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-48">
                <div className="relative">
                   <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
                   <Loader2 className="h-20 w-20 text-amber-500 animate-spin relative z-10" />
                </div>
                <p className="text-muted-foreground font-medium text-base mt-8">Loading routes...</p>
              </motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-destructive/5 border border-destructive/20 rounded-[56px] p-24 text-center max-w-3xl mx-auto shadow-2xl backdrop-blur-sm">
                <div className="w-24 h-24 bg-destructive/10 rounded-[32px] flex items-center justify-center mx-auto mb-10">
                  <ShieldCheck className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-6">Something Went Wrong</h3>
                <p className="text-muted-foreground font-normal text-xl mb-12 max-w-lg mx-auto">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-12 h-14 font-semibold text-base shadow-xl shadow-slate-900/10 transition-all">Try Again</Button>
              </motion.div>
            ) : filteredRoutes.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-48">
                <div className="w-40 h-40 bg-muted/40 rounded-[56px] flex items-center justify-center mx-auto mb-12 grayscale border border-border/50">
                  <Globe className="w-16 h-16 text-muted-foreground/30" />
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-6">No Routes Found</h3>
                <p className="text-muted-foreground font-normal text-xl max-w-md mx-auto mb-12">
                  We couldn&apos;t establish any active connections matching your vector parameters.
                </p>
                <Button onClick={() => setSearchQuery('')} className="bg-amber-500 hover:bg-amber-400 text-white rounded-2xl px-10 py-6 font-semibold text-base shadow-xl shadow-amber-500/20 active:scale-95 transition-all">Clear Search</Button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24"
              >
                {filteredRoutes.map((route, i) => {
                  const tag = getRouteTag(route.distanceKm, route.schedules);
                  const price = getAveragePrice(route.schedules);
                  const stops = route.stops ?? [];

                  return (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      whileHover={{ y: -16 }}
                      className="group bg-card border border-border rounded-[56px] p-10 cursor-pointer shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-amber-500/40 transition-all duration-700 flex flex-col relative overflow-hidden"
                    >
                      {/* Technical Grid Overlay */}
                      <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      
                      <div className="flex items-center justify-between mb-12 relative z-10">
                        <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-4 py-2 rounded-full text-xs font-medium">
                          <TrendingUp className="mr-2 h-3.5 w-3.5" />
                          {tag}
                        </Badge>
                        <p className="text-muted-foreground text-xs font-medium opacity-40">ID: {route.id.slice(-6).toUpperCase()}</p>
                      </div>

                      <div className="flex items-center gap-6 mb-12 flex-1 relative z-10">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-amber-600 mb-2 opacity-70">From</p>
                          <p className="text-2xl font-semibold text-foreground leading-tight group-hover:text-amber-600 transition-all duration-300 truncate">{route.sourceCity}</p>
                        </div>
                        <div className="relative flex items-center justify-center shrink-0">
                          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:rotate-90 transition-all duration-700 shadow-xl shadow-slate-900/10">
                            <Navigation className="text-amber-500 h-7 w-7 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-xs font-medium text-blue-600 mb-2 opacity-70">To</p>
                          <p className="text-2xl font-semibold text-foreground leading-tight group-hover:text-amber-600 transition-all duration-300 truncate">{route.destinationCity}</p>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-[40px] p-8 mb-10 space-y-8 border border-border/50 relative z-10 backdrop-blur-sm group-hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-3">
                             <p className="text-xs font-medium text-muted-foreground opacity-60 mb-1">Duration</p>
                             <div className="flex items-center gap-3 text-foreground font-medium text-base">
                               <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center shadow-lg">
                                  <Clock className="h-4 w-4" />
                               </div>
                               {formatTime(route.estimatedTimeMinutes)}
                             </div>
                          </div>
                          <div className="text-right">
                            <p className="text-amber-600 font-bold text-3xl tracking-tight leading-none">৳{price || '---'}</p>
                            <p className="text-muted-foreground text-xs font-medium mt-2 opacity-60">Starting from</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-border/50 pt-8">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2 opacity-60">Distance</p>
                            <div className="flex items-center gap-2">
                               <Map className="w-4 h-4 text-amber-500 opacity-60" />
                               <p className="text-foreground font-medium text-sm">{route.distanceKm} km</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground mb-2 opacity-60">Stops</p>
                            <div className="flex items-center gap-2 justify-end">
                               <p className="text-foreground font-medium text-sm">{stops.length} stations</p>
                               <RouteIcon className="w-4 h-4 text-amber-500 opacity-60" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-auto relative z-10">
                        <Link
                          href={`/admin-dashboard/edit-route/${route.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full border-border text-muted-foreground hover:bg-slate-900 hover:text-white h-14 rounded-2xl font-medium text-sm transition-all duration-300"
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit Route
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => router.push(`/routes/${route.id}`)}
                          className="flex-[1.6] bg-slate-900 hover:bg-amber-500 text-white font-semibold text-sm h-14 rounded-2xl transition-all duration-300 group/btn shadow-xl shadow-slate-900/10 border-none"
                        >
                          View Details
                          <Zap className="ml-2 h-4 w-4 group-hover/btn:scale-125 transition-transform text-amber-500 group-hover:text-white" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && !error && filteredRoutes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex items-center justify-center py-12 border-t border-border/50"
            >
              <div className="px-8 py-3 bg-muted/30 border border-border/50 rounded-full flex items-center text-sm font-medium text-muted-foreground shadow-lg">
                Showing <span className="text-amber-600 font-semibold mx-2">{filteredRoutes.length}</span> routes
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}