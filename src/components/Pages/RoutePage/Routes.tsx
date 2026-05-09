// 'use client';

// import { useState, useEffect, useRef, useMemo } from 'react';
// import { motion, useInView } from 'framer-motion';
// import { ArrowRight, Clock, TrendingUp, Loader2, Search, Plus, Pencil } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { getAllRoutes } from '@/src/services/routes.service';
// import { Route } from '../../../services/routes.service';
// import { Schedule } from '@/src/services/schedule.service';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// const getRouteTag = (distance: number, schedules: Schedule[]): string => {
//   if (schedules.length === 0) return 'Available';
//   if (distance < 100) return 'Short Trip';
//   if (distance > 500) return 'Long Distance';
//   return 'Popular';
// };

// const getRouteColor = (tag: string): { color: string; border: string } => {
//   const colors: Record<string, { color: string; border: string }> = {
//     'Short Trip': { color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
//     'Long Distance': { color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
//     Popular: { color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30' },
//     Available: { color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30' },
//   };
//   return colors[tag] || colors.Available;
// };

// const tagColors: Record<string, string> = {
//   'Short Trip': 'bg-blue-400/10 text-blue-400 border-blue-400/30',
//   'Long Distance': 'bg-amber-400/10 text-amber-400 border-amber-400/30',
//   Popular: 'bg-green-400/10 text-green-400 border-green-400/30',
//   Available: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
// };

// const formatTime = (minutes: number): string => {
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `${hours}h ${mins}m`;
// };

// const getAveragePrice = (schedules: Schedule[]): number => {
//   if (schedules.length === 0) return 0;
//   return Math.floor(schedules.length * 150);
// };

// export default function AllRoutesPage() {
//   const router = useRouter();
//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, margin: '-100px' });

//   useEffect(() => {
//     const fetchRoutes = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await getAllRoutes({ limit: 100 });
//         if (result.error) { setError(result.error); return; }
//         setRoutes(result.data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch routes');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoutes();
//   }, []);

//   const filteredRoutes = useMemo(() => {
//     const query = searchQuery.toLowerCase();
//     return routes.filter((route) =>
//       route.sourceCity.toLowerCase().includes(query) ||
//       route.destinationCity.toLowerCase().includes(query)
//     );
//   }, [routes, searchQuery]);

//   return (
//     <div className="min-h-screen bg-[#050d1a]">
//       {/* Header Section */}
//       <div className="bg-gradient-to-b from-[#0a1628] to-[#050d1a] border-b border-white/10">
//         <motion.div
//           ref={ref}
//           initial={{ opacity: 0, y: 30 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="max-w-7xl mx-auto px-6 lg:px-12 py-16 flex flex-col gap-8"
//         >
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
//                 — Explore All Routes
//               </p>
//               <h1
//                 className="text-5xl lg:text-6xl font-black text-white leading-tight"
//                 style={{ fontFamily: "'Sora', sans-serif" }}
//               >
//                 All Available
//                 <br />
//                 <span className="text-amber-400">Routes</span>
//               </h1>
//               <p className="text-slate-400 text-lg mt-4 max-w-2xl">
//                 Browse through our extensive network of routes across Bangladesh. Find the perfect journey for your next trip.
//               </p>
//             </div>
//             <div className="pt-2 shrink-0">
//               <Link href="/admin-dashboard/create-route">
//                 <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-400/10">
//                   <Plus className="w-4 h-4" /> Create Route
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={inView ? { opacity: 1, y: 0 } : {}}
//             transition={{ delay: 0.2, duration: 0.6 }}
//             className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 max-w-2xl"
//           >
//             <Search className="h-5 w-5 text-amber-400 flex-shrink-0" />
//             <Input
//               placeholder="Search by city name (e.g., Dhaka, Sylhet, Chittagong)"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="bg-transparent border-0 text-white placeholder:text-slate-400 focus:ring-0 text-lg"
//             />
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={inView ? { opacity: 1, y: 0 } : {}}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="flex flex-col sm:flex-row gap-6"
//           >
//             <div className="flex items-center gap-3">
//               <div className="h-12 w-12 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
//                 <span className="text-amber-400 font-bold text-lg">{routes.length}</span>
//               </div>
//               <div>
//                 <p className="text-slate-400 text-sm">Total Routes</p>
//                 <p className="text-white font-semibold">Available Now</p>
//               </div>
//             </div>
//             {routes.length > 0 && (
//               <div className="flex items-center gap-3">
//                 <div className="h-12 w-12 rounded-lg bg-green-400/10 border border-green-400/30 flex items-center justify-center">
//                   <span className="text-green-400 font-bold text-lg">
//                     {routes.filter((r) => r.schedules.length > 0).length}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-slate-400 text-sm">With Schedules</p>
//                   <p className="text-white font-semibold">Ready to Book</p>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Routes Grid Section */}
//       <section className="py-24 px-6 lg:px-12">
//         <div className="max-w-7xl mx-auto">
//           {loading && (
//             <div className="flex items-center justify-center h-96">
//               <div className="text-center">
//                 <Loader2 className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
//                 <p className="text-slate-400">Loading all routes...</p>
//               </div>
//             </div>
//           )}

//           {error && !loading && (
//             <div className="flex items-center justify-center h-96">
//               <div className="text-center">
//                 <p className="text-red-400 text-lg mb-2">Failed to load routes</p>
//                 <p className="text-slate-400 text-sm">{error}</p>
//               </div>
//             </div>
//           )}

//           {!loading && !error && filteredRoutes.length === 0 && (
//             <div className="flex items-center justify-center h-96">
//               <div className="text-center">
//                 <p className="text-slate-400 text-lg mb-2">No routes found</p>
//                 <p className="text-slate-500 text-sm">
//                   {searchQuery ? `No routes matching "${searchQuery}"` : 'Check back soon for more routes'}
//                 </p>
//               </div>
//             </div>
//           )}

//           {!loading && !error && filteredRoutes.length > 0 && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
//               >
//                 {filteredRoutes.map((route, i) => {
//                   const tag = getRouteTag(route.distanceKm, route.schedules);
//                   const { color, border } = getRouteColor(tag);
//                   const price = getAveragePrice(route.schedules);
//                   const stops = route.stops ?? [];

//                   return (
//                     <motion.div
//                       key={route.id}
//                       initial={{ opacity: 0, y: 30 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       onClick={() => router.push(`/routes/${route.id}`)}
//                       transition={{ duration: 0.5, delay: i * 0.05 }}
//                       whileHover={{ y: -6, transition: { duration: 0.2 } }}
//                       className={`group relative bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 cursor-pointer overflow-hidden h-full flex flex-col`}
//                     >
//                       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.03] rounded-2xl" />

//                       <Badge className={`w-fit mb-4 border text-xs font-semibold ${tagColors[tag] ?? 'bg-white/10 text-white border-white/20'}`}>
//                         <TrendingUp className="mr-1 h-3 w-3" />
//                         {tag}
//                       </Badge>

//                       <div className="flex items-center gap-2 mb-5 flex-1">
//                         <div>
//                           <p className="text-white font-bold text-lg leading-tight">{route.sourceCity}</p>
//                           <p className="text-slate-400 text-xs">Origin</p>
//                         </div>
//                         <ArrowRight className="text-amber-400 h-4 w-4 flex-shrink-0 mx-1" />
//                         <div>
//                           <p className="text-white font-bold text-lg leading-tight">{route.destinationCity}</p>
//                           <p className="text-slate-400 text-xs">Destination</p>
//                         </div>
//                       </div>

//                       <div className="border-t border-white/10 pt-4 mb-4 space-y-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-1.5 text-slate-400 text-sm">
//                             <Clock className="h-3.5 w-3.5" />
//                             {formatTime(route.estimatedTimeMinutes)}
//                           </div>
//                           <div className="text-right">
//                             <p className="text-amber-400 font-black text-lg">৳{price || '---'}</p>
//                             <p className="text-slate-500 text-xs">from</p>
//                           </div>
//                         </div>

//                         <div className="text-xs text-slate-400">
//                           <p>📍 {route.distanceKm} km</p>
//                           {stops.length > 0 && (
//                             <p className="mt-1 text-slate-500">
//                               {stops.length} stops • {stops.slice(0, 2).join(', ')}
//                               {stops.length > 2 ? '...' : ''}
//                             </p>
//                           )}
//                         </div>

//                         {route.schedules.length > 0 && (
//                           <div className="text-xs text-green-400 flex items-center gap-1">
//                             <span className="h-2 w-2 bg-green-400 rounded-full"></span>
//                             {route.schedules.length} schedule{route.schedules.length !== 1 ? 's' : ''} available
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex gap-2 mt-auto">
//                         <Link
//                           href={`/admin-dashboard/edit-route/${route.id}`}
//                           onClick={(e) => e.stopPropagation()}
//                           className="flex-1"
//                         >
//                           <Button
//                             variant="outline"
//                             className="w-full border-white/20 text-slate-300 hover:border-amber-400/50 hover:text-amber-400 bg-transparent text-sm h-11 rounded-xl"
//                           >
//                             <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
//                           </Button>
//                         </Link>
//                         <Button className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm h-11 rounded-xl transition-all duration-200 group/btn">
//                           View
//                           <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//                         </Button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//                 className="text-center"
//               >
//                 <p className="text-slate-400 text-sm">
//                   Showing <span className="text-amber-400 font-semibold">{filteredRoutes.length}</span> of{' '}
//                   <span className="text-amber-400 font-semibold">{routes.length}</span> routes
//                 </p>
//               </motion.div>
//             </>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp, Loader2, Search, Plus, Pencil } from 'lucide-react';
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

const getRouteColor = (tag: string): { color: string; border: string } => {
  const colors: Record<string, { color: string; border: string }> = {
    'Short Trip':     { color: 'from-blue-50 to-cyan-50',    border: 'border-blue-200' },
    'Long Distance':  { color: 'from-orange-50 to-amber-50', border: 'border-orange-200' },
    Popular:          { color: 'from-emerald-50 to-green-50', border: 'border-emerald-200' },
    Available:        { color: 'from-purple-50 to-violet-50', border: 'border-purple-200' },
  };
  return colors[tag] || colors.Available;
};

const tagColors: Record<string, string> = {
  'Short Trip':    'bg-blue-100 text-blue-700 border-blue-200',
  'Long Distance': 'bg-orange-100 text-orange-700 border-orange-200',
  Popular:         'bg-emerald-100 text-emerald-700 border-emerald-200',
  Available:       'bg-purple-100 text-purple-700 border-purple-200',
};

const tagIconColors: Record<string, string> = {
  'Short Trip':    'text-blue-500',
  'Long Distance': 'text-orange-500',
  Popular:         'text-emerald-500',
  Available:       'text-purple-500',
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
    <div className="min-h-screen bg-white">
      {/* Background blob — same as FeaturesSection */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gray-100 rounded-full blur-3xl pointer-events-none opacity-60" />

      {/* Header */}
      <div className="relative bg-white border-b border-gray-100">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 lg:px-12 py-16 flex flex-col gap-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-3">
                — Explore All Routes
              </p>
              <h1
                className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                All Available
                <br />
                <span className="text-gray-500">Routes</span>
              </h1>
              <p className="text-gray-500 text-lg mt-4 max-w-2xl">
                Browse through our extensive network of routes across Bangladesh. Find the perfect journey for your next trip.
              </p>
            </div>
            <div className="pt-2 shrink-0">
              <Link href="/admin-dashboard/create-route">
                <Button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-sm">
                  <Plus className="w-4 h-4" /> Create Route
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 max-w-2xl shadow-sm"
          >
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <Input
              placeholder="Search by city name (e.g., Dhaka, Sylhet, Chittagong)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-base"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                <span className="text-gray-800 font-bold text-lg">{routes.length}</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Routes</p>
                <p className="text-gray-900 font-semibold">Available Now</p>
              </div>
            </div>
            {routes.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-lg">
                    {routes.filter((r) => r.schedules.length > 0).length}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">With Schedules</p>
                  <p className="text-gray-900 font-semibold">Ready to Book</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Routes Grid */}
      <section className="py-24 px-6 lg:px-12 relative">
        <div className="max-w-7xl mx-auto">

          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="h-10 w-10 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading all routes...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-red-500 text-lg mb-2">Failed to load routes</p>
                <p className="text-gray-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && filteredRoutes.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">No routes found</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? `No routes matching "${searchQuery}"` : 'Check back soon for more routes'}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && filteredRoutes.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
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
                      onClick={() => router.push(`/routes/${route.id}`)}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`group relative bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col`}
                    >
                      <Badge className={`w-fit mb-4 border text-xs font-semibold ${tagColors[tag] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        <TrendingUp className={`mr-1 h-3 w-3 ${tagIconColors[tag]}`} />
                        {tag}
                      </Badge>

                      <div className="flex items-center gap-2 mb-5 flex-1">
                        <div>
                          <p className="text-gray-900 font-bold text-lg leading-tight">{route.sourceCity}</p>
                          <p className="text-gray-400 text-xs">Origin</p>
                        </div>
                        <ArrowRight className="text-gray-400 h-4 w-4 flex-shrink-0 mx-1" />
                        <div>
                          <p className="text-gray-900 font-bold text-lg leading-tight">{route.destinationCity}</p>
                          <p className="text-gray-400 text-xs">Destination</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mb-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(route.estimatedTimeMinutes)}
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 font-black text-lg">৳{price || '---'}</p>
                            <p className="text-gray-400 text-xs">from</p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <p>📍 {route.distanceKm} km</p>
                          {stops.length > 0 && (
                            <p className="mt-1 text-gray-400">
                              {stops.length} stops • {stops.slice(0, 2).join(', ')}
                              {stops.length > 2 ? '...' : ''}
                            </p>
                          )}
                        </div>

                        {route.schedules.length > 0 && (
                          <div className="text-xs text-emerald-600 flex items-center gap-1">
                            <span className="h-2 w-2 bg-emerald-500 rounded-full" />
                            {route.schedules.length} schedule{route.schedules.length !== 1 ? 's' : ''} available
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Link
                          href={`/admin-dashboard/edit-route/${route.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 bg-white text-sm h-11 rounded-xl"
                          >
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                          </Button>
                        </Link>
                        <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm h-11 rounded-xl transition-all duration-200 group/btn">
                          View
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <p className="text-gray-400 text-sm">
                  Showing <span className="text-gray-900 font-semibold">{filteredRoutes.length}</span> of{' '}
                  <span className="text-gray-900 font-semibold">{routes.length}</span> routes
                </p>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}