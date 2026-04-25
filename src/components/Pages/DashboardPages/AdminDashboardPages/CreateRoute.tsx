
// "use client";

// import { useFieldArray, useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion } from "framer-motion";

// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { MapPin, Plus, Trash2, ArrowRight, Clock, Route, Zap } from "lucide-react";
// import { createRoute } from "@/src/services/routes.service";

// // ─── Zod Schema ──────────────────────────────────────────────────────────────

// const routeSchema = z.object({
//   sourceCity: z.string().min(1, "Source city is required"),
//   destinationCity: z.string().min(1, "Destination city is required"),
//   distanceKm: z.coerce.number().min(1, "Distance must be at least 1 km"),
//   estimatedTimeMinutes: z.coerce.number().min(1, "Time must be at least 1 min"),
//   stops: z.array(z.object({ value: z.string().min(1, "Stop name required") })),
// }).refine(
//   (data) => data.sourceCity !== data.destinationCity,
//   {
//     message: "Source and destination cannot be the same",
//     path: ["destinationCity"],
//   }
// );

// type RouteFormValues = z.infer<typeof routeSchema>;

// // ─── Component ───────────────────────────────────────────────────────────────

// export default function CreateRoute() {
//   const form = useForm<RouteFormValues>({
//     resolver: zodResolver(routeSchema),
//     defaultValues: {
//       sourceCity: "",
//       destinationCity: "",
//       distanceKm: 0,
//       estimatedTimeMinutes: 0,
//       stops: [],
//     },
//   });

//   const { watch, handleSubmit, register, formState: { errors, isSubmitting }, control } = form;
//   const values = watch();

//   const { fields, append, remove } = useFieldArray({ control, name: "stops" });

//   // ─── Submit ──────────────────────────────────────────────────────────────

//   const onSubmit = async (data: RouteFormValues) => {
//     const payload = {
//       ...data,
//       stops: data.stops.map((s) => s.value),
//     };

//     const res = await createRoute(payload);

//     if (res.error) {
//       toast.error(res.error);
//     } else {
//       toast.success("Route created successfully!");
//       form.reset();
//     }
//   };

//   // ─── UI ──────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
//       {/* Background grid */}
//       <div
//         className="absolute inset-0 opacity-5"
//         style={{
//           backgroundImage:
//             'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
//           backgroundSize: '60px 60px',
//         }}
//       />

//       {/* Gradient accent */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-12"
//         >
//           <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">Create Route</h1>
//           <p className="text-slate-400 text-lg">Add a new route with stops and timing</p>
//         </motion.div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* FORM */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
//               <h2 className="text-2xl font-black text-white mb-6">Route Details</h2>

//               <div className="space-y-5">
//                 {/* Cities */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.15 }}
//                   >
//                     <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
//                       Source City
//                     </label>
//                     <Input
//                       placeholder="e.g., Dhaka"
//                       {...register("sourceCity")}
//                       className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
//                     />
//                     {errors.sourceCity && (
//                       <p className="text-xs text-red-400 mt-2">{errors.sourceCity.message}</p>
//                     )}
//                   </motion.div>

//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
//                       Destination City
//                     </label>
//                     <Input
//                       placeholder="e.g., Chittagong"
//                       {...register("destinationCity")}
//                       className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
//                     />
//                     {errors.destinationCity && (
//                       <p className="text-xs text-red-400 mt-2">{errors.destinationCity.message}</p>
//                     )}
//                   </motion.div>
//                 </div>

//                 {/* Distance & Time */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.25 }}
//                   >
//                     <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
//                       Distance (km)
//                     </label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       {...register("distanceKm")}
//                       className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
//                     />
//                     {errors.distanceKm && (
//                       <p className="text-xs text-red-400 mt-2">{errors.distanceKm.message}</p>
//                     )}
//                   </motion.div>

//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 }}
//                   >
//                     <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
//                       Est. Time (minutes)
//                     </label>
//                     <Input
//                       type="number"
//                       placeholder="0"
//                       {...register("estimatedTimeMinutes")}
//                       className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
//                     />
//                     {errors.estimatedTimeMinutes && (
//                       <p className="text-xs text-red-400 mt-2">{errors.estimatedTimeMinutes.message}</p>
//                     )}
//                   </motion.div>
//                 </div>

//                 {/* Stops */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.35 }}
//                   className="space-y-3"
//                 >
//                   <div className="flex items-center justify-between">
//                     <label className="text-sm font-bold text-amber-400 uppercase tracking-widest">
//                       Stops
//                     </label>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       type="button"
//                       onClick={() => append({ value: "" })}
//                       className="flex items-center gap-1 px-3 py-1.5 bg-amber-400/20 text-amber-400 rounded-lg hover:bg-amber-400/30 transition-colors text-sm font-bold"
//                     >
//                       <Plus className="h-3.5 w-3.5" />
//                       Add Stop
//                     </motion.button>
//                   </div>

//                   {fields.map((field, index) => (
//                     <motion.div
//                       key={field.id}
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.4 + index * 0.05 }}
//                       className="flex gap-2 items-center"
//                     >
//                       <span className="text-xs text-slate-400 w-5 shrink-0 font-bold">{index + 1}.</span>
//                       <Input
//                         placeholder={`Stop ${index + 1}`}
//                         {...register(`stops.${index}.value`)}
//                         className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl"
//                       />
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         type="button"
//                         onClick={() => remove(index)}
//                         className="shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </motion.button>
//                     </motion.div>
//                   ))}

//                   {fields.length === 0 && (
//                     <p className="text-xs text-slate-500 text-center py-3 border border-dashed border-white/20 rounded-lg">
//                       No stops added
//                     </p>
//                   )}
//                 </motion.div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleSubmit(onSubmit)}
//                   disabled={isSubmitting}
//                   className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:from-amber-400/50 disabled:to-amber-500/50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Zap className="w-4 h-4 animate-spin" />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <Zap className="w-4 h-4" />
//                       Create Route
//                     </>
//                   )}
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>

//           {/* ROUTE PREVIEW */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
//               <h2 className="text-2xl font-black text-white mb-8">Route Preview</h2>

//               {/* Source → Destination */}
//               <div className="flex items-center gap-4 mb-8">
//                 <div className="flex flex-col items-center gap-2">
//                   <motion.div
//                     animate={{ scale: [1, 1.2, 1] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                     className="w-3 h-3 rounded-full bg-green-400"
//                   />
//                   <div className="w-0.5 h-20 bg-gradient-to-b from-green-400 to-red-400" />
//                   <motion.div
//                     animate={{ scale: [1, 1.2, 1] }}
//                     transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
//                     className="w-3 h-3 rounded-full bg-red-400"
//                   />
//                 </div>
//                 <div className="flex flex-col justify-between gap-16 flex-1">
//                   <div>
//                     <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">From</p>
//                     <p className="text-2xl font-black text-white">
//                       {values.sourceCity || <span className="text-slate-500">Source City</span>}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">To</p>
//                     <p className="text-2xl font-black text-white">
//                       {values.destinationCity || <span className="text-slate-500">Destination City</span>}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Stops list */}
//               {values.stops.length > 0 && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="mb-6 pb-6 border-b border-white/10"
//                 >
//                   <p className="text-xs text-amber-400 mb-3 font-bold uppercase tracking-widest">Via</p>
//                   <div className="flex flex-wrap gap-2">
//                     {values.stops.map((s, i) => (
//                       <motion.span
//                         key={i}
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full border border-amber-500/30 font-semibold"
//                       >
//                         <MapPin className="h-3 w-3" />
//                         {s.value || `Stop ${i + 1}`}
//                       </motion.span>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-4">
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-br from-amber-500/20 to-amber-400/5 rounded-xl p-4 border border-amber-500/30"
//                 >
//                   <Route className="h-4 w-4 text-amber-400 mb-2" />
//                   <p className="text-xs text-slate-400 mb-1">Distance</p>
//                   <p className="text-xl font-black text-amber-400">
//                     {values.distanceKm ? `${values.distanceKm} km` : "—"}
//                   </p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.35 }}
//                   className="bg-gradient-to-br from-amber-500/20 to-amber-400/5 rounded-xl p-4 border border-amber-500/30"
//                 >
//                   <Clock className="h-4 w-4 text-amber-400 mb-2" />
//                   <p className="text-xs text-slate-400 mb-1">Est. Time</p>
//                   <p className="text-xl font-black text-amber-400">
//                     {values.estimatedTimeMinutes
//                       ? `${Math.floor(values.estimatedTimeMinutes / 60)}h ${values.estimatedTimeMinutes % 60}m`
//                       : "—"}
//                   </p>
//                 </motion.div>
//               </div>

//               {/* Total stops badge */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="mt-6 flex items-center gap-2 text-sm text-slate-400 font-semibold"
//               >
//                 <ArrowRight className="h-4 w-4 text-amber-400" />
//                 <span>
//                   {values.stops.length} intermediate stop{values.stops.length !== 1 ? "s" : ""}
//                 </span>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Trash2,
  ArrowRight,
  Clock,
  Route,
  Zap,
} from "lucide-react";
import { createRoute } from "@/src/services/routes.service";

// ─── ZOD SCHEMA (operator style) ─────────────────────────────

const routeSchema = z.object({
  sourceCity: z.string().min(1, "Source city is required"),
  destinationCity: z.string().min(1, "Destination city is required"),

  distanceKm: z.string().min(1, "Distance is required"),
  estimatedTimeMinutes: z.string().min(1, "Time is required"),

  stops: z.array(
    z.object({
      value: z.string().min(1, "Stop name required"),
    })
  ),
}).refine((data) => data.sourceCity !== data.destinationCity, {
  message: "Source and destination cannot be same",
  path: ["destinationCity"],
});

type RouteFormValues = z.infer<typeof routeSchema>;

// ─── COMPONENT ─────────────────────────────

export default function CreateRoute() {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      sourceCity: "",
      destinationCity: "",
      distanceKm: "",
      estimatedTimeMinutes: "",
      stops: [],
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = form;

  const values = useWatch({
      control,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stops",
  });

  // ─── SUBMIT ─────────────────────────────

  const onSubmit = async (data: RouteFormValues) => {
    const payload = {
      sourceCity: data.sourceCity,
      destinationCity: data.destinationCity,
      distanceKm: Number(data.distanceKm),
      estimatedTimeMinutes: Number(data.estimatedTimeMinutes),
      stops: data.stops.map((s) => s.value),
    };

    const res = await createRoute(payload);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Route created successfully!");
      form.reset();
    }
  };

  // ─── UI ─────────────────────────────

  return (
    <div className="min-h-screen bg-[#050d1a] p-6 lg:p-12 text-white">

      <h1 className="text-4xl font-black mb-8">Create Route</h1>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* FORM */}
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">

          {/* Source */}
          <label>Source City</label>
          <Input {...register("sourceCity")} />
          <p className="text-red-400 text-xs">{errors.sourceCity?.message}</p>

          {/* Destination */}
          <label>Destination City</label>
          <Input {...register("destinationCity")} />
          <p className="text-red-400 text-xs">{errors.destinationCity?.message}</p>

          {/* Distance */}
          <label>Distance Km</label>
          <Input {...register("distanceKm")} />
          <p className="text-red-400 text-xs">{errors.distanceKm?.message}</p>

          {/* Time */}
          <label>Estimated Time</label>
          <Input {...register("estimatedTimeMinutes")} />
          <p className="text-red-400 text-xs">
            {errors.estimatedTimeMinutes?.message}
          </p>

          {/* Stops */}
          <div className="mt-4">
            <button type="button" onClick={() => append({ value: "" })}>
              + Add Stop
            </button>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mt-2">
                <Input {...register(`stops.${index}.value`)} />
                <button type="button" onClick={() => remove(index)}>
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-6 w-full bg-amber-500 text-black font-bold py-2 rounded-xl"
          >
            {isSubmitting ? "Creating..." : "Create Route"}
          </button>
        </div>

        {/* PREVIEW */}
        <div>
          <h2 className="text-xl font-bold">Preview</h2>

          <p>From: {values.sourceCity}</p>
          <p>To: {values.destinationCity}</p>
        </div>

      </div>
    </div>
  );
}