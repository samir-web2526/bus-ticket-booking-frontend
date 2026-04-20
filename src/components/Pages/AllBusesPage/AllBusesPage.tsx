

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Search, Filter, MapPin, Calendar, Users } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { motion } from 'framer-motion';
// import { getAllBuses } from '@/src/services/buses.service';
// import BusCard from './BusCard';


// interface Bus {
//   id: string;
//   name: string;
//   type: string;
//   operator: {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     profileImage?: string;
//   };
//   from: string;
//   to: string;
//   departureTime: string;
//   arrivalTime: string;
//   duration: string;
//   availableSeats: number;
//   totalSeats: number;
//   price: number;
//   rating?: number;
//   reviews?: number;
//   amenities?: string[];
//   isActive: boolean;
// }

// const AllBusesPage: React.FC = () => {
//   const [buses, setBuses] = useState<Bus[]>([]);
//   const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState('');
//   const [busType, setBusType] = useState('');
//   const [filters, setFilters] = useState({
//     from: '',
//     to: '',
//     date: '',
//     passengers: '1',
//   });

//   // Load buses on mount
//   useEffect(() => {
//     const loadBuses = async () => {
//       try {
//         setLoading(true);
//         const result = await getAllBuses();

//         if (result.error) {
//           setError(result.error);
//           setBuses([]);
//           setFilteredBuses([]);
//         } else {
//           // ডাটা সঠিকভাবে extract করছি
//           const busesData = Array.isArray(result.data) ? result.data : [];
//           setBuses(busesData);
//           setFilteredBuses(busesData);
//         }
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Something went wrong';
//         setError(message);
//         console.error('[loadBuses]', message);
//         setBuses([]);
//         setFilteredBuses([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBuses();
//   }, []);

//   // Filter buses when search or filters change
//   useEffect(() => {
//     // নিশ্চিত করছি buses একটি array
//     if (!Array.isArray(buses)) {
//       console.warn('buses is not an array:', buses);
//       setFilteredBuses([]);
//       return;
//     }

//     let filtered: Bus[] = [...buses];

//     // Search filter
//     if (search) {
//       filtered = filtered.filter((bus) =>
//         bus.name.toLowerCase().includes(search.toLowerCase()) ||
//         bus.operator.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // Bus type filter
//     if (busType) {
//       filtered = filtered.filter((bus) => bus.type === busType);
//     }

//     // From location filter
//     if (filters.from) {
//       filtered = filtered.filter((bus) =>
//         bus.from.toLowerCase().includes(filters.from.toLowerCase())
//       );
//     }

//     // To location filter
//     if (filters.to) {
//       filtered = filtered.filter((bus) =>
//         bus.to.toLowerCase().includes(filters.to.toLowerCase())
//       );
//     }

//     setFilteredBuses(filtered);
//   }, [search, busType, filters, buses]);

//   const handleFilterChange = (key: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const clearFilters = () => {
//     setSearch('');
//     setBusType('');
//     setFilters({ from: '', to: '', date: '', passengers: '1' });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
//       {/* Header */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
//           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//               Find Your Perfect Bus
//             </h1>
//             <p className="text-blue-100 text-lg">
//               Explore routes and book your journey with ease
//             </p>
//           </motion.div>
//         </div>
//       </div>

//       {/* Search & Filter Section */}
//       <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 mb-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
//         >
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {/* From */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <MapPin className="w-4 h-4 inline mr-2" />
//                 From
//               </label>
//               <Input
//                 placeholder="e.g., Dhaka"
//                 value={filters.from}
//                 onChange={(e) => handleFilterChange('from', e.target.value)}
//                 className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             {/* To */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <MapPin className="w-4 h-4 inline mr-2" />
//                 To
//               </label>
//               <Input
//                 placeholder="e.g., Chattogram"
//                 value={filters.to}
//                 onChange={(e) => handleFilterChange('to', e.target.value)}
//                 className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             {/* Date */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <Calendar className="w-4 h-4 inline mr-2" />
//                 Date
//               </label>
//               <Input
//                 type="date"
//                 value={filters.date}
//                 onChange={(e) => handleFilterChange('date', e.target.value)}
//                 className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             {/* Passengers */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 <Users className="w-4 h-4 inline mr-2" />
//                 Passengers
//               </label>
//               <Select
//                 value={filters.passengers}
//                 onValueChange={(value) => handleFilterChange('passengers', value)}
//               >
//                 <SelectTrigger className="rounded-lg border-gray-300">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[1, 2, 3, 4, 5, 6].map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num} {num === 1 ? 'Passenger' : 'Passengers'}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Search & Filter Row */}
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <Input
//                   placeholder="Search by bus name or operator..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* <Select value={busType} onValueChange={(value) => setBusType(value)}>
//               <SelectTrigger className="w-full md:w-48 rounded-lg border-gray-300">
//                 <Filter className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Bus Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">All Types</SelectItem>
//                 <SelectItem value="AC">AC</SelectItem>
//                 <SelectItem value="NON_AC">Non-AC</SelectItem>
//                 <SelectItem value="SEMI_SLEEPER">Semi-Sleeper</SelectItem>
//                 <SelectItem value="SLEEPER">Sleeper</SelectItem>
//               </SelectContent>
//             </Select> */}

//             <Select
//   value={busType}
//   onValueChange={(value) => {
//     setBusType(value);
//     setPage(1);
//   }}
// >
//   <SelectTrigger className="w-full md:w-48 rounded-lg border-gray-300">
//     <Filter className="w-4 h-4 mr-2" />
//     <SelectValue placeholder="Bus Type" />
//   </SelectTrigger>

//   <SelectContent>
//     <SelectItem value="ALL">All Types</SelectItem>
//     <SelectItem value="AC">AC</SelectItem>
//     <SelectItem value="NON_AC">Non-AC</SelectItem>
//     <SelectItem value="SEMI_SLEEPER">Semi-Sleeper</SelectItem>
//     <SelectItem value="SLEEPER">Sleeper</SelectItem>
//   </SelectContent>
// </Select>

//             <Button
//               onClick={clearFilters}
//               variant="outline"
//               className="w-full md:w-auto rounded-lg"
//             >
//               Clear
//             </Button>
//           </div>
//         </motion.div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 pb-16">
//         {/* Loading State */}
//         {loading && (
//           <div className="flex items-center justify-center py-20">
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//               className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
//             />
//           </div>
//         )}

//         {/* Error State */}
//         {error && !loading && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
//           >
//             <p className="text-red-700 font-semibold mb-4">{error}</p>
//             <Button
//               onClick={() => window.location.reload()}
//               className="bg-red-600 text-white hover:bg-red-700"
//             >
//               Retry
//             </Button>
//           </motion.div>
//         )}

//         {/* Buses Grid */}
//         {!loading && !error && Array.isArray(filteredBuses) && filteredBuses.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="mb-6">
//               <p className="text-gray-700 font-semibold">
//                 Found <span className="text-blue-600">{filteredBuses.length}</span> buses
//               </p>
//             </div>

//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredBuses.map((bus, index) => (
//                 <motion.div
//                   key={bus.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                 >
//                   <BusCard
//                     id={bus.id}
//                     name={bus.name}
//                     type={bus.type}
//                     operatorName={bus.operator.name}
//                     operatorImage={bus.operator.profileImage}
//                     from={bus.from}
//                     to={bus.to}
//                     departureTime={bus.departureTime}
//                     arrivalTime={bus.arrivalTime}
//                     duration={bus.duration}
//                     availableSeats={bus.availableSeats}
//                     totalSeats={bus.totalSeats}
//                     price={bus.price}
//                     rating={bus.rating}
//                     reviews={bus.reviews}
//                     amenities={bus.amenities}
//                     isActive={bus.isActive}
//                   />
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         )}

//         {/* Empty State */}
//         {!loading && !error && filteredBuses.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-20"
//           >
//             <div className="text-6xl mb-4">🚌</div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">No buses found</h3>
//             <p className="text-gray-600 mb-6">Try adjusting your search filters</p>
//             <Button
//               onClick={clearFilters}
//               className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg"
//             >
//               Clear Filters
//             </Button>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllBusesPage;

'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Users } from 'lucide-react';
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
  price: number;
  rating?: number;
  reviews?: number;
  isActive: boolean;
}

interface Route {
  id: string;
  sourceCity: string;
  destinationCity: string;
}

const AllBusesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [busType, setBusType] = useState('');
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1',
  });

  // Load all routes for dropdown
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const result = await getAllRoutes();
        if (!result.error && Array.isArray(result.data)) {
          setRoutes(result.data);
        }
      } catch (err) {
        console.error('[loadRoutes]', err);
      }
    };

    loadRoutes();
  }, []);

  // ✅ Search schedules when filters change
  useEffect(() => {
    const performSearch = async () => {
      try {
        setSearching(true);
        setError(null);

        const result = await searchSchedules({
          from: filters.from,
          to: filters.to,
          date: filters.date,
          busType: busType,
          page,
          limit: 12,
        });

        if (result.error) {
          setError(result.error);
          setSchedules([]);
          setFilteredSchedules([]);
        } else {
          const schedulesData = Array.isArray(result.data) ? result.data : [];
          setSchedules(schedulesData);
          setFilteredSchedules(schedulesData);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Search failed';
        setError(message);
        console.error('[performSearch]', message);
        setSchedules([]);
        setFilteredSchedules([]);
      } finally {
        setSearching(false);
      }
    };

    // Only search if at least one filter is set
    if (filters.from || filters.to || filters.date || busType) {
      const debounceTimer = setTimeout(performSearch, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setSchedules([]);
      setFilteredSchedules([]);
    }
  }, [filters.from, filters.to, filters.date, busType, page]);

  // ✅ Client-side filtering for search text
  useEffect(() => {
    if (!Array.isArray(schedules)) {
      setFilteredSchedules([]);
      return;
    }

    let filtered = [...schedules];

    // Search filter (search across bus name, route cities)
    if (search) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.bus.name.toLowerCase().includes(search.toLowerCase()) ||
          schedule.bus.number.toLowerCase().includes(search.toLowerCase()) ||
          schedule.route.sourceCity
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          schedule.route.destinationCity
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredSchedules(filtered);
  }, [search, schedules]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setBusType('');
    setFilters({ from: '', to: '', date: '', passengers: '1' });
    setPage(1);
  };

  // Get unique source cities for "From" dropdown
  const sourceCities = Array.from(
    new Set(routes.map((r) => r.sourceCity))
  ).sort();

  // Get unique destination cities for "To" dropdown
  const destinationCities = Array.from(
    new Set(routes.map((r) => r.destinationCity))
  ).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Bus
            </h1>
            <p className="text-blue-100 text-lg">
              Search and book buses by route
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* From - Dropdown */}
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
                  <SelectItem value="">All Cities</SelectItem>
                  {sourceCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To - Dropdown */}
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
                  <SelectItem value="">All Cities</SelectItem>
                  {destinationCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Travel Date
              </label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Passengers
              </label>
              <Select
                value={filters.passengers}
                onValueChange={(value) =>
                  handleFilterChange('passengers', value)
                }
              >
                <SelectTrigger className="rounded-lg border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by bus name or route..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
<Select
  value={busType}
  onValueChange={(value) => {
    setBusType(value);
    setPage(1);
  }}
>
  <SelectTrigger className="w-full md:w-48 rounded-lg border-gray-300">
    <Filter className="w-4 h-4 mr-2" />
    <SelectValue placeholder="Bus Type" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="ALL">All Types</SelectItem>
    <SelectItem value="AC">AC</SelectItem>
    <SelectItem value="NON_AC">Non-AC</SelectItem>
    <SelectItem value="SEMI_SLEEPER">Semi-Sleeper</SelectItem>
    <SelectItem value="SLEEPER">Sleeper</SelectItem>
  </SelectContent>
</Select>

            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-full md:w-auto rounded-lg"
            >
              Clear
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
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
            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
          >
            <p className="text-red-700 font-semibold mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Results Grid */}
        {!searching && !error && filteredSchedules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <p className="text-gray-700 font-semibold">
                Found <span className="text-blue-600">{filteredSchedules.length}</span> schedules
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    price={schedule.price}
                    rating={schedule.rating}
                    reviews={schedule.reviews}
                    isActive={schedule.isActive}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!searching && !error && filteredSchedules.length === 0 && (filters.from || filters.to || filters.date) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No schedules found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search filters
            </p>
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Initial State (no filters set) */}
        {!searching && !error && filteredSchedules.length === 0 && !filters.from && !filters.to && !filters.date && (
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
      </div>
    </div>
  );
};

export default AllBusesPage;