// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Loader2, Clock, Bus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { getRouteById } from '@/src/services/routes.service';

// interface Schedule {
//   id: string;
//   departure: string;
//   arrival: string;
//   status: string;
//   bus: {
//     name: string;
//     type: string;
//     totalSeats: number;
//     operator: {
//       name: string;
//     };
//   };
// }

// interface Route {
//   id: string;
//   sourceCity: string;
//   destinationCity: string;
//   distanceKm: number;
//   estimatedTimeMinutes: number;
//   stops: string[];
//   schedules: Schedule[];
// }

// export default function RouteDetailsClient({
//   routeId,
// }: {
//   routeId: string;
// }) {
//   const router = useRouter();

//   const [route, setRoute] = useState<Route | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRoute = async () => {
//       setLoading(true);
//       setError(null);

//       const result = await getRouteById(routeId);

//       if (result.error) {
//         setError(result.error);
//         setRoute(null);
//       } else {
//         setRoute({
//           ...result.data,
//           schedules: result.data?.schedules ?? [],
//         } as Route);
//       }

//       setLoading(false);
//     };

//     if (routeId) fetchRoute();
//   }, [routeId]);

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="animate-spin text-amber-400 w-10 h-10" />
//       </div>
//     );
//   }

//   // ================= ERROR =================
//   if (error) {
//     return (
//       <div className="text-center mt-20 text-red-400">
//         {error}
//       </div>
//     );
//   }

//   // ================= NOT FOUND =================
//   if (!route) {
//     return (
//       <div className="text-center mt-20 text-red-400">
//         Route not found
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 text-white">

//       {/* ROUTE INFO */}
//       <div className="bg-[#0b1220] p-6 rounded-xl border border-white/10 mb-6">
//         <h1 className="text-2xl font-bold">
//           {route.sourceCity} → {route.destinationCity}
//         </h1>

//         <p className="text-slate-400 mt-2">
//           📍 {route.distanceKm} km • ⏱ {route.estimatedTimeMinutes} min
//         </p>

//         <p className="text-slate-500 text-sm mt-1">
//           Stops: {route.stops?.join(', ') || 'No stops'}
//         </p>
//       </div>

//       {/* TITLE */}
//       <h2 className="text-xl font-semibold mb-4">
//         Available Schedules
//       </h2>

//       {/* EMPTY STATE */}
//       {route.schedules.length === 0 ? (
//         <div className="text-slate-400 text-center py-10 border border-white/10 rounded-xl">
//           No schedules available for this route
//         </div>
//       ) : (
//         <div className="space-y-4">

//           {/* LIST */}
//           {route.schedules.map((s) => (
//             <div
//               key={s.id}
//               className="bg-[#0b1220] p-4 rounded-xl border border-white/10 flex justify-between items-center"
//             >
//               <div>
//                 <p className="flex items-center gap-2">
//                   <Clock className="h-4 w-4 text-amber-400" />
//                   {new Date(s.departure).toLocaleString()}
//                 </p>

//                 <p className="flex items-center gap-2 text-slate-400 text-sm mt-1">
//                   <Bus className="h-4 w-4" />
//                   {s.bus.name} ({s.bus.type})
//                 </p>

//                 <p className="text-slate-500 text-xs mt-1">
//                   Operator: {s.bus.operator.name}
//                 </p>
//               </div>

//               <Button
//                 onClick={() =>
//                   router.push(`/schedules/${s.id}`)
//                 }
//                 className="bg-amber-400 text-black hover:bg-amber-300"
//               >
//                 Book Now
//               </Button>
//             </div>
//           ))}

//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Clock, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRouteById, Route } from '@/src/services/routes.service';


export default function RouteDetailsClient({
  routeId,
}: {
  routeId: string;
}) {
  const router = useRouter();

  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);

      const result = await getRouteById(routeId);

      if (result.error || !result.data) {
        setError(result.error || 'Route not found');
        setRoute(null);
      } else {
        setRoute({
          ...result.data,
          schedules: result.data.schedules ?? [],
          stops: result.data.stops ?? [],
        });
      }

      setLoading(false);
    };

    if (routeId) fetchRoute();
  }, [routeId]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-amber-400 w-10 h-10" />
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="text-center mt-20 text-red-400">
        {error}
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!route) {
    return (
      <div className="text-center mt-20 text-red-400">
        Route not found
      </div>
    );
  }

  const stops = route.stops ?? [];

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">

      {/* ROUTE INFO */}
      <div className="bg-[#0b1220] p-6 rounded-xl border border-white/10 mb-6">
        <h1 className="text-2xl font-bold">
          {route.sourceCity} → {route.destinationCity}
        </h1>

        <p className="text-slate-400 mt-2">
          📍 {route.distanceKm} km • ⏱ {route.estimatedTimeMinutes} min
        </p>

        <p className="text-slate-500 text-sm mt-1">
          Stops: {stops.length > 0 ? stops.join(', ') : 'No stops'}
        </p>
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4">
        Available Schedules
      </h2>

      {/* EMPTY STATE */}
      {route.schedules.length === 0 ? (
        <div className="text-slate-400 text-center py-10 border border-white/10 rounded-xl">
          No schedules available for this route
        </div>
      ) : (
        <div className="space-y-4">

          {/* LIST */}
          {route.schedules.map((s) => (
            <div
              key={s.id}
              className="bg-[#0b1220] p-4 rounded-xl border border-white/10 flex justify-between items-center"
            >
              <div>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  {new Date(s.departure).toLocaleString()}
                </p>

                <p className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                  <Bus className="h-4 w-4" />
                  {s.bus.name} ({s.bus.type})
                </p>

                <p className="text-slate-500 text-xs mt-1">
                  Operator: {s.bus.operator?.name || 'N/A'}
                </p>
              </div>

              <Button
                onClick={() => router.push(`/schedules/${s.id}`)}
                className="bg-amber-400 text-black hover:bg-amber-300"
              >
                Book Now
              </Button>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}