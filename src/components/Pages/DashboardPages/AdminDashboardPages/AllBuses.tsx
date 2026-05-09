import { getAllBuses } from '@/src/services/buses.service';
import { Bus, Star, ArrowRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Bus {
  id: string;
  operatorId: string;
  name: string;
  number: string;
  type: string;
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

const typeMapping: Record<string, string> = {
  AC: 'AC',
  NON_AC: 'Non-AC',
  AC_SLEEPER: 'AC Sleeper',
  AC_CHAIR: 'AC Chair',
  SLEEPER: 'Sleeper',
  DOUBLE_DECKER: 'Double Decker',
};

const getBusImage = (type: string): string => {
  const images: Record<string, string> = {
    AC: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    NON_AC: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80',
    SLEEPER: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
    DOUBLE_DECKER: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    AC_SLEEPER: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
    AC_CHAIR: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
  };
  return images[type] || images.NON_AC;
};

const getBusTag = (type: string) => {
  const tags: Record<string, { label: string; cls: string }> = {
    AC: { label: 'Premium', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
    NON_AC: { label: 'Budget', cls: 'bg-green-100 text-green-700 border-green-200' },
    SLEEPER: { label: 'Luxury', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
    DOUBLE_DECKER: { label: 'Special', cls: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    AC_SLEEPER: { label: 'Luxury', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
    AC_CHAIR: { label: 'Premium', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
  };
  return tags[type] ?? { label: 'Standard', cls: 'bg-amber-100 text-amber-700 border-amber-200' };
};

export default async function AllBuses() {
  const res = await getAllBuses();
  const buses: Bus[] = res.data?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden p-6 lg:p-12">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-3">— Fleet Management</p>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">All <span className="text-gray-500">Buses</span></h1>
            <p className="text-gray-400 text-lg">Total <span className="text-gray-700 font-semibold">{buses.length}</span> buses in fleet</p>
          </div>
          <Link href="/admin-dashboard/create-bus">
            <Button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-sm">
              <Plus className="w-4 h-4" /> New Bus
            </Button>
          </Link>
        </div>

        {buses.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No buses found</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => {
              const tag = getBusTag(bus.type);
              const displayType = typeMapping[bus.type] ?? bus.type;

              return (
                <div key={bus.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors duration-300 shadow-sm">
                  <div className="relative h-44 overflow-hidden">
                    <img src={getBusImage(bus.type)} alt={bus.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    <Badge className={`absolute top-3 left-3 border text-xs font-semibold ${tag.cls}`}>{tag.label}</Badge>

                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-700 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                      <span>👥</span>{bus.totalSeats} seats
                    </div>

                    <div className={`absolute bottom-3 right-3 px-2.5 py-1.5 rounded-full text-xs font-bold ${bus.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                      {bus.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 font-bold text-lg leading-tight">{bus.name}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">{displayType}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 whitespace-nowrap">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-amber-600 text-sm font-bold">4.5</span>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Operator</p>
                      <p className="text-gray-800 font-semibold text-sm">{bus.operator.name}</p>
                      <p className="text-gray-400 text-xs mt-1">📱 {bus.operator.phone}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-widest">Bus #</p>
                          <p className="text-gray-800 font-semibold text-sm">{bus.number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs uppercase tracking-widest">Price</p>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-gray-900 font-black text-xl">৳{bus.pricePerSeat}</span>
                            <span className="text-gray-400 text-xs">/ seat</span>
                          </div>
                        </div>
                      </div>

                      <Link href={`/admin-dashboard/buses/${bus.id}`} className="block">
                        <Button className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold h-10 rounded-lg uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {buses.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">Showing <span className="text-gray-700 font-semibold">{buses.length}</span> buses in total</p>
          </div>
        )}
      </div>
    </div>
  );
}