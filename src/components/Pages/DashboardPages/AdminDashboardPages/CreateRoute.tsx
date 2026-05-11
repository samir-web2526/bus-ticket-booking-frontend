/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Clock, Route as RouteIcon, Zap, Loader2, Navigation, Map, Globe, ShieldCheck, Activity, Target } from "lucide-react";
import { createRoute } from "@/src/services/routes.service";

const routeSchema = z.object({
  sourceCity: z.string().min(1),
  destinationCity: z.string().min(1),
  distanceKm: z.coerce.number().min(1),
  estimatedTimeMinutes: z.coerce.number().min(1),
  stops: z.array(z.object({ value: z.string().min(1) })),
}).refine((data) => data.sourceCity !== data.destinationCity, {
  message: "Source and destination cannot be same",
  path: ["destinationCity"],
});

type RouteFormValues = z.infer<typeof routeSchema>;

export default function CreateRoute() {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema) as any,
    defaultValues: { sourceCity: "", destinationCity: "", distanceKm: 0, estimatedTimeMinutes: 0, stops: [] },
  });

  const { handleSubmit, register, formState: { errors, isSubmitting }, control } = form;
  const values = useWatch({ control, defaultValue: { sourceCity: "", destinationCity: "", distanceKm: 0, estimatedTimeMinutes: 0, stops: [] } });
  const { fields, append, remove } = useFieldArray({ control, name: "stops" });

  const onSubmit = async (data: RouteFormValues) => {
    const payload = { ...data, stops: data.stops.map((s) => s.value) };
    const res = await createRoute(payload);
    if (res.error) { toast.error(res.error); }
    else { toast.success("Route created successfully!"); form.reset(); }
  };

  const inputCls = "bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:ring-amber-500/20 rounded-[20px] h-16 transition-all duration-500 font-black uppercase tracking-tight italic";
  const labelCls = "text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] block mb-4 ml-2 italic";

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-amber-600 text-[10px] font-black tracking-[0.5em] uppercase mb-5 italic">— LOGISTICS ENGINEERING</p>
          <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter font-heading uppercase italic">
            MAP <span className="text-amber-500">VECTOR</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-7">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.04] p-10 lg:p-16 relative overflow-hidden">
               <div className="flex items-center gap-6 mb-12 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
                    <Navigation className="w-6 h-6" />
                 </div>
                 <h2 className="text-3xl font-black text-foreground font-heading tracking-tighter uppercase italic">Vector Coordinates</h2>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className={labelCls}>Origin Node</label>
                    <Input placeholder="DHAKA" {...register("sourceCity")} className={inputCls} />
                    {errors.sourceCity && <p className="text-destructive text-[9px] font-black uppercase mt-2 ml-2 italic tracking-widest">{errors.sourceCity.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Terminal Node</label>
                    <Input placeholder="CHITTAGONG" {...register("destinationCity")} className={inputCls} />
                    {errors.destinationCity && <p className="text-destructive text-[9px] font-black uppercase mt-2 ml-2 italic tracking-widest">{errors.destinationCity.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className={labelCls}>Linear Magnitude (KM)</label>
                    <Input type="number" placeholder="0" {...register("distanceKm")} className={inputCls} />
                    {errors.distanceKm && <p className="text-destructive text-[9px] font-black uppercase mt-2 ml-2 italic tracking-widest">{errors.distanceKm.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Estimated Interval (MINS)</label>
                    <Input type="number" placeholder="0" {...register("estimatedTimeMinutes")} className={inputCls} />
                    {errors.estimatedTimeMinutes && <p className="text-destructive text-[9px] font-black uppercase mt-2 ml-2 italic tracking-widest">{errors.estimatedTimeMinutes.message}</p>}
                  </div>
                </div>

                <div className="p-10 bg-muted/20 border border-border/50 rounded-[40px] space-y-10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                       <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <MapPin className="w-3 h-3" />
                       </div>
                       Intermediate Waypoints
                    </label>
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: '#f59e0b', color: '#fff' }} 
                      whileTap={{ scale: 0.95 }} 
                      type="button" 
                      onClick={() => append({ value: "" })} 
                      className="h-12 px-6 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all duration-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-slate-900/10 italic group"
                    >
                      <Plus className="h-4 w-4 text-amber-500 group-hover:text-white transition-colors" /> INJECT WAYPOINT
                    </motion.button>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <AnimatePresence mode="popLayout">
                      {fields.map((field, index) => (
                        <motion.div 
                          key={field.id} 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, scale: 0.95 }} 
                          transition={{ duration: 0.5 }} 
                          className="flex gap-6 items-center group"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-500 flex items-center justify-center font-black text-[10px] shrink-0 italic border border-slate-800 shadow-lg">#{index + 1}</div>
                          <Input placeholder={`WAYPOINT COORDINATE ${index + 1}`} {...register(`stops.${index}.value`)} className={inputCls} />
                          <motion.button 
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} 
                            whileTap={{ scale: 0.9 }} 
                            type="button" 
                            onClick={() => remove(index)} 
                            className="shrink-0 w-16 h-16 flex items-center justify-center text-destructive/30 hover:text-destructive rounded-2xl transition-all duration-500"
                          >
                            <Trash2 className="h-6 w-6" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {fields.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 border-2 border-dashed border-border/40 rounded-[32px] flex flex-col items-center gap-4 bg-muted/5 relative z-10">
                       <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center animate-pulse">
                          <Target className="w-8 h-8 text-muted-foreground/20" />
                       </div>
                       <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] italic">DIRECT PATH MODE ACTIVE</p>
                    </motion.div>
                  )}
                  
                  {/* Decorative Detail */}
                  <div className="absolute bottom-0 right-0 p-8 opacity-[0.02] select-none pointer-events-none">
                     <RouteIcon className="w-32 h-32" />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: '#f59e0b', color: '#fff' }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={handleSubmit(onSubmit)} 
                  disabled={isSubmitting} 
                  className="w-full h-20 bg-slate-900 border border-slate-800 disabled:opacity-50 text-white font-black rounded-[24px] transition-all duration-700 flex items-center justify-center gap-6 disabled:cursor-not-allowed uppercase tracking-[0.3em] text-xs shadow-2xl shadow-slate-900/30 italic group/btn"
                >
                  {isSubmitting ? <Activity className="w-6 h-6 animate-spin text-amber-500" /> : <Zap className="w-6 h-6 text-amber-500 group-hover/btn:text-white transition-colors" />}
                  {isSubmitting ? "GENERATING VECTOR..." : "COMMIT ROUTE VECTOR"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5 sticky top-12">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.04] p-10 lg:p-16 relative overflow-hidden">
               <div className="flex items-center gap-6 mb-12 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-xl">
                    <Globe className="w-6 h-6" />
                 </div>
                 <h2 className="text-3xl font-black text-foreground font-heading tracking-tighter uppercase italic">Vector Analysis</h2>
              </div>

              <div className="mb-12 p-12 bg-muted/20 rounded-[48px] border border-border/50 relative overflow-hidden backdrop-blur-xl z-10">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="flex items-center gap-10 relative">
                  <div className="flex flex-col items-center shrink-0">
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity }} className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)] border-4 border-white" />
                    <div className="w-1.5 h-40 bg-gradient-to-b from-emerald-500 via-amber-500 to-blue-600 my-3 rounded-full opacity-30 shadow-inner" />
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} className="w-5 h-5 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] border-4 border-white" />
                  </div>
                  
                  <div className="flex flex-col justify-between h-[218px] flex-1">
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-2 italic opacity-60">ORIGIN POINT</p>
                      <p className="text-4xl font-black text-foreground font-heading uppercase italic tracking-tighter truncate leading-none group-hover:text-amber-500 transition-colors">{values.sourceCity || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2 italic opacity-60">TERMINAL POINT</p>
                      <p className="text-4xl font-black text-foreground font-heading uppercase italic tracking-tighter truncate leading-none group-hover:text-amber-500 transition-colors">{values.destinationCity || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 italic">Kinematic Specs</p>
                   <div className="h-[1px] flex-1 bg-border/30 mx-6" />
                   <Activity className="w-4 h-4 text-muted-foreground opacity-20" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'MAGNITUDE', value: values.distanceKm ? `${values.distanceKm} KM` : "—", icon: Map, color: 'text-amber-500' },
                    { label: 'INTERVAL', value: values.estimatedTimeMinutes ? `${Math.floor(values.estimatedTimeMinutes / 60)}H ${values.estimatedTimeMinutes % 60}M` : "—", icon: Clock, color: 'text-blue-500' }
                  ].map((stat, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (idx * 0.1) }} className="p-8 bg-muted/10 border border-border/40 rounded-[32px] group hover:bg-muted/30 transition-all duration-500">
                      <div className={`w-12 h-12 rounded-2xl bg-slate-900 ${stat.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                         <stat.icon className="h-6 w-6" />
                      </div>
                      <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em] mb-2 opacity-40 italic leading-none">{stat.label}</p>
                      <p className="text-2xl font-black text-foreground font-heading tracking-tighter italic uppercase truncate leading-none">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-10 border-t border-border/50">
                   <div className="flex items-center justify-between mb-8">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 italic">Stopover Indices</p>
                      <div className="px-6 py-2 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-2xl shadow-amber-500/40 italic uppercase tracking-widest">{values.stops?.length} HUB NODES</div>
                   </div>
                   
                   <div className="flex flex-wrap gap-4">
                     <AnimatePresence>
                        {values.stops?.map((s, i) => (
                          <motion.span 
                            key={i} 
                            initial={{ scale: 0, opacity: 0, rotate: -10 }} 
                            animate={{ scale: 1, opacity: 1, rotate: 0 }} 
                            exit={{ scale: 0, opacity: 0 }} 
                            className="h-12 inline-flex items-center gap-4 bg-muted/20 text-foreground text-[10px] px-6 rounded-2xl border border-border/50 font-black uppercase tracking-tight italic hover:border-amber-500/30 transition-colors shadow-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                            {s.value || `NODE ${i + 1}`}
                          </motion.span>
                        ))}
                     </AnimatePresence>
                   </div>
                </div>
              </div>
              
              {/* Technical Backdrop */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
                 <p className="text-[160px] font-black font-heading leading-none">MAP</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}