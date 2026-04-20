// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Clock,Star, ArrowRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// interface BusCardProps {
//   id: string;
//   name: string;
//   type: string;
//   operatorName: string;
//   operatorImage?: string;
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

// const BusCard: React.FC<BusCardProps> = ({
//   id,
//   name,
//   type,
//   operatorName,
//   operatorImage,
//   from,
//   to,
//   departureTime,
//   arrivalTime,
//   duration,
//   availableSeats,
//   totalSeats,
//   price,
//   rating = 4.5,
//   reviews = 124,
//   amenities = [],
//   isActive,
// }) => {
//   const occupancyPercentage = ((totalSeats - availableSeats) / totalSeats) * 100;
//   const isLowSeats = availableSeats <= 5;
//   const isFull = availableSeats === 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: 'easeOut' }}
//       whileHover={{ y: -4 }}
//       className="group"
//     >
//       <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
//         {/* Gradient Background Accent */}
//         <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-cyan-50/50 pointer-events-none" />

//         {/* Badge Corner */}
//         <div className="absolute top-4 right-4 z-10">
//           {isFull ? (
//             <Badge className="bg-red-500 text-white">Full</Badge>
//           ) : isLowSeats ? (
//             <Badge className="bg-orange-500 text-white">Limited</Badge>
//           ) : (
//             <Badge className="bg-green-500 text-white">Available</Badge>
//           )}
//         </div>

//         {/* Operator Info Bar */}
//         <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
//           {operatorImage ? (
//             <img
//               src={operatorImage}
//               alt={operatorName}
//               className="w-10 h-10 rounded-full object-cover"
//             />
//           ) : (
//             <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
//               {operatorName.charAt(0)}
//             </div>
//           )}
//           <div className="flex-1">
//             <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
//             <p className="text-xs text-gray-600">{operatorName}</p>
//           </div>
//           {rating && (
//             <div className="flex items-center gap-1">
//               <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//               <span className="text-sm font-semibold text-gray-900">{rating}</span>
//               <span className="text-xs text-gray-500">({reviews})</span>
//             </div>
//           )}
//         </div>

//         {/* Main Content */}
//         <div className="p-6 relative z-10">
//           {/* Route Information */}
//           <div className="flex items-start justify-between mb-6">
//             <div className="flex-1">
//               <div className="text-2xl font-bold text-gray-900 mb-1">{from}</div>
//               <p className="text-sm text-gray-600">{departureTime}</p>
//             </div>

//             <div className="flex flex-col items-center gap-2 px-4">
//               <div className="flex items-center gap-2">
//                 <div className="h-1 w-12 bg-linear-to-r from-blue-400 to-cyan-400" />
//                 <Clock className="w-4 h-4 text-blue-500" />
//                 <div className="h-1 w-12 bg-linear-to-r from-cyan-400 to-blue-400" />
//               </div>
//               <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
//                 {duration}
//               </span>
//             </div>

//             <div className="flex-1 text-right">
//               <div className="text-2xl font-bold text-gray-900 mb-1">{to}</div>
//               <p className="text-sm text-gray-600">{arrivalTime}</p>
//             </div>
//           </div>

//           {/* Bus Type and Price */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
//                 {type}
//               </span>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-gray-600">From</p>
//               <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
//                 ৳{price}
//               </p>
//             </div>
//           </div>

//           {/* Amenities */}
//           {amenities.length > 0 && (
//             <div className="flex flex-wrap gap-2 mb-4">
//               {amenities.slice(0, 3).map((amenity, index) => (
//                 <span
//                   key={index}
//                   className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg"
//                 >
//                   {amenity}
//                 </span>
//               ))}
//               {amenities.length > 3 && (
//                 <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg">
//                   +{amenities.length - 3} more
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Occupancy Bar */}
//           <div className="mb-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-medium text-gray-700">
//                 Seats Available: {availableSeats}/{totalSeats}
//               </span>
//               <span className="text-xs text-gray-600">{occupancyPercentage.toFixed(0)}% Full</span>
//             </div>
//             <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${occupancyPercentage}%` }}
//                 transition={{ duration: 0.6, ease: 'easeOut' }}
//                 className="h-full bg-linear-to-r from-blue-500 to-cyan-500"
//               />
//             </div>
//           </div>

//           {/* Button */}
//           <Link href={`/buses/${id}`}>
//             <Button
//               disabled={!isActive}
//               className={`w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
//                 !isActive
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-blue-500/30'
//               }`}
//             >
//               View Details
//               {isActive && <ArrowRight className="w-4 h-4" />}
//             </Button>
//           </Link>
//         </div>

//         {/* Bottom accent line */}
//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-cyan-500 to-blue-500" />
//       </div>
//     </motion.div>
//   );
// };

// export default BusCard;

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BusCardProps {
  id: string;
  name: string;
  type: string;
  operatorName: string;
  operatorImage?: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  rating?: number;
  reviews?: number;
  amenities?: string[];
  isActive: boolean;
}

const BusCard: React.FC<BusCardProps> = ({
  id,
  name,
  type,
  operatorName,
  operatorImage,
  from,
  to,
  departureTime,
  arrivalTime,
  duration,
  availableSeats,
  totalSeats,
  price,
  rating = 4.5,
  reviews = 124,
  amenities = [],
  isActive,
}) => {
  const occupancyPercentage = ((totalSeats - availableSeats) / totalSeats) * 100;
  const isLowSeats = availableSeats <= 5;
  const isFull = availableSeats === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        {/* Gradient Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 pointer-events-none" />

        {/* Badge Corner */}
        <div className="absolute top-4 right-4 z-10">
          {isFull ? (
            <Badge className="bg-red-500 text-white">Full</Badge>
          ) : isLowSeats ? (
            <Badge className="bg-orange-500 text-white">Limited</Badge>
          ) : (
            <Badge className="bg-green-500 text-white">Available</Badge>
          )}
        </div>

        {/* Operator Info Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
          {operatorImage ? (
            <img
              src={operatorImage}
              alt={operatorName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
              {operatorName.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
            <p className="text-xs text-gray-600">{operatorName}</p>
          </div>
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">{rating}</span>
              <span className="text-xs text-gray-500">({reviews})</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-6 relative z-10">
          {/* Route Information */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-1">{from}</div>
              <p className="text-sm text-gray-600">{departureTime}</p>
            </div>

            <div className="flex flex-col items-center gap-2 px-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-cyan-400" />
                <Clock className="w-4 h-4 text-blue-500" />
                <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-400" />
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {duration}
              </span>
            </div>

            <div className="flex-1 text-right">
              <div className="text-2xl font-bold text-gray-900 mb-1">{to}</div>
              <p className="text-sm text-gray-600">{arrivalTime}</p>
            </div>
          </div>

          {/* Bus Type and Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {type}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">From</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                ৳{price}
              </p>
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg">
                  +{amenities.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Occupancy Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Seats Available: {availableSeats}/{totalSeats}
              </span>
              <span className="text-xs text-gray-600">{occupancyPercentage.toFixed(0)}% Full</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${occupancyPercentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              />
            </div>
          </div>

          {/* Button */}
          <Link href={`/buses/${id}`}>
            <Button
              disabled={!isActive}
              className={`w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                !isActive
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              View Details
              {isActive && <ArrowRight className="w-4 h-4" />}
            </Button>
          </Link>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />
      </div>
    </motion.div>
  );
};

export default BusCard;