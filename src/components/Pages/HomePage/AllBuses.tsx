'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ArrowRight, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

  const filtered = busType === '' ? buses : buses.filter((b) => b.type === busType);
  const displayed = showAll ? filtered : filtered.slice(0, 3);

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
            <p className="text-amber-600 text-xs font-black tracking-[0.2em] uppercase mb-4">
              Our Fleet
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground font-heading leading-tight">
              All <span className="text-amber-500">Buses</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-2" />
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setBusType(filter.value);
                  setShowAll(false);
                }}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all duration-300 ${
                  busType === filter.value
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-background text-muted-foreground border-border hover:border-amber-400 hover:text-amber-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading buses...</p>
            </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getBusImage(bus.type)}
                      alt={bus.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Badge className={`absolute top-4 left-4 border text-[10px] font-black uppercase tracking-wider ${tagColors[tag] ?? 'bg-muted text-muted-foreground border-border'}`}>
                      {tag}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md text-foreground px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border border-border">
                      {bus.totalSeats} seats
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-foreground font-black text-xl leading-tight group-hover:text-amber-600 transition-colors">{bus.name}</h3>
                        <p className="text-muted-foreground text-xs font-bold mt-1 uppercase tracking-wider">{getBusLabel(bus.type)} Service</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-amber-700 text-sm font-black">4.8</span>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-muted/30 border border-border rounded-2xl group-hover:bg-amber-50/30 group-hover:border-amber-100 transition-all">
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-2">Bus Operator</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-xs font-black text-amber-600">
                          {bus.operator.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-foreground font-bold text-sm">{bus.operator.name}</p>
                          <p className="text-muted-foreground text-xs font-medium mt-0.5">{bus.operator.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <div>
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Price per seat</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-foreground font-black text-2xl">৳{bus.pricePerSeat}</span>
                          <span className="text-muted-foreground text-xs font-bold">/ seat</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/find-buses?busType=${bus.type}&busName=${bus.name}`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-2xl shadow-lg border-none group/btn transition-all active:scale-95"
                      >
                        Book Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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