'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, ArrowRight, AlertCircle } from 'lucide-react';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {isFull ? (
            <Badge className="bg-red-500 text-white">Full</Badge>
          ) : isLowSeats ? (
            <Badge className="bg-orange-500 text-white">Limited Seats</Badge>
          ) : (
            <Badge className="bg-green-500 text-white">Available</Badge>
          )}
        </div>

        {/* Bus Info Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{bus.name}</h3>
            <p className="text-xs text-gray-600">
              {bus.type} • {bus.number}
            </p>
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
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {route.sourceCity}
              </div>
              <p className="text-sm text-gray-600">{departure}</p>
            </div>

            <div className="flex flex-col items-center gap-2 px-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-cyan-400" />
                <Clock className="w-4 h-4 text-blue-500" />
                <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-400" />
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {route.estimatedTimeMinutes}m
              </span>
              <span className="text-xs text-gray-500">
                {(route.distanceKm || 0).toFixed(0)} km
              </span>
            </div>

            <div className="flex-1 text-right">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {route.destinationCity}
              </div>
              <p className="text-sm text-gray-600">{arrival}</p>
            </div>
          </div>

          {/* Price and Seats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {bus.type}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">From</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                ৳{price || bus.pricePerSeat}
              </p>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Seats Available: {availableSeats}/{bus.totalSeats}
              </span>
              <span className="text-xs text-gray-600">
                {occupancyPercentage.toFixed(0)}% Full
              </span>
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

          {/* Warning if bus inactive */}
          {!isActive && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-xs text-yellow-700 font-semibold">
                This schedule is currently unavailable
              </p>
            </div>
          )}

          {/* Button */}
          <Link href={`/schedules/${id}`}>
            <Button
              disabled={!isActive || isFull}
              className={`w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                !isActive || isFull
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              Book Now
              {isActive && !isFull && <ArrowRight className="w-4 h-4" />}
            </Button>
          </Link>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />
      </div>
    </motion.div>
  );
};

export default ScheduleCard;