'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ArrowRight, SlidersHorizontal, MapPin, Users, Zap, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllBuses } from '@/src/services/buses.service';
import { useRouter } from 'next/navigation';

interface Bus {
  id: string;
  operatorId: string;
  name: string;
  number: string;
  type: 'AC' | 'NON_AC' | 'SLEEPER' | 'DOUBLE_DECKER';
  totalSeats: number;
  pricePerSeat: number;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  operator: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
  };
}

const getBusImage = (type: string): string => {
  const images: Record<string, string> = {
    AC: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    NON_AC: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80',
    SLEEPER: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
    DOUBLE_DECKER: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  };
  return images[type] || images.NON_AC;
};

const getBusTag = (type: string): string => {
  const tags: Record<string, string> = {
    AC: 'Premium',
    NON_AC: 'Budget',
    SLEEPER: 'Luxury',
    DOUBLE_DECKER: 'Special',
  };
  return tags[type] || 'Standard';
};

const tagColors: Record<string, string> = {
  'Top Rated': 'bg-amber-100 text-amber-700 border-amber-300',
  Popular: 'bg-blue-100 text-blue-700 border-blue-300',
  Budget: 'bg-green-100 text-green-700 border-green-300',
  Luxury: 'bg-purple-100 text-purple-700 border-purple-300',
  Premium: 'bg-rose-100 text-rose-700 border-rose-300',
  Special: 'bg-cyan-100 text-cyan-700 border-cyan-300',
};

const getBusLabel = (type: string): string => {
  const labels: Record<string, string> = {
    AC: 'AC',
    NON_AC: 'Non-AC',
    SLEEPER: 'Sleeper',
    DOUBLE_DECKER: 'Double Decker',
  };
  return labels[type] || type;
};

const filters = [
  { label: 'All', value: '' },
  { label: 'AC', value: 'AC' },
  { label: 'Non-AC', value: 'NON_AC' },
  { label: 'Sleeper', value: 'SLEEPER' },
  { label: 'Double Decker', value: 'DOUBLE_DECKER' },
];

export default function BusesSection() {
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busType, setBusType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllBuses({ limit: 100 });
        if (result.error) {
          setError(result.error);
          return;
        }
        setBuses(result.data?.data || []);
        setTotal(result.data?.meta?.total || 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch buses';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const filtered = buses
    .filter((bus) => {
      const matchesType = busType ? bus.type === busType : true;
      const matchesSearch = searchTerm ? 
        bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.operator.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.pricePerSeat - b.pricePerSeat;
          break;
        case 'seats':
          comparison = a.totalSeats - b.totalSeats;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    })
    .slice(0, showAll ? buses.length : 8);

  const displayed = filtered;

  return (
    <section ref={ref} className="bg-background py-24 px-6 lg:px-12 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-3">
              Our Fleet
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              All <span className="text-amber-600">Buses</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Popular Buses</h2>
              <p className="text-muted-foreground">Discover our most trusted bus services</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative min-w-[280px]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                  <Search className="w-5 h-5 text-amber-500" />
                </div>
                <Input
                  placeholder="Search buses or operators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-amber-500/30 rounded-xl h-12"
                />
              </div>
              
              {/* Sort Options */}
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-muted/30 border-border text-foreground hover:border-amber-500/50 rounded-xl h-12 w-32">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    <SelectItem value="name" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600">Name</SelectItem>
                    <SelectItem value="price" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600">Price</SelectItem>
                    <SelectItem value="seats" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600">Seats</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="bg-muted/30 border-border text-foreground hover:border-amber-500/50 rounded-xl h-12 w-28">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    <SelectItem value="asc" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600">A-Z</SelectItem>
                    <SelectItem value="desc" className="text-foreground focus:bg-amber-500/10 focus:text-amber-600">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={busType === filter.value ? 'default' : 'outline'}
                    onClick={() => setBusType(filter.value)}
                    className={`rounded-full ${
                      busType === filter.value
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                        : 'border-border hover:border-amber-500 hover:text-amber-600'
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                <div className="h-48 bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-10 bg-muted rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-500 text-lg mb-2">Failed to load buses</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-400 text-lg">No buses found for this category</p>
          </div>
        )}

        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayed.map((bus, i) => {
              const tag = getBusTag(bus.type);
              return (
                <motion.div
                  key={bus.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group h-full"
                >
                  <div className="h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={getBusImage(bus.type)}
                        alt={bus.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Badge Overlay */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className={`border text-xs font-medium ${tagColors[tag] ?? 'bg-muted text-muted-foreground border-border'}`}>
                          {tag}
                        </Badge>
                      </div>

                      {/* Rating Overlay */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-white">4.8</span>
                          <span className="text-xs text-white/70">(128)</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-5">
                      {/* Title & Type */}
                      <div className="mb-3">
                        <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">{bus.name}</h3>
                        <p className="text-sm text-muted-foreground">{getBusLabel(bus.type)} • {bus.number}</p>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        Premium {getBusLabel(bus.type)} service with comfortable seating and modern amenities. Operated by {bus.operator.name}.
                      </p>

                      {/* Meta Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-amber-500" />
                          <span className="text-muted-foreground">{bus.totalSeats} seats</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-muted-foreground">{bus.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          <span className="text-muted-foreground">Multiple routes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Available now</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                        <p className="text-2xl font-bold text-amber-600">৳{bus.pricePerSeat}</p>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* View Details Button */}
                      <Button
                        onClick={() => router.push(`/find-buses?busType=${bus.type}&busName=${bus.name}`)}
                        className="w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && buses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 flex flex-col items-center gap-4"
          >
            <p className="text-gray-400 text-sm">
              Showing <span className="text-amber-500 font-semibold">{displayed.length}</span> of{' '}
              <span className="text-amber-500 font-semibold">{total}</span> buses
            </p>
            {filtered.length > 3 && (
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="border-gray-200 text-gray-600 hover:text-amber-600 bg-white hover:bg-gray-50 hover:border-amber-400 group transition-all duration-300"
              >
                {showAll ? 'Show Less' : `View All ${total} Buses`}
                <ArrowRight
                  className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                    showAll ? 'rotate-90' : 'group-hover:translate-x-2'
                  }`}
                />
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}