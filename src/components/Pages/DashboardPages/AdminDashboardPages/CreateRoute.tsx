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

  const inputCls = "bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:ring-amber-500/20 rounded-2xl h-14 transition-all duration-500 font-normal text-base";
  const labelCls = "text-sm font-semibold text-amber-600 block mb-3 ml-1";

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Route Management</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Create <span className="text-amber-600">Route</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-7">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.04] p-10 lg:p-16 relative overflow-hidden">
               <div className="flex items-center gap-6 mb-12 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
                    <Navigation className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold text-foreground tracking-tight">Route Details</h2>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className={labelCls}>Source City</label>
                    <Input placeholder="Enter source city" {...register("sourceCity")} className={inputCls} />
                    {errors.sourceCity && <p className="text-destructive text-sm font-medium mt-2 ml-1">{errors.sourceCity.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Destination City</label>
                    <Input placeholder="Enter destination city" {...register("destinationCity")} className={inputCls} />
                    {errors.destinationCity && <p className="text-destructive text-sm font-medium mt-2 ml-1">{errors.destinationCity.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className={labelCls}>Distance (km)</label>
                    <Input type="number" placeholder="0" {...register("distanceKm")} className={inputCls} />
                    {errors.distanceKm && <p className="text-destructive text-sm font-medium mt-2 ml-1">{errors.distanceKm.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Estimated Time (mins)</label>
                    <Input type="number" placeholder="0" {...register("estimatedTimeMinutes")} className={inputCls} />
                    {errors.estimatedTimeMinutes && <p className="text-destructive text-sm font-medium mt-2 ml-1">{errors.estimatedTimeMinutes.message}</p>}
                  </div>
                </div>

                <div className="p-10 bg-muted/20 border border-border/50 rounded-[40px] space-y-10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <label className="text-sm font-semibold text-amber-500 flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <MapPin className="w-3 h-3" />
                       </div>
                       Stops
                    </label>
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: '#f59e0b', color: '#fff' }} 
                      whileTap={{ scale: 0.95 }} 
                      type="button" 
                      onClick={() => append({ value: "" })} 
                      className="h-12 px-6 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all duration-500 text-sm font-semibold flex items-center gap-2 shadow-xl shadow-slate-900/10 group"
                    >
                      <Plus className="h-4 w-4 text-amber-500 group-hover:text-white transition-colors" /> Add Stop
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
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-500 flex items-center justify-center font-semibold text-sm shrink-0 border border-slate-800 shadow-lg">{index + 1}</div>
                          <Input placeholder={`Stop ${index + 1}`} {...register(`stops.${index}.value`)} className={inputCls} />
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
                       <p className="text-sm font-medium text-muted-foreground/50">No stops added yet</p>
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
                  className="w-full h-16 bg-slate-900 border border-slate-800 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-700 flex items-center justify-center gap-4 disabled:cursor-not-allowed text-base shadow-2xl shadow-slate-900/30 group/btn"
                >
                  {isSubmitting ? <Activity className="w-6 h-6 animate-spin text-amber-500" /> : <Zap className="w-6 h-6 text-amber-500 group-hover/btn:text-white transition-colors" />}
                  {isSubmitting ? "Creating route..." : "Create route"}
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
                 <h2 className="text-2xl font-bold text-foreground tracking-tight">Route Preview</h2>
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
                      <p className="text-xs font-medium text-emerald-600 mb-2 opacity-70">From</p>
                      <p className="text-3xl font-bold text-foreground tracking-tight truncate leading-none group-hover:text-amber-500 transition-colors">{values.sourceCity || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-600 mb-2 opacity-70">To</p>
                      <p className="text-3xl font-bold text-foreground tracking-tight truncate leading-none group-hover:text-amber-500 transition-colors">{values.destinationCity || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-sm font-medium text-muted-foreground opacity-50">Route Info</p>
                   <div className="h-[1px] flex-1 bg-border/30 mx-6" />
                   <Activity className="w-4 h-4 text-muted-foreground opacity-20" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Distance', value: values.distanceKm ? `${values.distanceKm} km` : "—", icon: Map, color: 'text-amber-500' },
                    { label: 'Duration', value: values.estimatedTimeMinutes ? `${Math.floor(values.estimatedTimeMinutes / 60)}h ${values.estimatedTimeMinutes % 60}m` : "—", icon: Clock, color: 'text-blue-500' }
                  ].map((stat, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (idx * 0.1) }} className="p-8 bg-muted/10 border border-border/40 rounded-[32px] group hover:bg-muted/30 transition-all duration-500">
                      <div className={`w-12 h-12 rounded-2xl bg-slate-900 ${stat.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                         <stat.icon className="h-6 w-6" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium mb-2 opacity-50 leading-none">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground tracking-tight truncate leading-none">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-10 border-t border-border/50">
                   <div className="flex items-center justify-between mb-8">
                      <p className="text-sm font-medium text-muted-foreground opacity-50">Stops</p>
                      <div className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-full shadow-xl shadow-amber-500/40">{values.stops?.length} Stops</div>
                   </div>
                   
                   <div className="flex flex-wrap gap-4">
                     <AnimatePresence>
                        {values.stops?.map((s, i) => (
                          <motion.span 
                            key={i} 
                            initial={{ scale: 0, opacity: 0, rotate: -10 }} 
                            animate={{ scale: 1, opacity: 1, rotate: 0 }} 
                            exit={{ scale: 0, opacity: 0 }} 
                            className="h-10 inline-flex items-center gap-3 bg-muted/20 text-foreground text-sm px-4 rounded-xl border border-border/50 font-medium hover:border-amber-500/30 transition-colors shadow-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                            {s.value || `Stop ${i + 1}`}
                          </motion.span>
                        ))}
                     </AnimatePresence>
                   </div>
                </div>
              </div>
              
              {/* Technical Backdrop */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
                 <p className="text-[160px] font-bold leading-none">ROUTE</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}