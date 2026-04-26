
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';


import { Schedule, searchSchedules } from '@/src/services/schedule.service';
import ScheduleCard from './ScheduleCard';
import { getAllRoutes, Route } from '@/src/services/routes.service';
import { useSearchParams } from 'next/navigation';


const ScheduleSearchPage: React.FC = () => {
  const searchParams = useSearchParams();

const [busType, setBusType] = useState(
  () => searchParams.get('busType') ?? '' // ✅ initial value এ set করুন
);
const [searchInput, setSearchInput] = useState(
  () => searchParams.get('busName') ?? ''
);
const [searchTerm, setSearchTerm] = useState(
  () => searchParams.get('busName') ?? ''
);

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  // const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  // const [searchInput, setSearchInput] = useState('');
  // const [searchTerm, setSearchTerm] = useState('');
  // const [busType, setBusType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState({
    from: '',
    to: '',
    date: '',
  });

  // ================== LOAD ROUTES ==================
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const result = await getAllRoutes();

        console.log('[loadRoutes] Result:', result);

        if (result.error) {
          console.error('[loadRoutes] Error:', result.error);
          setRoutes([]);
        } else {
          let routesData: Route[] = [];

          if (Array.isArray(result.data)) {
            routesData = result.data;
          } else if (result.data && Array.isArray(result.data)) {
            routesData = result.data;
          }

          console.log('[loadRoutes] Routes loaded:', routesData.length);
          setRoutes(routesData);
        }
      } catch (err) {
        console.error('[loadRoutes] Exception:', err);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  // ================== URL PARAMS FROM BUS SECTION ==================
// useEffect(() => {
//   const busTypeParam = searchParams.get('busType');
//   const busNameParam = searchParams.get('busName');

//   if (busTypeParam) setBusType(busTypeParam);
//   if (busNameParam) {
//     setSearchInput(busNameParam);
//     setSearchTerm(busNameParam);
//   }
// }, []);

  // ================== SEARCH API ==================


useEffect(() => {
  const performSearch = async () => {
    try {
      setSearching(true);
      setError(null);
      setHasSearched(true);

      const result = await searchSchedules({
        from: filters.from === 'ALL' ? '' : filters.from,
        to: filters.to === 'ALL' ? '' : filters.to,
        date: filters.date,
        busType: busType === 'ALL' ? '' : busType,
        search: searchTerm, // ✅ searchTerm যোগ করুন
        page,
        limit: 12,
      });

      if (result.error) {
        setError(result.error);
        setSchedules([]);
      } else {
        const schedulesData: Schedule[] = result.data || []; // ✅ .data.data না
        setSchedules(schedulesData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      setSchedules([]);
    } finally {
      setSearching(false);
    }
  };

  // ✅ searchTerm যোগ করুন condition-এ
  if (filters.from || filters.to || filters.date || busType || searchTerm) {
    const timer = setTimeout(performSearch, 500);
    return () => clearTimeout(timer);
  }
}, [filters.from, filters.to, filters.date, busType, page, searchTerm]); // ✅ searchTerm dependency-তে যোগ করুন


  // ================== CLIENT SEARCH (TEXT BASED) ==================
  // useEffect(() => {
  //   if (!Array.isArray(schedules)) {
  //     console.warn('[useEffect] schedules is not an array:', schedules);
  //     setFilteredSchedules([]);
  //     return;
  //   }

  //   let filtered = [...schedules];

  //   if (searchTerm) {
  //     filtered = filtered.filter((s) =>
  //       s.bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       s.bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       s.route.sourceCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       s.route.destinationCity.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   console.log('[Client Search] Filtered count:', filtered.length);
  //   setFilteredSchedules(filtered);
  // }, [searchTerm, schedules]);
const filteredSchedules = schedules;

  // ================== HELPERS ==================
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setBusType('');
    setFilters({ from: '', to: '', date: '' });
    setPage(1);
    setHasSearched(false);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const sourceCities = Array.from(
    new Set(routes.map((r) => r.sourceCity).filter(Boolean))
  ).sort();

  const destinationCities = Array.from(
    new Set(routes.map((r) => r.destinationCity).filter(Boolean))
  ).sort();

  console.log('[Render] State:', {
    routesCount: routes.length,
    sourceCitiesCount: sourceCities.length,
    schedulesCount: schedules.length,
    filteredCount: filteredSchedules.length,
    searching,
    hasSearched,
    filters,
  });

  return (
    <div className="min-h-screen bg-[#050d1a]">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#050d1a] border-b border-white/10 py-20 px-6 lg:px-12">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,180,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="mb-8">
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              — Search Schedules
            </p>
            <h1
              className="text-5xl lg:text-6xl font-black text-white leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Find Your
              <br />
              <span className="text-amber-400">Perfect Bus</span>
            </h1>
            <p className="text-slate-400 text-lg mt-4 max-w-2xl">
              Search schedules by route, date, and bus type. Book instantly with real-time seat availability.
            </p>
          </div>
        </motion.div>
      </div>

      {/* FILTERS CARD */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 -mt-16 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {/* FROM */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                From
              </label>
              <Select value={filters.from} onValueChange={(value) => handleFilterChange('from', value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white hover:border-amber-400/50 rounded-xl h-11">
                  <SelectValue placeholder="Select departure" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1628] border-white/20">
                  <SelectItem value="ALL" className="text-white hover:bg-white/10">
                    All Cities
                  </SelectItem>
                  {sourceCities.map((city) => (
                    <SelectItem key={city} value={city} className="text-white hover:bg-white/10">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* TO */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                To
              </label>
              <Select value={filters.to} onValueChange={(value) => handleFilterChange('to', value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white hover:border-amber-400/50 rounded-xl h-11">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1628] border-white/20">
                  <SelectItem value="ALL" className="text-white hover:bg-white/10">
                    All Cities
                  </SelectItem>
                  {destinationCities.map((city) => (
                    <SelectItem key={city} value={city} className="text-white hover:bg-white/10">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DATE */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Date
              </label>
              <Input
                type="date"
                value={filters.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
              />
            </div>

            {/* BUS TYPE */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-400" />
                Bus Type
              </label>
              <Select value={busType} onValueChange={(v) => setBusType(v)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white hover:border-amber-400/50 rounded-xl h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1628] border-white/20">
  <SelectItem value="ALL" className="text-white hover:bg-white/10">
    All Types
  </SelectItem>
  <SelectItem value="AC" className="text-white hover:bg-white/10">
    AC
  </SelectItem>
  <SelectItem value="NON_AC" className="text-white hover:bg-white/10">
    Non-AC
  </SelectItem>
  <SelectItem value="SLEEPER" className="text-white hover:bg-white/10">
    Sleeper
  </SelectItem>
  <SelectItem value="DOUBLE_DECKER" className="text-white hover:bg-white/10">
    Double Decker
  </SelectItem>
</SelectContent>
              </Select>
            </div>
          </div>

          {/* SEARCH ROW */}
          {/* <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
              <Input
                placeholder="Search bus name or route..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
              />
            </div>

            <Button
              onClick={handleSearch}
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl h-11 px-6 flex items-center gap-2 transition-all duration-200 group"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Search
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-white/20 text-white hover:bg-white/5 hover:border-amber-400 rounded-xl h-11 px-6 transition-all duration-200"
            >
              Clear
            </Button>
          </div> */}
          <div className="flex gap-3 flex-wrap">
  <div className="flex-1 relative min-w-[200px]">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
    <Input
      placeholder="Search bus name or route..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
    />
  </div>

  <Button
    onClick={handleSearch}
    className="bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl h-11 px-6 flex items-center gap-2 transition-all duration-200 group"
  >
    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
    Search
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </Button>

  <Button
    variant="outline"
    onClick={clearFilters}
    className="border-white/20 bg-red-600 text-white hover:bg-amber-400 rounded-xl h-11 px-6 transition-all duration-200"
  >
    Clear
  </Button>
</div>
        </motion.div>
      </div>

      {/* RESULTS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        {/* Loading State */}
        {searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-32"
          >
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Searching schedules...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center"
          >
            <p className="text-red-400 font-semibold text-lg">{error}</p>
          </motion.div>
        )}

        {/* Empty State - After Search */}
        {!searching && hasSearched && filteredSchedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-2xl font-bold text-white mb-2">No schedules found</h3>
            <p className="text-slate-400">Try adjusting your search filters</p>
          </motion.div>
        )}

        {/* Initial State */}
        {!searching && !hasSearched && filteredSchedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">Start your search</h3>
            <p className="text-slate-400">Select a route and date to find available buses</p>
          </motion.div>
        )}

        {/* Results Grid */}
        {!searching && filteredSchedules.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <p className="text-slate-300 font-semibold text-lg">
                Found{' '}
                <span className="text-amber-400 text-xl font-black">{filteredSchedules.length}</span>{' '}
                schedule{filteredSchedules.length !== 1 ? 's' : ''}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchedules.map((schedule, index) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ScheduleCard
                    id={schedule.id}
                    bus={schedule.bus}
                    route={schedule.route}
                    departure={schedule.departure}
                    arrival={schedule.arrival}
                    availableSeats={schedule.bus.totalSeats}
                    price={schedule.bus.pricePerSeat || schedule.bus.pricePerSeat}
                    // rating={schedule.bus.}
                    // reviews={schedule.reviews}
                    isActive={schedule.status === 'ACTIVE'}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSearchPage;
