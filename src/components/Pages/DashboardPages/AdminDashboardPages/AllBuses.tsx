import { getAllBuses } from '@/src/services/buses.service';
import { Bus as BusIcon, Star, ArrowRight, Plus, Hash, Users, ShieldCheck, Database, Zap, Navigation } from 'lucide-react';
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
  AC: 'Premium AC',
  NON_AC: 'Standard',
  AC_SLEEPER: 'Sleeper',
  AC_CHAIR: 'Chair',
  SLEEPER: 'Sleeper',
  DOUBLE_DECKER: 'Double Decker',
};

const getBusImage = (type: string): string => {
  const images: Record<string, string> = {
    AC: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    NON_AC: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80',
    SLEEPER: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
    DOUBLE_DECKER: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  };
  return images[type] || images.AC;
};

const getBusTag = (type: string) => {
  const tags: Record<string, { label: string; cls: string }> = {
    AC: { label: 'PREMIUM AC', cls: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    NON_AC: { label: 'STANDARD', cls: 'bg-slate-900/10 text-slate-900 border-slate-900/20' },
    SLEEPER: { label: 'LUXURY', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    DOUBLE_DECKER: { label: 'SPECIAL', cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  };
  return tags[type] ?? { label: 'GENERIC', cls: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
};

export default async function AllBuses() {
  const res = await getAllBuses();
  const buses: Bus[] = res.data?.data ?? [];

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Bus Management</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              All <span className="text-amber-600">Buses</span>
            </h1>
          </div>
          <Link href="/admin-dashboard/create-bus">
            <Button className="h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] flex items-center gap-4 shadow-2xl shadow-slate-900/40 group border-t border-white/10">
              <Plus className="w-6 h-6 text-amber-500 group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-base font-semibold">Create Bus</span>
            </Button>
          </Link>
        </div>

        {buses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px] grayscale opacity-40">
             <Database className="w-24 h-24 text-muted-foreground/20 mb-8" />
             <p className="text-foreground font-bold text-xl tracking-tight mb-3">No buses found</p>
             <p className="text-muted-foreground text-base font-normal">Create your first bus to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {buses.map((bus) => {
              const tag = getBusTag(bus.type);
              const displayType = typeMapping[bus.type] ?? bus.type;

              return (
                <div key={bus.id} className="group bg-card border border-border rounded-[48px] overflow-hidden hover:border-amber-500/30 transition-all duration-700 hover:shadow-2xl hover:shadow-slate-900/[0.05] flex flex-col relative">
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <img src={getBusImage(bus.type)} alt={bus.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

                    <div className="absolute top-8 left-8 flex items-center gap-3">
                       <Badge className={`border px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-xl shadow-lg ${tag.cls}`}>{tag.label}</Badge>
                    </div>

                    <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 shadow-xl group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all duration-500">
                      <Users className="w-4 h-4 text-amber-500" /> {bus.totalSeats} Seats
                    </div>

                    <div className={`absolute bottom-8 right-8 px-4 py-2 rounded-full text-sm font-medium shadow-xl border transition-all duration-500 ${bus.isActive ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-destructive/90 text-white border-destructive/40'}`}>
                      {bus.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-foreground font-bold text-2xl tracking-tight mb-2 group-hover:text-amber-500 transition-colors duration-500 leading-none">{bus.name}</h3>
                        <div className="flex items-center gap-2">
                           <Zap className="w-3 h-3 text-amber-500" />
                           <p className="text-muted-foreground text-xs font-medium opacity-50">{displayType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/10 rounded-2xl px-4 py-2 shadow-xl">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-amber-600 text-sm font-semibold">4.9</span>
                      </div>
                    </div>

                    <div className="mb-10 p-6 bg-muted/30 border border-border/50 rounded-[32px] group-hover:bg-muted/50 transition-colors duration-700 relative overflow-hidden">
                      <p className="text-amber-600 text-xs font-semibold mb-3 leading-none">Operator</p>
                      <div className="flex items-center gap-4 relative z-10">
                         <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 text-base font-bold shadow-lg group-hover:scale-110 transition-transform duration-500">
                            {bus.operator.name.charAt(0)}
                         </div>
                         <div className="min-w-0">
                            <p className="text-foreground font-semibold text-base tracking-tight leading-none mb-2 truncate group-hover:text-amber-600 transition-colors">{bus.operator.name}</p>
                            <div className="flex items-center gap-2">
                               <Navigation className="w-3 h-3 text-muted-foreground opacity-40" />
                               <p className="text-muted-foreground text-xs font-medium opacity-60 truncate">{bus.operator.phone}</p>
                            </div>
                         </div>
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -mr-12 -mt-12" />
                    </div>

                    <div className="mt-auto pt-10 border-t border-border/50 space-y-10">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-xs font-medium opacity-50 leading-none">Bus Number</p>
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-muted rounded-xl">
                                <Hash className="w-4 h-4 text-amber-600" />
                             </div>
                             <p className="text-foreground font-semibold text-lg tracking-tight leading-none">{bus.number}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-muted-foreground text-xs font-medium opacity-50 leading-none">Price</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-foreground font-bold text-3xl tracking-tight leading-none">৳{bus.pricePerSeat}</span>
                            <span className="text-muted-foreground text-sm font-medium opacity-50 leading-none">/seat</span>
                          </div>
                        </div>
                      </div>

                      <Link href={`/admin-dashboard/buses/${bus.id}`} className="block">
                        <Button className="w-full bg-slate-900 hover:bg-amber-500 text-white border border-slate-800 h-14 rounded-2xl font-semibold text-base transition-all duration-700 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/30 group/btn">
                          View Details <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-500" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Hover Accent Decor */}
                  <div className="absolute top-0 left-0 w-1 h-0 bg-amber-500 group-hover:h-full transition-all duration-700" />
                </div>
              );
            })}
          </div>
        )}

        {buses.length > 0 && (
          <div className="text-center mt-20 pt-10 border-t border-border/30">
            <p className="text-muted-foreground text-sm font-medium opacity-50">Managing <span className="text-foreground font-semibold">{buses.length}</span> buses</p>
          </div>
        )}
      </div>
    </section>
  );
}