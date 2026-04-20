/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar} from 'lucide-react';
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

import { getAllRoutes } from '@/src/services/routes.service';
import { searchSchedules } from '@/src/services/schedule.service';
import ScheduleCard from './ScheduleCard';

interface Schedule {
  id: string;
  bus: {
    id: string;
    name: string;
    type: string;
    number: string;
    totalSeats: number;
    pricePerSeat: number;
  };
  route: {
    sourceCity: string;
    destinationCity: string;
    distanceKm: number;
    estimatedTimeMinutes: number;
  };
  departure: string;
  arrival: string;
  availableSeats: number;
  price?: number;
  rating?: number;
  reviews?: number;
  isActive: boolean;
}

interface Route {
  id: string;
  sourceCity: string;
  destinationCity: string;
}

// interface SearchResponse {
//   data: Schedule[];
//   meta?: {
//     page: number;
//     limit: number;
//     total: number;
//   };
// }

const ScheduleSearchPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [busType, setBusType] = useState('');
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
          // ✅ FIX: Extract array properly
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

  // ================== SEARCH API ==================
  useEffect(() => {
    const performSearch = async () => {
      try {
        setSearching(true);
        setError(null);
        setHasSearched(true);

        console.log('[performSearch] Query:', {
          from: filters.from,
          to: filters.to,
          date: filters.date,
          busType,
        });

        const result = await searchSchedules({
          from: filters.from === 'ALL' ? '' : filters.from,
          to: filters.to === 'ALL' ? '' : filters.to,
          date: filters.date,
          busType: busType === 'ALL' ? '' : busType,
          page,
          limit: 12,
        });

        console.log('[performSearch] Result:', result);

        if (result.error) {
          console.error('[performSearch] API Error:', result.error);
          setError(result.error);
          setSchedules([]);
          setFilteredSchedules([]);
        } else {
          // ✅ FIX: Properly extract schedule array
          let schedulesData: Schedule[] = [];

          if (Array.isArray(result.data)) {
            schedulesData = result.data;
          } else if (result.data && Array.isArray(result.data)) {
            schedulesData = result.data;
          }

          console.log('[performSearch] Schedules found:', schedulesData.length);

          setSchedules(schedulesData);
          setFilteredSchedules(schedulesData);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Search failed';
        console.error('[performSearch] Exception:', message);
        setError(message);
        setSchedules([]);
        setFilteredSchedules([]);
      } finally {
        setSearching(false);
      }
    };

    // Only search if at least one filter is set
    if (filters.from || filters.to || filters.date || busType) {
      const timer = setTimeout(performSearch, 500);
      return () => clearTimeout(timer);
    }
  }, [filters.from, filters.to, filters.date, busType, page]);

  // ================== CLIENT SEARCH (TEXT BASED) ==================
  useEffect(() => {
    if (!Array.isArray(schedules)) {
      console.warn('[useEffect] schedules is not an array:', schedules);
      setFilteredSchedules([]);
      return;
    }

    let filtered = [...schedules];

    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.route.sourceCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.route.destinationCity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log('[Client Search] Filtered count:', filtered.length);
    setFilteredSchedules(filtered);
  }, [searchTerm, schedules]);

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
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-600 to-cyan-600 text-white p-10">
        <h1 className="text-4xl font-bold">Find Your Bus</h1>
        <p className="text-blue-100 mt-2">Search and book buses by route</p>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-xl -mt-10">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          {/* FROM */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              From
            </label>
            <Select
  value={filters.from}
  onValueChange={(value) => handleFilterChange('from', value)}
>
  <SelectTrigger className="rounded-lg border-gray-300">
    <SelectValue placeholder="Select departure" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="ALL">All Cities</SelectItem>
    {sourceCities.map((city) => (
      <SelectItem key={city} value={city}>
        {city}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          </div>

          {/* TO */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              To
            </label>
            <Select
  value={filters.to}
  onValueChange={(value) => handleFilterChange('to', value)}
>
  <SelectTrigger className="rounded-lg border-gray-300">
    <SelectValue placeholder="Select destination" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="ALL">All Cities</SelectItem>
    {destinationCities.map((city) => (
      <SelectItem key={city} value={city}>
        {city}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>

          {/* BUS TYPE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Bus Type
            </label>
            <Select value={busType} onValueChange={(v) => setBusType(v)}>
  <SelectTrigger>
    <SelectValue placeholder="Select type" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="ALL">All Types</SelectItem>
    <SelectItem value="AC">AC</SelectItem>
    <SelectItem value="NON_AC">Non-AC</SelectItem>
    <SelectItem value="SEMI_SLEEPER">Semi-Sleeper</SelectItem>
    <SelectItem value="SLEEPER">Sleeper</SelectItem>
  </SelectContent>
</Select>
          </div>
        </div>

        {/* SEARCH ROW */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search bus name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={handleSearch} className="bg-blue-600 text-white">
            Search
          </Button>

          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Loading State */}
        {searching && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </div>
        )}

        {/* Error State */}
        {error && !searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <p className="text-red-700 font-semibold">{error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!searching && hasSearched && filteredSchedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No schedules found
            </h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </motion.div>
        )}

        {/* Initial State */}
        {!searching && !hasSearched && filteredSchedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Start your search
            </h3>
            <p className="text-gray-600">
              Select a route and date to find available buses
            </p>
          </motion.div>
        )}

        {/* Results Grid */}
        {!searching && filteredSchedules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <div className="mb-6">
              <p className="text-gray-700 font-semibold">
                Found{' '}
                <span className="text-blue-600">{filteredSchedules.length}</span>{' '}
                schedules
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
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
                    availableSeats={schedule.availableSeats}
                    price={schedule.price || schedule.bus.pricePerSeat}
                    rating={schedule.rating}
                    reviews={schedule.reviews}
                    isActive={schedule.isActive}
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