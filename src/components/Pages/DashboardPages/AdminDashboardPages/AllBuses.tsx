// "use client";

// import { useState, useEffect } from 'react';
// import { getAllBuses } from '@/src/services/buses.service';
// import { Plus, Hash, Users, Database, Zap, Navigation, Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import Link from 'next/link';

// interface Bus {
//   id: string;
//   operatorId: string;
//   name: string;
//   number: string;
//   type: string;
//   totalSeats: number;
//   pricePerSeat: number;
//   isDeleted: boolean;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   operator: {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     profileImage: string;
//   };
// }

// const typeMapping: Record<string, string> = {
//   AC: 'Premium AC',
//   NON_AC: 'Standard',
//   AC_SLEEPER: 'Sleeper',
//   AC_CHAIR: 'Chair',
//   SLEEPER: 'Sleeper',
//   DOUBLE_DECKER: 'Double Decker',
// };

// const getBusImage = (type: string): string => {
//   const images: Record<string, string> = {
//     AC: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
//     NON_AC: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80',
//     SLEEPER: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
//     DOUBLE_DECKER: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
//   };
//   return images[type] || images.AC;
// };

// const getBusTag = (type: string) => {
//   const tags: Record<string, { label: string; cls: string }> = {
//     AC: { label: 'PREMIUM AC', cls: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
//     NON_AC: { label: 'STANDARD', cls: 'bg-slate-900/10 text-slate-900 border-slate-900/20' },
//     SLEEPER: { label: 'LUXURY', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
//     DOUBLE_DECKER: { label: 'SPECIAL', cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
//   };
//   return tags[type] ?? { label: 'GENERIC', cls: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
// };

// export default function AllBuses() {
//   const [buses, setBuses] = useState<Bus[]>([]);
//   const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);

//   useEffect(() => {
//     const fetchBuses = async () => {
//       try {
//         setLoading(true);
//         const res = await getAllBuses();
//         const busesData: Bus[] = res.data?.data ?? [];
//         setBuses(busesData);
//         setFilteredBuses(busesData);
//       } catch (err) {
//         setError('Failed to fetch buses');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBuses();
//   }, []);

//   useEffect(() => {
//     let filtered = buses;

//     if (searchTerm) {
//       filtered = filtered.filter(bus =>
//         bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         bus.operator.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterType && filterType !== 'all') {
//       filtered = filtered.filter(bus => bus.type === filterType);
//     }

//     if (filterStatus && filterStatus !== 'all') {
//       const isActive = filterStatus === 'active';
//       filtered = filtered.filter(bus => bus.isActive === isActive);
//     }

//     setFilteredBuses(filtered);
//     setCurrentPage(1);
//   }, [buses, searchTerm, filterType, filterStatus]);

//   const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedBuses = filteredBuses.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
//       {/* Dynamic Background */}
//       <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
//       <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
//           <div>
//             <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Bus Management</p>
//             <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
//               All <span className="text-amber-600">Buses</span>
//             </h1>
//           </div>
//           <Link href="/admin-dashboard/create-bus">
//             <Button className="h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] flex items-center gap-4 shadow-2xl shadow-slate-900/40 group border-t border-white/10">
//               <Plus className="w-6 h-6 text-amber-500 group-hover:rotate-90 transition-transform duration-500" />
//               <span className="text-base font-semibold">Create Bus</span>
//             </Button>
//           </Link>
//         </div>

//         {/* Filters and Search */}
//         <div className="mb-12 bg-card border border-border rounded-[32px] p-8 shadow-lg">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Search */}
//             <div className="relative">
//               <div className="absolute left-4 top-1/2 -translate-y-1/2">
//                 <Search className="w-5 h-5 text-muted-foreground" />
//               </div>
//               <Input
//                 placeholder="Search buses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-12 h-12 rounded-xl bg-muted/30 border-border focus-visible:ring-amber-500"
//               />
//             </div>

//             {/* Type Filter */}
//             <Select value={filterType} onValueChange={setFilterType}>
//               <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border">
//                 <SelectValue placeholder="All Types" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Types</SelectItem>
//                 <SelectItem value="AC">AC</SelectItem>
//                 <SelectItem value="NON_AC">Non-AC</SelectItem>
//                 <SelectItem value="SLEEPER">Sleeper</SelectItem>
//                 <SelectItem value="DOUBLE_DECKER">Double Decker</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Status Filter */}
//             <Select value={filterStatus} onValueChange={setFilterStatus}>
//               <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border">
//                 <SelectValue placeholder="All Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Reset Button */}
//             <Button
//               onClick={() => {
//                 setSearchTerm('');
//                 setFilterType('all');
//                 setFilterStatus('all');
//                 setCurrentPage(1);
//               }}
//               variant="outline"
//               className="h-12 rounded-xl border-border hover:border-amber-500 hover:text-amber-600"
//             >
//               Reset Filters
//             </Button>
//           </div>
//         </div>

//         {/* Content */}
//         {loading ? (
//           // Loading Skeleton
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-lg">
//                 <div className="h-48 bg-muted animate-pulse" />
//                 <div className="p-5 space-y-3">
//                   <div className="h-6 bg-muted rounded animate-pulse" />
//                   <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
//                   <div className="grid grid-cols-2 gap-2">
//                     <div className="h-4 bg-muted rounded animate-pulse" />
//                     <div className="h-4 bg-muted rounded animate-pulse" />
//                   </div>
//                   <div className="h-10 bg-muted rounded-xl animate-pulse" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : error ? (
//           // Error State
//           <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px]">
//             <Database className="w-24 h-24 text-destructive/20 mb-8" />
//             <p className="text-foreground font-bold text-xl tracking-tight mb-3">Error loading buses</p>
//             <p className="text-muted-foreground text-base font-normal">{error}</p>
//           </div>
//         ) : filteredBuses.length === 0 ? (
//           // Empty State
//           <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px] grayscale opacity-40">
//             <Database className="w-24 h-24 text-muted-foreground/20 mb-8" />
//             <p className="text-foreground font-bold text-xl tracking-tight mb-3">No buses found</p>
//             <p className="text-muted-foreground text-base font-normal">Try adjusting your filters</p>
//           </div>
//         ) : (
//           <>
//             {/* Bus Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {paginatedBuses.map((bus) => {
//                 const tag = getBusTag(bus.type);
//                 const displayType = typeMapping[bus.type] ?? bus.type;

//                 return (
//                   <div key={bus.id} className="group h-full">
//                     <div className="h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300">
//                       {/* Image Container */}
//                       <div className="relative h-48 overflow-hidden bg-muted">
//                         <img
//                           src={getBusImage(bus.type)}
//                           alt={bus.name}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         />

//                         {/* Type Badge */}
//                         <div className="absolute top-3 right-3 z-10">
//                           <Badge className={`border text-xs font-medium ${tag.cls}`}>{tag.label}</Badge>
//                         </div>

//                         {/* Status Badge */}
//                         <div className="absolute bottom-3 left-3 z-10">
//                           <Badge className={bus.isActive ? 'bg-emerald-500 text-white border-none' : 'bg-destructive text-white border-none'}>
//                             {bus.isActive ? 'Active' : 'Inactive'}
//                           </Badge>
//                         </div>
//                       </div>

//                       {/* Card Content */}
//                       <div className="flex-1 flex flex-col p-5">
//                         {/* Title & Type */}
//                         <div className="mb-3">
//                           <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">{bus.name}</h3>
//                           <p className="text-sm text-muted-foreground">{displayType} • {bus.number}</p>
//                         </div>

//                         {/* Description */}
//                         <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//                           {bus.type} bus with {bus.totalSeats} seats capacity. Managed by {bus.operator.name}.
//                         </p>

//                         {/* Meta Info Grid */}
//                         <div className="grid grid-cols-2 gap-3 mb-4">
//                           <div className="flex items-center gap-2 text-sm">
//                             <Users className="w-4 h-4 text-amber-500" />
//                             <span className="text-muted-foreground">{bus.totalSeats} seats</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-sm">
//                             <Zap className="w-4 h-4 text-amber-500" />
//                             <span className="text-muted-foreground">{bus.type}</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-sm">
//                             <Hash className="w-4 h-4 text-amber-500" />
//                             <span className="text-muted-foreground">{bus.number}</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-sm">
//                             <Navigation className="w-4 h-4 text-amber-500" />
//                             <span className="text-muted-foreground">{bus.operator.name.split(' ')[0]}</span>
//                           </div>
//                         </div>

//                         {/* Price */}
//                         <div className="mb-4">
//                           <p className="text-xs text-muted-foreground mb-1">Price per seat</p>
//                           <p className="text-2xl font-bold text-amber-600">৳{bus.pricePerSeat}</p>
//                         </div>

//                         {/* Spacer */}
//                         <div className="flex-1" />

//                         {/* View Details Button */}
//                         <Link href={`/admin-dashboard/buses/${bus.id}`}>
//                           <Button className="w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300">
//                             View Details
//                             <ArrowRight className="w-4 h-4" />
//                           </Button>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 mt-12">
//                 <Button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   variant="outline"
//                   className="h-10 w-10 p-0 rounded-lg border-border hover:border-amber-500 hover:text-amber-600 disabled:opacity-50"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </Button>

//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <Button
//                         key={pageNum}
//                         onClick={() => handlePageChange(pageNum)}
//                         variant={currentPage === pageNum ? 'default' : 'outline'}
//                         className={`h-10 w-10 p-0 rounded-lg ${
//                           currentPage === pageNum
//                             ? 'bg-amber-500 hover:bg-amber-600 text-white'
//                             : 'border-border hover:border-amber-500 hover:text-amber-600'
//                         }`}
//                       >
//                         {pageNum}
//                       </Button>
//                     );
//                   })}
//                 </div>

//                 <Button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   variant="outline"
//                   className="h-10 w-10 p-0 rounded-lg border-border hover:border-amber-500 hover:text-amber-600 disabled:opacity-50"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             )}

//             {/* Results Count */}
//             <div className="text-center mt-20 pt-10 border-t border-border/30">
//               <p className="text-muted-foreground text-sm font-medium opacity-50">
//                 Showing <span className="text-foreground font-semibold">{paginatedBuses.length}</span> of{' '}
//                 <span className="text-foreground font-semibold">{filteredBuses.length}</span> buses
//               </p>
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from 'react';
import { getAllBuses } from '@/src/services/buses.service';
import { Plus, Hash, Users, Database, Zap, Navigation, Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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

export default function AllBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const res = await getAllBuses();
        const busesData: Bus[] = res.data?.data ?? [];
        setBuses(busesData);
        setFilteredBuses(busesData);
      } catch (err) {
        setError('Failed to fetch buses');
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  useEffect(() => {
    let filtered = buses;

    if (searchTerm) {
      filtered = filtered.filter(bus =>
        bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.operator.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType && filterType !== 'all') {
      filtered = filtered.filter(bus => bus.type === filterType);
    }

    if (filterStatus && filterStatus !== 'all') {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(bus => bus.isActive === isActive);
    }

    setFilteredBuses(filtered);
    setCurrentPage(1);
  }, [buses, searchTerm, filterType, filterStatus]);

  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBuses = filteredBuses.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
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

        {/* Filters and Search */}
        <div className="mb-12 bg-card border border-border rounded-[32px] p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <Input
                placeholder="Search buses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-muted/30 border-border focus-visible:ring-amber-500"
              />
            </div>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="AC">AC</SelectItem>
                <SelectItem value="NON_AC">Non-AC</SelectItem>
                <SelectItem value="SLEEPER">Sleeper</SelectItem>
                <SelectItem value="DOUBLE_DECKER">Double Decker</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
                setCurrentPage(1);
              }}
              variant="outline"
              className="h-12 rounded-xl border-border hover:border-amber-500 hover:text-amber-600"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-lg">
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
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px]">
            <Database className="w-24 h-24 text-destructive/20 mb-8" />
            <p className="text-foreground font-bold text-xl tracking-tight mb-3">Error loading buses</p>
            <p className="text-muted-foreground text-base font-normal">{error}</p>
          </div>
        ) : filteredBuses.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px] grayscale opacity-40">
            <Database className="w-24 h-24 text-muted-foreground/20 mb-8" />
            <p className="text-foreground font-bold text-xl tracking-tight mb-3">No buses found</p>
            <p className="text-muted-foreground text-base font-normal">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Bus Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedBuses.map((bus) => {
                const tag = getBusTag(bus.type);
                const displayType = typeMapping[bus.type] ?? bus.type;

                return (
                  <div key={bus.id} className="group h-full">
                    {/* ↓ added relative + overflow-hidden so the accent line clips to card edges */}
                    <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300">

                      {/* Hover Accent Line — left side, animates top→bottom on hover */}
                      <div className="absolute top-0 left-0 w-[3px] h-0 group-hover:h-full bg-amber-500 transition-all duration-500 ease-in-out z-20 rounded-full" />

                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={getBusImage(bus.type)}
                          alt={bus.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Type Badge */}
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className={`border text-xs font-medium ${tag.cls}`}>{tag.label}</Badge>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute bottom-3 left-3 z-10">
                          <Badge className={bus.isActive ? 'bg-emerald-500 text-white border-none' : 'bg-destructive text-white border-none'}>
                            {bus.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="flex-1 flex flex-col p-5">
                        {/* Title & Type */}
                        <div className="mb-3">
                          <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">{bus.name}</h3>
                          <p className="text-sm text-muted-foreground">{displayType} • {bus.number}</p>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {bus.type} bus with {bus.totalSeats} seats capacity. Managed by {bus.operator.name}.
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
                            <Hash className="w-4 h-4 text-amber-500" />
                            <span className="text-muted-foreground">{bus.number}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Navigation className="w-4 h-4 text-amber-500" />
                            <span className="text-muted-foreground">{bus.operator.name.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-1">Price per seat</p>
                          <p className="text-2xl font-bold text-amber-600">৳{bus.pricePerSeat}</p>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* View Details Button */}
                        <Link href={`/admin-dashboard/buses/${bus.id}`}>
                          <Button className="w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300">
                            View Details
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="h-10 w-10 p-0 rounded-lg border-border hover:border-amber-500 hover:text-amber-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        className={`h-10 w-10 p-0 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'border-border hover:border-amber-500 hover:text-amber-600'
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="h-10 w-10 p-0 rounded-lg border-border hover:border-amber-500 hover:text-amber-600 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-center mt-20 pt-10 border-t border-border/30">
              <p className="text-muted-foreground text-sm font-medium opacity-50">
                Showing <span className="text-foreground font-semibold">{paginatedBuses.length}</span> of{' '}
                <span className="text-foreground font-semibold">{filteredBuses.length}</span> buses
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}