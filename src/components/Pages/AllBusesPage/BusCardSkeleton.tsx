'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface BusCardSkeletonProps {
  count?: number;
}

const BusCardSkeleton: React.FC<BusCardSkeletonProps> = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="h-full"
        >
          <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-lg">
            {/* Image Skeleton */}
            <div className="relative h-48 overflow-hidden bg-muted">
              <Skeleton className="w-full h-full" />
              
              {/* Badge Skeleton */}
              <div className="absolute top-3 right-3 z-10">
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>

              {/* Rating Skeleton */}
              <div className="absolute bottom-3 left-3 z-10">
                <Skeleton className="w-20 h-6 rounded-full" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 flex flex-col p-5">
              {/* Title & Type */}
              <div className="mb-3">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4" />
              </div>

              {/* Description Skeleton */}
              <div className="mb-4">
                <Skeleton className="w-full h-4 mb-1" />
                <Skeleton className="w-2/3 h-4" />
              </div>

              {/* Meta Info Grid Skeleton */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-full h-5" />
              </div>

              {/* Price Skeleton */}
              <div className="mb-4">
                <Skeleton className="w-20 h-3 mb-1" />
                <Skeleton className="w-24 h-8" />
              </div>

              {/* Occupancy Bar Skeleton */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <Skeleton className="w-24 h-3" />
                  <Skeleton className="w-12 h-3" />
                </div>
                <Skeleton className="w-full h-1.5 rounded-full" />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Button Skeleton */}
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default BusCardSkeleton;
