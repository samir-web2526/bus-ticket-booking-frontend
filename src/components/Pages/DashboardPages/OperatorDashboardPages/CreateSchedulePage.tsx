/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bus, Route, Clock, CalendarClock, Zap, ArrowRight } from "lucide-react";

import { getRoutesForDropdown } from "@/src/services/routes.service";
import { createSchedule } from "@/src/services/schedule.service";
import { getOperatorBuses } from "@/src/services/buses.service";

const scheduleSchema = z
  .object({
    busId:     z.string().min(1, "Bus is required"),
    routeId:   z.string().min(1, "Route is required"),
    departure: z.string().min(1, "Departure time is required"),
    arrival:   z.string().min(1, "Arrival time is required"),
    status:    z.enum(["scheduled", "cancelled", "completed"]).optional(),
  })
  .refine(
    (data) => { if (!data.departure) return true; return new Date(data.departure) > new Date(); },
    { message: "Departure cannot be in the past", path: ["departure"] }
  )
  .refine(
    (data) => { if (!data.departure || !data.arrival) return true; return new Date(data.arrival) > new Date(data.departure); },
    { message: "Arrival must be after departure", path: ["arrival"] }
  );

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface BusOption   { id: string; name: string; number: string; type: string }
interface RouteOption { id: string; sourceCity: string; destinationCity: string; distanceKm: number; estimatedTimeMinutes: number }

export default function CreateSchedule() {
  const [buses,   setBuses]   = useState<BusOption[]>([]);
  const [routes,  setRoutes]  = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);

  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }, []);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema) as any,
    defaultValues: { busId: "", routeId: "", departure: "", arrival: "", status: "scheduled" },
  });

  const { handleSubmit, register, formState: { errors, isSubmitting }, control } = form;

  const values = useWatch({
    control,
    defaultValue: { busId: "", routeId: "", departure: "", arrival: "", status: "scheduled" },
  });

  const selectedBus   = buses.find((b) => b.id === values.busId);
  const selectedRoute = routes.find((r) => r.id === values.routeId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const busRes   = await getOperatorBuses();
      const routeRes = await getRoutesForDropdown();
      if (busRes.data) {
        const raw = Array.isArray(busRes.data) ? busRes.data : busRes.data?.data ?? [];
        setBuses(raw);
      }
      if (routeRes.data) setRoutes(routeRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getDuration = () => {
    if (!values.departure || !values.arrival) return null;
    const diff = new Date(values.arrival).getTime() - new Date(values.departure).getTime();
    if (diff <= 0) return null;
    return `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`;
  };

  const formatDateTime = (val: string | undefined) => {
    if (!val) return null;
    return new Date(val).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" });
  };

  const onSubmit = async (data: ScheduleFormValues) => {
    const res = await createSchedule({
      busId:     data.busId,
      routeId:   data.routeId,
      departure: new Date(data.departure).toISOString(),
      arrival:   new Date(data.arrival).toISOString(),
      status:    data.status,
    });
    if (res.error) toast.error(res.error);
    else { toast.success("Schedule created successfully!"); form.reset(); }
  };

  const selectClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl h-11 px-3 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors";

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-6 lg:p-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-3">— Operator Dashboard</p>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">Create Schedule</h1>
          <p className="text-gray-500 text-lg">Assign a bus to a route with departure & arrival times</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Schedule Details</h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-5">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest block mb-2">Bus</label>
                    <select {...register("busId")} className={selectClass}>
                      <option value="">Select a bus...</option>
                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>{bus.name} — {bus.number} ({bus.type})</option>
                      ))}
                    </select>
                    {errors.busId && <p className="text-xs text-red-500 mt-2">{errors.busId.message}</p>}
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest block mb-2">Route</label>
                    <select {...register("routeId")} className={selectClass}>
                      <option value="">Select a route...</option>
                      {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.sourceCity} → {route.destinationCity} ({route.distanceKm} km)
                        </option>
                      ))}
                    </select>
                    {errors.routeId && <p className="text-xs text-red-500 mt-2">{errors.routeId.message}</p>}
                  </motion.div>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest block mb-2">Departure</label>
                      <Input type="datetime-local" {...register("departure")} min={values.arrival || minDateTime}
                        className="bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-0 rounded-xl h-11" />
                      {errors.departure && <p className="text-xs text-red-500 mt-2">{errors.departure.message}</p>}
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest block mb-2">Arrival</label>
                      <Input type="datetime-local" {...register("arrival")} min={values.departure || minDateTime}
                        className="bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-0 rounded-xl h-11" />
                      {errors.arrival && <p className="text-xs text-red-500 mt-2">{errors.arrival.message}</p>}
                    </motion.div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest block mb-2">Status</label>
                    <select {...register("status")} className={selectClass}>
                      <option value="scheduled">Scheduled</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider mt-2"
                  >
                    {isSubmitting
                      ? (<><Zap className="w-4 h-4 animate-spin" />Creating...</>)
                      : (<><Zap className="w-4 h-4" />Create Schedule</>)}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-gray-50 border border-gray-200 rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-8">Schedule Preview</h2>

              <div className="flex items-start gap-4 mb-8">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div className="w-0.5 h-16 bg-gradient-to-b from-emerald-500 to-red-400" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="w-3 h-3 rounded-full bg-red-400" />
                </div>
                <div className="flex flex-col justify-between gap-10 flex-1">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">From</p>
                    <p className={`text-2xl font-black ${selectedRoute ? "text-gray-900" : "text-gray-300"}`}>
                      {selectedRoute?.sourceCity ?? "Source City"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">To</p>
                    <p className={`text-2xl font-black ${selectedRoute ? "text-gray-900" : "text-gray-300"}`}>
                      {selectedRoute?.destinationCity ?? "Destination City"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Bus,          label: "Bus",       value: selectedBus   ? `${selectedBus.name} (${selectedBus.type})` : "—" },
                  { icon: Route,        label: "Distance",  value: selectedRoute ? `${selectedRoute.distanceKm} km` : "—" },
                  { icon: CalendarClock,label: "Departure", value: formatDateTime(values.departure) ?? "—", small: true },
                  { icon: Clock,        label: "Duration",  value: getDuration() ?? "—" },
                ].map(({ icon: Icon, label, value, small }) => (
                  <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <Icon className="h-4 w-4 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className={`font-black text-gray-900 truncate ${small ? "text-xs" : "text-xl"}`}>{value}</p>
                  </div>
                ))}
              </div>

              {selectedRoute?.estimatedTimeMinutes && (
                <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold mb-4">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  Est. {Math.floor(selectedRoute.estimatedTimeMinutes / 60)}h {selectedRoute.estimatedTimeMinutes % 60}m travel time
                </div>
              )}

              {values.status && (
                <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${
                  values.status === "scheduled" ? "bg-blue-50 border-blue-200 text-blue-700"
                  : values.status === "cancelled" ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {values.status.charAt(0).toUpperCase() + values.status.slice(1)}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}