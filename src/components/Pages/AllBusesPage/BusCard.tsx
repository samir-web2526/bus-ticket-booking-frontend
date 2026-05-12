'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface BusCardProps {
  id: string;
  bus: {
    id: string;
    name: string;
    type: string;
    number: string;
    totalSeats: number;
    pricePerSeat: number;
    image?: string;
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

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const BusCard: React.FC<BusCardProps> = ({
  id,
  bus,
  route,
  departure,
  arrival,
  availableSeats,
  price,
  rating = 4.5,
  reviews = 128,
  isActive,
}) => {
  const occupancyPercentage = ((bus.totalSeats - availableSeats) / bus.totalSeats) * 100;
  const isLowSeats = availableSeats <= 5;
  const isFull = availableSeats === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Image Container - Fixed aspect ratio */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {bus.image ? (
            <Image
              src={bus.image}
              alt={bus.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-amber-200/50 flex items-center justify-center">
                <span className="text-3xl font-bold text-amber-600">{bus.name.charAt(0)}</span>
              </div>
            </div>
          )}
          
          {/* Badge Overlay */}
          <div className="absolute top-3 right-3 z-10">
            {isFull ? (
              <Badge className="bg-red-500 text-white border-none">Full</Badge>
            ) : isLowSeats ? (
              <Badge className="bg-orange-500 text-white border-none">Limited</Badge>
            ) : (
              <Badge className="bg-green-500 text-white border-none">Available</Badge>
            )}
          </div>

          {/* Rating Overlay */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-white">{rating}</span>
              <span className="text-xs text-white/70">({reviews})</span>
            </div>
          </div>
        </div>

        {/* Content Container - Flex grow to fill space */}
        <div className="flex-1 flex flex-col p-5">
          {/* Title & Type */}
          <div className="mb-3">
            <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">{bus.name}</h3>
            <p className="text-sm text-muted-foreground">{bus.type} • {bus.number}</p>
          </div>

          {/* Route Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            Travel from {route.sourceCity} to {route.destinationCity} in comfort. 
            {formatDuration(route.estimatedTimeMinutes)} journey with scenic views.
          </p>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground">{route.distanceKm} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground">{formatDuration(route.estimatedTimeMinutes)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground">{formatDate(departure)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{availableSeats} seats</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Starting from</p>
            <p className="text-2xl font-bold text-amber-600">৳{price}</p>
          </div>

          {/* Occupancy Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-muted-foreground">Seat Availability</span>
              <span className="text-xs font-medium text-muted-foreground">{occupancyPercentage.toFixed(0)}% booked</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* View Details Button - Always at bottom */}
          <Link href={`/schedules/${id}`} className="mt-auto">
            <Button
              disabled={!isActive}
              className={`w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                !isActive
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30'
              }`}
            >
              View Details
              {isActive && <ArrowRight className="w-4 h-4" />}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BusCard;