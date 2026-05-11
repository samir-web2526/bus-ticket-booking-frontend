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
  const labelCls = "text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] block mb-3 ml-1";

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Decorative bg blobs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.02] rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Operations Scheduling</p>
          <h1 className="text-4xl lg:text-6xl font-black text-foreground tracking-tighter font-heading uppercase italic">
            Assign <span className="text-amber-500">Service</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-7">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.03] p-10 lg:p-12">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <CalendarClock className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-black text-foreground font-heading tracking-tight uppercase italic">Service Parameters</h2>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Fleet & Route Data...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Asset Selection (Bus)</label>
                      <div className="relative">
                        <select {...register("busId")} className={selectCls}>
                          <option value="">Authorize Asset...</option>
                          {buses.map((bus) => (
                            <option key={bus.id} value={bus.id}>{bus.name.toUpperCase()} — {bus.number}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                          <Bus className="w-4 h-4 opacity-40" />
                        </div>
                      </div>
                      {errors.busId && <p className="text-destructive text-[10px] font-black uppercase mt-2 ml-1">{errors.busId.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Vector Selection (Route)</label>
                      <div className="relative">
                        <select {...register("routeId")} className={selectCls}>
                          <option value="">Authorize Path...</option>
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
                      {errors.routeId && <p className="text-destructive text-[10px] font-black uppercase mt-2 ml-1">{errors.routeId.message}</p>}
                    </div>
                  </div>

                  <div className="p-8 bg-muted/30 border border-border/50 rounded-[32px] space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelCls}>Service Commencement</label>
                        <Input type="datetime-local" {...register("departure")} min={values.arrival || minDateTime}
                          className={inputCls} />
                        {errors.departure && <p className="text-destructive text-[10px] font-black uppercase mt-2 ml-1">{errors.departure.message}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Service Conclusion</label>
                        <Input type="datetime-local" {...register("arrival")} min={values.departure || minDateTime}
                          className={inputCls} />
                        {errors.arrival && <p className="text-destructive text-[10px] font-black uppercase mt-2 ml-1">{errors.arrival.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Operational Status</label>
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

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full h-16 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-2xl transition-all duration-500 flex items-center justify-center gap-4 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-900/20">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : <Zap className="w-5 h-5 text-amber-500" />}
                    {isSubmitting ? "Finalizing Manifest..." : "Initialize Service Cycle"}
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
                 <h2 className="text-2xl font-black text-foreground font-heading tracking-tight uppercase italic">Service Manifest</h2>
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
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 italic opacity-60">Origin Entry</p>
                      <p className="text-2xl font-black text-foreground font-heading uppercase italic tracking-tighter truncate leading-none">
                        {selectedRoute?.sourceCity ?? "Unresolved"}
                      </p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tight mt-2 opacity-40 italic">{formatDateTime(values.departure) ?? "TBD"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 italic opacity-60">Terminal Exit</p>
                      <p className="text-2xl font-black text-foreground font-heading uppercase italic tracking-tighter truncate leading-none">
                        {selectedRoute?.destinationCity ?? "Unresolved"}
                      </p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tight mt-2 opacity-40 italic">{formatDateTime(values.arrival) ?? "TBD"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-40">System Integration Status</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Bus,          label: "Asset",       value: selectedBus   ? `${selectedBus.name}` : "—", color: "text-blue-500" },
                    { icon: Route,        label: "Span",        value: selectedRoute ? `${selectedRoute.distanceKm} KM` : "—", color: "text-emerald-500" },
                    { icon: Clock,        label: "Cycle",       value: getDuration() ?? "—", color: "text-amber-500" },
                    { icon: ShieldCheck,  label: "Integrity",   value: values.status ? values.status.toUpperCase() : "—", color: "text-purple-500" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="p-5 bg-muted/20 border border-border/50 rounded-[28px] group hover:bg-muted/40 transition-all duration-500">
                      <div className={`w-8 h-8 rounded-xl bg-slate-900 ${color} flex items-center justify-center mb-4 shadow-lg shadow-slate-900/10`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 opacity-40 italic">{label}</p>
                      <p className="text-sm font-black text-foreground font-heading tracking-tight italic uppercase truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {selectedRoute?.estimatedTimeMinutes && (
                  <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic leading-none mb-1">Efficiency Match</p>
                       <p className="text-[10px] font-black text-foreground/60 uppercase tracking-tight italic leading-none">
                         Synchronized with Route Est. {Math.floor(selectedRoute.estimatedTimeMinutes / 60)}H {selectedRoute.estimatedTimeMinutes % 60}M
                       </p>
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-border/50 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic mb-1">Service Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          values.status === "scheduled" ? "bg-blue-500" : values.status === "cancelled" ? "bg-destructive" : "bg-emerald-500"
                        }`} />
                        <p className="text-xl font-black text-foreground font-heading tracking-tighter italic uppercase">{values.status}</p>
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