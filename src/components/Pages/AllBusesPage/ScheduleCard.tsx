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
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <div className="relative h-full overflow-hidden rounded-[40px] bg-card border border-border hover:border-amber-500/20 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
        {/* Bus Info Bar */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-muted/20">
          <div className="flex-1">
            <h3 className="font-black text-foreground text-sm uppercase tracking-tight font-heading">{bus.name}</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">
              {bus.type} • {bus.number}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-[11px] font-black text-amber-600">{rating}</span>
            </div>
            {isFull ? (
              <Badge className="bg-destructive/10 text-destructive border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Full</Badge>
            ) : isLowSeats ? (
              <Badge className="bg-orange-500/10 text-orange-600 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Limited</Badge>
            ) : (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Active</Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-10 flex-1 space-y-10">
          {/* Route Information */}
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">Departure</p>
              <div className="text-2xl font-black text-foreground font-heading group-hover:text-amber-500 transition-colors leading-none tracking-tighter">{route.sourceCity}</div>
              <p className="text-[11px] font-black text-amber-600 mt-2 uppercase tracking-widest">{formatTime(departure)}</p>
            </div>

            <div className="flex flex-col items-center gap-3 flex-shrink-0">
               <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center border border-border group-hover:bg-amber-500 group-hover:border-amber-400 transition-all duration-500 shadow-sm">
                  <ArrowRight className="text-muted-foreground h-6 w-6 group-hover:text-white transition-colors" />
               </div>
               <span className="text-[9px] font-black text-foreground bg-muted/50 px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-widest border border-border">
                {Math.floor(route.estimatedTimeMinutes / 60)}H {route.estimatedTimeMinutes % 60}M
              </span>
            </div>

            <div className="flex-1 text-right">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2 text-right">Arrival</p>
              <div className="text-2xl font-black text-foreground font-heading group-hover:text-amber-500 transition-colors leading-none tracking-tighter">{route.destinationCity}</div>
              <p className="text-[11px] font-black text-amber-600 mt-2 uppercase tracking-widest text-right">{formatTime(arrival)}</p>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div className="bg-muted/30 rounded-[32px] p-6 space-y-5 border border-border/50">
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1.5">Availability</p>
                  <p className="text-foreground font-black text-base italic">{availableSeats} SEATS LEFT</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1.5">Investment</p>
                  <p className="text-4xl font-black text-foreground font-heading tracking-tighter leading-none">৳{price || bus.pricePerSeat}</p>
               </div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${occupancyPercentage}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] px-1">
                <span>0%</span>
                <span className="text-amber-600">{occupancyPercentage.toFixed(0)}% RESERVED</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Warning if bus inactive */}
          {!isActive && (
            <div className="flex items-center gap-3 p-5 bg-destructive/5 border border-destructive/10 rounded-[24px]">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-[10px] text-destructive font-black uppercase tracking-widest">Schedule Currently Unavailable</p>
            </div>
          )}

          {/* Button */}
          <Link href={`/schedules/${id}`} className="block pt-2">
            <Button
              disabled={!isActive || isFull}
              className={`w-full h-16 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl ${
                !isActive || isFull
                  ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] group/btn border-none'
              }`}
            >
              {isFull ? 'Sold Out' : 'Explore Seats'}
              {isActive && !isFull && (
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              )}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleCard;