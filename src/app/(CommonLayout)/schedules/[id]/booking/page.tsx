// import { redirect } from 'next/navigation';
// import { getScheduleById } from '@/src/services/schedule.service';
// import { getActiveLocks } from '@/src/services/seatlock.service';

// interface Props {
//   params: Promise<{ id: string }>;
// }

// export default async function BookingPage({ params }: Props) {
//   const { id } = await params;

//   const [scheduleRes, locksRes] = await Promise.all([
//     getScheduleById(id),
//     getActiveLocks(id),
//   ]);

//   // ✅ lock না থাকলে seat select page-এ
//   if (!locksRes.data || locksRes.data.length === 0) {
//     redirect(`/schedules/${id}`);
//   }

//   if (!scheduleRes.data) {
//     redirect(`/schedules/${id}`);
//   }

//   const locks = locksRes.data;
//   const schedule = scheduleRes.data;
//   const totalPrice = locks.reduce((sum, l) => sum + l.seat.price, 0);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm Booking</h1>
//         <p className="text-gray-400 text-sm mb-6">
//           {schedule.route?.sourceCity} → {schedule.route?.destinationCity}
//         </p>

//         <div className="space-y-2 mb-6">
//           {locks.map((lock) => (
//             <div key={lock.id} className="flex justify-between text-sm">
//               <span className="text-gray-600">
//                 Seat {lock.seat.number}{' '}
//                 <span className="text-xs text-gray-400">({lock.seat.type})</span>
//               </span>
//               <span className="font-semibold">৳{lock.seat.price}</span>
//             </div>
//           ))}
//           <div className="border-t pt-3 flex justify-between font-bold">
//             <span>Total</span>
//             <span className="text-blue-600 text-lg">৳{totalPrice}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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