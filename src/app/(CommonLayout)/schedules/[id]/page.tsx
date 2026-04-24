import ScheduleDetailClient from '@/src/components/Pages/AllBusesPage/ScheduleDetailClient';
import { getScheduleById } from '@/src/services/schedule.service';
import { getAvailableSeats } from '@/src/services/seat.service';
import { getActiveLocks } from '@/src/services/seatlock.service';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ScheduleDetailPage({ params }: Props) {
  const { id } = await params;

  const [scheduleRes, seatsRes, locksRes] = await Promise.all([
    getScheduleById(id),
    getAvailableSeats(id),
    getActiveLocks(id),
  ]);

  // ✅ lock থাকলে booking page-এ
  if (locksRes.data && locksRes.data.length > 0) {
    redirect(`/schedules/${id}/booking`);
  }

  if (!scheduleRes.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Schedule not found</p>
        </div>
      </div>
    );
  }

  if (seatsRes.error || !seatsRes.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Failed to load seats</p>
        </div>
      </div>
    );
  }

  return (
    <ScheduleDetailClient
      scheduleId={id}
      schedule={scheduleRes.data}
      initialSeats={seatsRes.data}
      initialLocks={[]}
    />
  );
} 