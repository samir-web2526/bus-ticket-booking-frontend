

import { redirect } from 'next/navigation';
import { getScheduleById } from '@/src/services/schedule.service';
import { getActiveLocks } from '@/src/services/seatlock.service';
import BookingConfirmPage from '@/src/components/Pages/BookingConfirmPage/BookingConfirmPage';


interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: Props) {
  const { id } = await params;

  const [scheduleRes, locksRes] = await Promise.all([
    getScheduleById(id),
    getActiveLocks(id),
  ]);

  // ✅ lock না থাকলে seat select page-এ
  if (!locksRes.data || locksRes.data.length === 0) {
    redirect(`/schedules/${id}`);
  }

  if (!scheduleRes.data) {
    redirect(`/schedules/${id}`);
  }

  const locks = locksRes.data;
  const schedule = scheduleRes.data;
//   const totalPrice = locks.reduce((sum, l) => sum + l.seat.price, 0);

  return (
    <BookingConfirmPage
      schedule={schedule}
      locks={locks}
    //   totalPrice={totalPrice}
    />
  );
}