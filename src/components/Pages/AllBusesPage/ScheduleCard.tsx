'use client';

/**
 * @deprecated Use BusCard component instead
 * This component is deprecated and will be removed in a future version.
 * Please use BusCard from './BusCard' which has the same interface
 * but with improved design and consistency.
 */

import BusCard from './BusCard';
export type { BusCardProps as ScheduleCardProps } from './BusCard';

// Re-export BusCard as ScheduleCard for backwards compatibility
const ScheduleCard = BusCard;
export default ScheduleCard;
