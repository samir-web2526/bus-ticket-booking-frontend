/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, ArrowRight, Clock, Route, Zap } from "lucide-react";
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

  const inputCls = "bg-white border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-gray-400 focus:ring-gray-200 rounded-xl h-11";

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden p-6 lg:p-12">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">Create Route</h1>
          <p className="text-gray-400 text-lg">Add a new route with stops and timing</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Route Details</h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Source City</label>
                    <Input placeholder="e.g., Dhaka" {...register("sourceCity")} className={inputCls} />
                    {errors.sourceCity && <p className="text-xs text-red-500 mt-2">{errors.sourceCity.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Destination City</label>
                    <Input placeholder="e.g., Chittagong" {...register("destinationCity")} className={inputCls} />
                    {errors.destinationCity && <p className="text-xs text-red-500 mt-2">{errors.destinationCity.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Distance (km)</label>
                    <Input type="number" placeholder="0" {...register("distanceKm")} className={inputCls} />
                    {errors.distanceKm && <p className="text-xs text-red-500 mt-2">{errors.distanceKm.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Est. Time (minutes)</label>
                    <Input type="number" placeholder="0" {...register("estimatedTimeMinutes")} className={inputCls} />
                    {errors.estimatedTimeMinutes && <p className="text-xs text-red-500 mt-2">{errors.estimatedTimeMinutes.message}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Stops</label>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => append({ value: "" })} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-bold">
                      <Plus className="h-3.5 w-3.5" /> Add Stop
                    </motion.button>
                  </div>

                  {fields.map((field, index) => (
                    <motion.div key={field.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.05 }} className="flex gap-2 items-center">
                      <span className="text-xs text-gray-400 w-5 shrink-0 font-bold">{index + 1}.</span>
                      <Input placeholder={`Stop ${index + 1}`} {...register(`stops.${index}.value`)} className={inputCls} />
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => remove(index)} className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ))}

                  {fields.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg">No stops added</p>
                  )}
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider">
                  {isSubmitting ? <><Zap className="w-4 h-4 animate-spin" /> Creating...</> : <><Zap className="w-4 h-4" /> Create Route</>}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-8">Route Preview</h2>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex flex-col items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="w-0.5 h-20 bg-gradient-to-b from-green-500 to-red-400" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="w-3 h-3 rounded-full bg-red-400" />
                </div>
                <div className="flex flex-col justify-between gap-16 flex-1">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">From</p>
                    <p className="text-2xl font-black text-gray-900">{values.sourceCity || <span className="text-gray-300">Source City</span>}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">To</p>
                    <p className="text-2xl font-black text-gray-900">{values.destinationCity || <span className="text-gray-300">Destination City</span>}</p>
                  </div>
                </div>
              </div>

              {(values.stops ?? []).length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 pb-6 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-widest">Via</p>
                  <div className="flex flex-wrap gap-2">
                    {values.stops?.map((s, i) => (
                      <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full border border-gray-200 font-semibold">
                        <MapPin className="h-3 w-3" />{s.value || `Stop ${i + 1}`}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Route className="h-4 w-4 text-gray-500 mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Distance</p>
                  <p className="text-xl font-black text-gray-900">{values.distanceKm ? `${values.distanceKm} km` : "—"}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Clock className="h-4 w-4 text-gray-500 mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Est. Time</p>
                  <p className="text-xl font-black text-gray-900">{values.estimatedTimeMinutes ? `${Math.floor(values.estimatedTimeMinutes / 60)}h ${values.estimatedTimeMinutes % 60}m` : "—"}</p>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 flex items-center gap-2 text-sm text-gray-400 font-semibold">
                <ArrowRight className="h-4 w-4 text-gray-500" />
                <span>{values.stops?.length} intermediate stop{values.stops?.length !== 1 ? "s" : ""}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}