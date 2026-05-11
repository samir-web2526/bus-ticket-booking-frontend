/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

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
    () => searchParams.get('busType') ?? ''
  );
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('busName') ?? ''
  );
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get('busName') ?? ''
  );

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
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

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const result = await getAllRoutes();
        if (result.error) {
          setRoutes([]);
        } else {
          let routesData: Route[] = [];
          if (Array.isArray(result.data)) {
            routesData = result.data;
          }
          setRoutes(routesData);
        }
      } catch (err) {
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };
    loadRoutes();
  }, []);

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
          search: searchTerm,
          page,
          limit: 12,
        });

        if (result.error) {
          setError(result.error);
          setSchedules([]);
        } else {
          const schedulesData: Schedule[] = result.data || [];
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

    if (filters.from || filters.to || filters.date || busType || searchTerm) {
      const timer = setTimeout(performSearch, 500);
      return () => clearTimeout(timer);
    }
  }, [filters.from, filters.to, filters.date, busType, page, searchTerm]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-slate-900 border-b border-white/5 pt-32 pb-40 px-6 rounded-b-[64px]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-7xl mx-auto text-center lg:text-left"
        >
          <div className="mb-10 max-w-3xl">
            <p className="text-amber-500 text-xs font-black tracking-[0.3em] uppercase mb-6">
              Instant Booking Engine
            </p>
            <h1
              className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter font-heading mb-8"
            >
              Find Your
              <br />
              <span className="text-amber-500 italic">Perfect Journey</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">
              Search schedules by route, date, and bus type. Book instantly with real-time seat availability.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 -mt-24 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-card border border-border rounded-[40px] p-10 shadow-2xl shadow-slate-900/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-1">
                <MapPin className="w-4 h-4 text-amber-500" />
                Departure
              </label>
              <Select value={filters.from} onValueChange={(value) => handleFilterChange('from', value)}>
                <SelectTrigger className="bg-muted/30 border-border text-foreground hover:border-amber-500/50 rounded-2xl h-14 px-6 transition-all">
                  <SelectValue placeholder="Select Origin" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-2xl shadow-2xl">
                  <SelectItem value="ALL" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600 font-bold">
                    All Cities
                  </SelectItem>
                  {sourceCities.map((city) => (
                    <SelectItem key={city} value={city} className="text-foreground focus:bg-amber-500/10 focus:text-amber-600 font-bold">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-1">
                <MapPin className="w-4 h-4 text-amber-500" />
                Destination
              </label>
              <Select value={filters.to} onValueChange={(value) => handleFilterChange('to', value)}>
                <SelectTrigger className="bg-muted/30 border-border text-foreground hover:border-amber-500/50 rounded-2xl h-14 px-6 transition-all">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-2xl shadow-2xl">
                  <SelectItem value="ALL" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600 font-bold">
                    All Cities
                  </SelectItem>
                  {destinationCities.map((city) => (
                    <SelectItem key={city} value={city} className="text-foreground focus:bg-amber-500/10 focus:text-amber-600 font-bold">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-1">
                <Calendar className="w-4 h-4 text-amber-500" />
                Travel Date
              </label>
              <Input
                type="date"
                value={filters.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-amber-500/30 focus-visible:bg-background rounded-2xl h-14 px-6 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-1">
                <Filter className="w-4 h-4 text-amber-500" />
                Category
              </label>
              <Select value={busType} onValueChange={(v) => setBusType(v)}>
                <SelectTrigger className="bg-muted/30 border-border text-foreground hover:border-amber-500/50 rounded-2xl h-14 px-6 transition-all">
                  <SelectValue placeholder="Bus Class" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-2xl shadow-2xl">
                  <SelectItem value="ALL" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600 font-bold">All Types</SelectItem>
                  <SelectItem value="AC" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600 font-bold">Executive AC</SelectItem>
                  <SelectItem value="NON_AC" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600 font-bold">Economy Non-AC</SelectItem>
                  <SelectItem value="SLEEPER" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600 font-bold">Luxury Sleeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 relative min-w-[280px] group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 group-focus-within:scale-110 transition-transform" />
              <Input
                placeholder="Search bus operator or route..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-14 bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-amber-500/30 focus-visible:bg-background rounded-2xl h-14 px-6 transition-all"
              />
            </div>

            <Button
              onClick={handleSearch}
              className="bg-amber-500 hover:bg-amber-400 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl h-14 px-10 flex items-center gap-3 transition-all duration-300 group shadow-xl shadow-amber-500/20 active:scale-95"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Apply Filters
            </Button>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-border bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[11px] transition-all duration-300"
            >
              Reset
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        {searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40"
          >
            <Loader2 className="h-16 w-16 text-amber-500 animate-spin mb-8" />
            <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-sm animate-pulse">Scanning Live Schedules...</p>
          </motion.div>
        )}

        {error && !searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-destructive/10 border border-destructive/20 rounded-[32px] p-12 text-center"
          >
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <Badge variant="destructive" className="h-8 w-8 flex items-center justify-center p-0 rounded-full">!</Badge>
            </div>
            <p className="text-foreground font-black text-2xl font-heading mb-2">Search Error</p>
            <p className="text-muted-foreground font-medium">{error}</p>
          </motion.div>
        )}

        {!searching && hasSearched && schedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40"
          >
            <div className="text-8xl mb-8 grayscale opacity-20">🚌</div>
            <h3 className="text-3xl font-black text-foreground font-heading mb-4 italic">No Schedules Found</h3>
            <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto">Try adjusting your filters or search for a different date to see available buses.</p>
            <Button onClick={clearFilters} variant="link" className="mt-8 text-amber-600 font-black uppercase tracking-widest text-[11px]">Clear all filters</Button>
          </motion.div>
        )}

        {!searching && !hasSearched && schedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40"
          >
            <div className="text-8xl mb-8 grayscale opacity-20">🔍</div>
            <h3 className="text-3xl font-black text-foreground font-heading mb-4">Start Your Search</h3>
            <p className="text-muted-foreground text-lg font-medium">Select your travel route and date to unlock available schedules.</p>
          </motion.div>
        )}

        {!searching && schedules.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 flex items-center justify-between border-b border-border pb-8"
            >
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Search Results</p>
                <h2 className="text-3xl font-black text-foreground font-heading italic">
                  Available <span className="text-amber-500">Connections</span>
                </h2>
              </div>
              <div className="h-12 px-6 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center">
                <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">
                  {schedules.length} Connection{schedules.length !== 1 ? 's' : ''} Found
                </span>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {schedules.map((schedule, index) => (
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
                    price={schedule.bus.pricePerSeat}
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