// app/schedules/[id]/page.tsx
// Server Component — fetches schedule + seats via cookie auth, passes to client

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
  // ✅ Next.js 15+ requires awaiting params
  const { id } = await params;

  console.log('[ScheduleDetailPage] Loading schedule:', { scheduleId: id });

  const [scheduleRes, seatsRes, locksRes] = await Promise.all([
    getScheduleById(id),
    getAvailableSeats(id),
    getActiveLocks(id),
  ]);

  console.log('[ScheduleDetailPage] Active locks:', {
  data: locksRes.data,
  error: locksRes.error,
});


  if (locksRes.data && locksRes.data.length > 0) {
  redirect(`/schedules/${id}/booking`);
}

  // ✅ Debug: Log all responses
  console.log('[ScheduleDetailPage] Response:', {
    scheduleHasData: !!scheduleRes.data,
    scheduleError: scheduleRes.error,
    seatsHasData: !!seatsRes.data,
    seatsError: seatsRes.error,
  });

  if (scheduleRes.error) {
    console.error('[ScheduleDetailPage] Schedule Fetch Error:', {
      error: scheduleRes.error,
      scheduleId: id,
      timestamp: new Date().toISOString(),
    });
  }

  if (seatsRes.error) {
    console.warn('[ScheduleDetailPage] Seats Fetch Warning:', {
      error: seatsRes.error,
      scheduleId: id,
    });
  }

  if (!scheduleRes.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Schedule not found</p>
          <p className="text-gray-500 text-sm mt-2">
            {scheduleRes.error 
              ? `Error: ${scheduleRes.error}` 
              : `Schedule ID: ${id}`}
          </p>
          <p className="text-gray-400 text-xs mt-4">
            If this persists, please check:
          </p>
          <ul className="text-gray-400 text-xs mt-2 space-y-1 text-left">
            <li>✓ Schedule ID is correct</li>
            <li>✓ Backend server is running</li>
            <li>✓ You are logged in</li>
            <li>✓ API endpoint: /api/v1/schedules/{id}</li>
          </ul>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
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
          <p className="text-gray-500 text-sm mt-2">
            {seatsRes.error || 'No seats available'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ScheduleDetailClient
      scheduleId={id}
      schedule={scheduleRes.data}
      initialSeats={seatsRes.data}
      initialLocks={locksRes.data ?? []}
    />
  );
}