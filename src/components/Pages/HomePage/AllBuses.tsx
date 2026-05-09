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
    <section ref={ref} className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-3">
              — Our Fleet
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black text-gray-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              All <span className="text-amber-500">Buses</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setBusType(filter.value);
                  setShowAll(false);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  busType === filter.value
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-600'
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
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getBusImage(bus.type)}
                      alt={bus.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />
                    <Badge className={`absolute top-3 left-3 border text-xs font-semibold ${tagColors[tag] ?? ''}`}>
                      {tag}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-700 px-3 py-1 rounded-lg text-xs font-medium shadow-sm">
                      {bus.totalSeats} seats
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 font-bold text-lg leading-tight">{bus.name}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">{getBusLabel(bus.type)}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-gray-700 text-sm font-bold">4.5</span>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <p className="text-gray-400 text-xs mb-1">Operator</p>
                      <p className="text-gray-800 font-semibold text-sm">{bus.operator.name}</p>
                      <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <span>📱</span> {bus.operator.phone}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-gray-400 text-xs">Bus No. {bus.number}</p>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-amber-500 font-black text-xl">৳{bus.pricePerSeat}</span>
                          <span className="text-gray-400 text-xs">/ seat</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/find-buses?busType=${bus.type}&busName=${bus.name}`)}
                        className="bg-amber-500 hover:bg-amber-400 text-white font-bold shadow-sm group/btn"
                      >
                        Book
                        <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
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