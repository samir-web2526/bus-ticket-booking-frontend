import { getAllBuses } from '@/src/services/buses.service';
import { Bus, Users, Zap, Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
};

const getBusImage = (type: string): string => {
  const images: Record<string, string> = {
    AC: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
    NON_AC: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80',
    AC_SLEEPER: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    AC_CHAIR: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
  };
  return images[type] || images.NON_AC;
};

const getBusTag = (type: string) => {
  const tags: Record<string, { label: string; cls: string }> = {
    AC: { label: 'Premium', cls: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
    NON_AC: { label: 'Budget', cls: 'bg-green-400/10 text-green-400 border-green-400/30' },
    AC_SLEEPER: { label: 'Luxury', cls: 'bg-purple-400/10 text-purple-400 border-purple-400/30' },
    AC_CHAIR: { label: 'Premium', cls: 'bg-rose-400/10 text-rose-400 border-rose-400/30' },
  };
  return tags[type] ?? { label: 'Standard', cls: 'bg-amber-400/10 text-amber-400 border-amber-400/30' };
};

export default async function AllBuses() {
  const res = await getAllBuses();
  const buses: Bus[] = res.data?.data ?? [];

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">— Fleet Management</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
            All <span className="text-amber-400">Buses</span>
          </h1>
          <p className="text-slate-400 text-lg">Total {buses.length} buses in fleet</p>
        </div>

        {/* Grid */}
        {buses.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-slate-500 text-lg">No buses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => {
              const tag = getBusTag(bus.type);
              const displayType = typeMapping[bus.type] ?? bus.type;

              return (
                <div
                  key={bus.id}
                  className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/30 transition-colors duration-300"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getBusImage(bus.type)}
                      alt={bus.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-transparent to-transparent" />
                    <Badge className={`absolute top-3 left-3 border text-xs font-semibold ${tag.cls}`}>
                      {tag.label}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-medium">
                      {bus.totalSeats} seats
                    </div>
                    <div className={`absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold ${bus.isActive ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                      {bus.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{bus.name}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">{displayType}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 rounded-lg px-2.5 py-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-amber-400 text-sm font-bold">4.5</span>
                      </div>
                    </div>

                    {/* Operator */}
                    <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Operator</p>
                      <p className="text-white font-semibold text-sm">{bus.operator.name}</p>
                      <p className="text-slate-500 text-xs mt-1">📱 {bus.operator.phone}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <p className="text-slate-400 text-xs">Bus No. {bus.number}</p>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-amber-400 font-black text-xl">৳{bus.pricePerSeat}</span>
                          <span className="text-slate-500 text-xs">/ seat</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"
                          className="border-white/20 text-slate-300 hover:border-amber-400/50 hover:text-amber-400 bg-transparent text-xs">
                          Edit
                        </Button>
                        <Button size="sm"
                          className="bg-amber-400 hover:bg-amber-300 text-black font-bold">
                          View
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {buses.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-slate-400 text-sm">
              Showing <span className="text-amber-400 font-semibold">{buses.length}</span> buses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}