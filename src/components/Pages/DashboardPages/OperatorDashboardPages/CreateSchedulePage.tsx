/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bus, Route, Clock, CalendarClock, Zap, ArrowRight, Loader2, Info, Navigation, CheckCircle2, ShieldCheck } from "lucide-react";

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

  const inputCls = "bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:ring-amber-500/20 rounded-2xl h-14 transition-all duration-300";
  const selectCls = "w-full bg-muted/50 border border-border text-foreground rounded-2xl h-14 px-4 focus:border-amber-500 focus:outline-none transition-all duration-300 appearance-none";
  const labelCls = "text-sm font-semibold text-amber-600 block mb-3 ml-1";

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Decorative bg blobs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.02] rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Schedule Management</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Create <span className="text-amber-600">Schedule</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-7">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.03] p-10 lg:p-12">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <CalendarClock className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold text-foreground tracking-tight">Schedule Details</h2>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                  <p className="text-base font-medium text-muted-foreground animate-pulse">Loading data...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Select Bus</label>
                      <div className="relative">
                        <select {...register("busId")} className={selectCls}>
                          <option value="">Choose a bus...</option>
                          {buses.map((bus) => (
                            <option key={bus.id} value={bus.id}>{bus.name} — {bus.number}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                          <Bus className="w-4 h-4 opacity-40" />
                        </div>
                      </div>
                      {errors.busId && <p className="text-destructive text-sm font-medium mt-2 ml-1">{errors.busId.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Select Route</label>
                      <div className="relative">
                        <select {...register("routeId")} className={selectCls}>
                          <option value="">Choose a route...</option>
                          {routes.map((route) => (
                            <option key={route.id} value={route.id}>
                              {route.sourceCity} → {route.destinationCity}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                          <Navigation className="w-4 h-4 opacity-40" />
                        </div>
                      </div>
                      {errors.routeId && <p className="text-destructive text-sm font-medium mt-2 ml-1">{errors.routeId.message}</p>}
                    </div>
                  </div>

                  <div className="p-8 bg-muted/30 border border-border/50 rounded-[32px] space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelCls}>Departure Time</label>
                        <Input type="datetime-local" {...register("departure")} min={values.arrival || minDateTime}
                          className={inputCls} />
                        {errors.departure && <p className="text-destructive text-sm font-medium mt-2 ml-1">{errors.departure.message}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Arrival Time</label>
                        <Input type="datetime-local" {...register("arrival")} min={values.departure || minDateTime}
                          className={inputCls} />
                        {errors.arrival && <p className="text-destructive text-sm font-medium mt-2 ml-1">{errors.arrival.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Schedule Status</label>
                      <div className="relative">
                        <select {...register("status")} className={selectCls}>
                          <option value="scheduled">Scheduled</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                          <Info className="w-4 h-4 opacity-40" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full h-14 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 disabled:cursor-not-allowed text-base shadow-xl shadow-slate-900/20">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : <Zap className="w-5 h-5 text-amber-500" />}
                    {isSubmitting ? "Creating..." : "Create Schedule"}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5 sticky top-24">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.03] p-10 lg:p-12">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold text-foreground tracking-tight">Preview</h2>
              </div>

              <div className="mb-10 p-10 bg-muted/30 rounded-[40px] border border-border/50 relative overflow-hidden">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="flex flex-col items-center shrink-0">
                    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-white" />
                    <div className="w-1 h-24 bg-gradient-to-b from-emerald-500 to-amber-500 my-2 rounded-full opacity-40" />
                    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-white" />
                  </div>
                  <div className="flex flex-col justify-between h-[152px] flex-1">
                    <div>
                      <p className="text-xs font-medium text-emerald-600 mb-1 opacity-70">From</p>
                      <p className="text-2xl font-bold text-foreground tracking-tight truncate leading-none">
                        {selectedRoute?.sourceCity ?? "Select route"}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground mt-2 opacity-60">{formatDateTime(values.departure) ?? "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-amber-600 mb-1 opacity-70">To</p>
                      <p className="text-2xl font-bold text-foreground tracking-tight truncate leading-none">
                        {selectedRoute?.destinationCity ?? "Select route"}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground mt-2 opacity-60">{formatDateTime(values.arrival) ?? "Not set"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-sm font-medium text-muted-foreground mb-4 opacity-60">Summary</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Bus,          label: "Bus",         value: selectedBus   ? `${selectedBus.name}` : "—", color: "text-blue-500" },
                    { icon: Route,        label: "Distance",    value: selectedRoute ? `${selectedRoute.distanceKm} km` : "—", color: "text-emerald-500" },
                    { icon: Clock,        label: "Duration",    value: getDuration() ?? "—", color: "text-amber-500" },
                    { icon: ShieldCheck,  label: "Status",      value: values.status ? values.status.charAt(0).toUpperCase() + values.status.slice(1) : "—", color: "text-purple-500" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="p-5 bg-muted/20 border border-border/50 rounded-[28px] group hover:bg-muted/40 transition-all duration-500">
                      <div className={`w-8 h-8 rounded-xl bg-slate-900 ${color} flex items-center justify-center mb-4 shadow-lg shadow-slate-900/10`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium mb-1 opacity-60">{label}</p>
                      <p className="text-sm font-semibold text-foreground tracking-tight truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {selectedRoute?.estimatedTimeMinutes && (
                  <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-emerald-600 leading-none mb-1">Time Estimate</p>
                       <p className="text-sm font-medium text-foreground/60 leading-none">
                         {Math.floor(selectedRoute.estimatedTimeMinutes / 60)}h {selectedRoute.estimatedTimeMinutes % 60}m estimated
                       </p>
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-border/50 flex items-center justify-between">
                   <div>
                      <p className="text-sm font-medium text-muted-foreground opacity-60 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          values.status === "scheduled" ? "bg-blue-500" : values.status === "cancelled" ? "bg-destructive" : "bg-emerald-500"
                        }`} />
                        <p className="text-xl font-semibold text-foreground tracking-tight capitalize">{values.status}</p>
                      </div>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 shadow-xl">
                      <Zap className="w-5 h-5 fill-amber-500" />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}