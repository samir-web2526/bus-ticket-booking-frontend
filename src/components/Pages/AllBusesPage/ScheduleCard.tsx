

// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Clock, Star, ArrowRight, AlertCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// interface ScheduleCardProps {
//   id: string;
//   bus: {
//     id: string;
//     name: string;
//     type: string;
//     number: string;
//     totalSeats: number;
//     pricePerSeat: number;
//   };
//   route: {
//     sourceCity: string;
//     destinationCity: string;
//     distanceKm: number;
//     estimatedTimeMinutes: number;
//   };
//   departure: string;
//   arrival: string;
//   availableSeats: number;
//   price: number;
//   rating?: number;
//   reviews?: number;
//   isActive: boolean;
// }

// const ScheduleCard: React.FC<ScheduleCardProps> = ({
//   id,
//   bus,
//   route,
//   departure,
//   arrival,
//   availableSeats,
//   price,
//   rating = 4.5,
//   reviews = 124,
//   isActive,
// }) => {
//   const isFull = availableSeats === 0;
//   const isLowSeats = availableSeats <= 5;
//   const occupancyPercentage = ((bus.totalSeats - availableSeats) / bus.totalSeats) * 100;

//   // Format time from ISO string
//   const formatTime = (isoString: string) => {
//     try {
//       const date = new Date(isoString);
//       return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
//     } catch {
//       return isoString;
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: 'easeOut' }}
//       whileHover={{ y: -4 }}
//       className="group"
//     >
//       <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-400/30 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-white/[0.05]">
//         {/* Status Badge */}
//         <div className="absolute top-4 right-4 z-10">
//           {isFull ? (
//             <Badge className="bg-red-500/20 text-red-300 border border-red-500/30">Full</Badge>
//           ) : isLowSeats ? (
//             <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30">Limited</Badge>
//           ) : (
//             <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">Available</Badge>
//           )}
//         </div>

//         {/* Bus Info Bar */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
//           <div>
//             <h3 className="font-bold text-white text-base">{bus.name}</h3>
//             <p className="text-xs text-slate-400 mt-1">
//               {bus.type} • {bus.number}
//             </p>
//           </div>
//           {rating && (
//             <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-1.5">
//               <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
//               <span className="text-sm font-bold text-amber-400">{rating}</span>
//               <span className="text-xs text-slate-400">({reviews})</span>
//             </div>
//           )}
//         </div>

//         {/* Main Content */}
//         <div className="px-6 py-5 relative z-10 space-y-4">
//           {/* Route Information */}
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex-1">
//               <div className="text-xl font-black text-white leading-tight">{route.sourceCity}</div>
//               <p className="text-xs text-slate-400 mt-1">{formatTime(departure)}</p>
//             </div>

//             <div className="flex flex-col items-center gap-1.5 px-3 flex-shrink-0">
//               <div className="flex items-center gap-1.5">
//                 <div className="h-0.5 w-8 bg-gradient-to-r from-amber-400 to-orange-400" />
//                 <Clock className="w-3.5 h-3.5 text-amber-400" />
//                 <div className="h-0.5 w-8 bg-gradient-to-r from-orange-400 to-amber-400" />
//               </div>
//               <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full whitespace-nowrap">
//                 {Math.floor(route.estimatedTimeMinutes / 60)}h {route.estimatedTimeMinutes % 60}m
//               </span>
//               <span className="text-xs text-slate-400">📍 {route.distanceKm} km</span>
//             </div>

//             <div className="flex-1 text-right">
//               <div className="text-xl font-black text-white leading-tight">{route.destinationCity}</div>
//               <p className="text-xs text-slate-400 mt-1">{formatTime(arrival)}</p>
//             </div>
//           </div>

//           {/* Price and Type */}
//           <div className="flex items-center justify-between">
//             <span className="px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-lg text-xs font-bold">
//               {bus.type}
//             </span>
//             <div className="text-right">
//               <p className="text-xs text-slate-400">From</p>
//               <p className="text-2xl font-black text-amber-400">৳{price || bus.pricePerSeat}</p>
//             </div>
//           </div>

//           {/* Occupancy Bar */}
//           <div className="pt-3 border-t border-white/10 space-y-2">
//             <div className="flex justify-between items-center text-xs">
//               <span className="font-semibold text-slate-300">
//                 {availableSeats} of {bus.totalSeats} seats
//               </span>
//               <span className="text-slate-400">{occupancyPercentage.toFixed(0)}% booked</span>
//             </div>
//             <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${occupancyPercentage}%` }}
//                 transition={{ duration: 0.6, ease: 'easeOut' }}
//                 className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
//               />
//             </div>
//           </div>

//           {/* Warning if bus inactive */}
//           {!isActive && (
//             <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
//               <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
//               <p className="text-xs text-red-300 font-semibold">Schedule unavailable</p>
//             </div>
//           )}

//           {/* Button */}
//           <Link href={`/schedules/${id}`}>
//             <Button
//               disabled={!isActive || isFull}
//               className={`w-full h-10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
//                 !isActive || isFull
//                   ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-amber-400 to-orange-400 text-black hover:from-amber-300 hover:to-orange-300 hover:shadow-lg hover:shadow-amber-500/30 group/btn'
//               }`}
//             >
//               {isFull ? 'Sold Out' : 'Book Now'}
//               {isActive && !isFull && (
//                 <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
//               )}
//             </Button>
//           </Link>
//         </div>

//         {/* Bottom accent line */}
//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
//       </div>
//     </motion.div>
//   );
// };

// export default ScheduleCard;

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Star, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ScheduleCardProps {
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

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  id,
  bus,
  route,
  departure,
  arrival,
  availableSeats,
  price,
  rating = 4.5,
  reviews = 124,
  isActive,
}) => {
  const isFull = availableSeats === 0;
  const isLowSeats = availableSeats <= 5;
  const occupancyPercentage = ((bus.totalSeats - availableSeats) / bus.totalSeats) * 100;

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-400/30 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-white/[0.05]">
        {/* Bus Info Bar with Status Badge */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex-1">
            <h3 className="font-bold text-white text-base">{bus.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {bus.type} • {bus.number}
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {rating && (
              <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 rounded-lg px-2.5 py-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-400">{rating}</span>
                <span className="text-xs text-slate-400">({reviews})</span>
              </div>
            )}
            {isFull ? (
              <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-1 text-xs font-semibold">Full</Badge>
            ) : isLowSeats ? (
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2.5 py-1 text-xs font-semibold">Limited</Badge>
            ) : (
              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 px-2.5 py-1 text-xs font-semibold">Available</Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-5 relative z-10 space-y-4">
          {/* Route Information */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-xl font-black text-white leading-tight">{route.sourceCity}</div>
              <p className="text-xs text-slate-400 mt-1">{formatTime(departure)}</p>
            </div>

            <div className="flex flex-col items-center gap-1.5 px-3 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-8 bg-gradient-to-r from-amber-400 to-orange-400" />
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <div className="h-0.5 w-8 bg-gradient-to-r from-orange-400 to-amber-400" />
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                {Math.floor(route.estimatedTimeMinutes / 60)}h {route.estimatedTimeMinutes % 60}m
              </span>
              <span className="text-xs text-slate-400">📍 {route.distanceKm} km</span>
            </div>

            <div className="flex-1 text-right">
              <div className="text-xl font-black text-white leading-tight">{route.destinationCity}</div>
              <p className="text-xs text-slate-400 mt-1">{formatTime(arrival)}</p>
            </div>
          </div>

          {/* Price and Type */}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-lg text-xs font-bold">
              {bus.type}
            </span>
            <div className="text-right">
              <p className="text-xs text-slate-400">From</p>
              <p className="text-2xl font-black text-amber-400">৳{price || bus.pricePerSeat}</p>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                {availableSeats} of {bus.totalSeats} seats
              </span>
              <span className="text-slate-400">{occupancyPercentage.toFixed(0)}% booked</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${occupancyPercentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
              />
            </div>
          </div>

          {/* Warning if bus inactive */}
          {!isActive && (
            <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300 font-semibold">Schedule unavailable</p>
            </div>
          )}

          {/* Button */}
          <Link href={`/schedules/${id}`} className="block">
            <Button
              disabled={!isActive || isFull}
              className={`w-full h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                !isActive || isFull
                  ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-black hover:shadow-lg hover:shadow-amber-400/40 group/btn'
              }`}
            >
              {isFull ? 'Sold Out' : 'Book Now'}
              {isActive && !isFull && (
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              )}
            </Button>
          </Link>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
      </div>
    </motion.div>
  );
};

export default ScheduleCard;