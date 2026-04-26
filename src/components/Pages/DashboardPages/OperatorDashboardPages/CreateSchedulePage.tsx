/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Bus,
  Route,
  Clock,
  CalendarClock,
  Zap,
  ArrowRight,
  MapPin,
} from "lucide-react";

import { getRoutesForDropdown } from "@/src/services/routes.service";
import { createSchedule } from "@/src/services/schedule.service";
import { getOperatorBuses } from "@/src/services/buses.service";

// ─── Schema ───────────────────────────────────────────────────────────────────
const scheduleSchema = z
  .object({
    busId: z.string().min(1, "Bus is required"),
    routeId: z.string().min(1, "Route is required"),
    departure: z.string().min(1, "Departure time is required"),
    arrival: z.string().min(1, "Arrival time is required"),
    status: z.enum(["scheduled", "cancelled", "completed"]).optional(),
  })
  .refine(
    (data) => {
      if (!data.departure) return true;
      const now = new Date();
      const departure = new Date(data.departure);
      return departure > now;
    },
    {
      message: "Departure cannot be in the past",
      path: ["departure"],
    }
  )
  .refine(
    (data) => {
      if (!data.departure || !data.arrival) return true;
      return new Date(data.arrival) > new Date(data.departure);
    },
    {
      message: "Arrival must be after departure",
      path: ["arrival"],
    }
  );

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface BusOption {
  id: string;
  name: string;
  number: string;
  type: string;
}

interface RouteOption {
  id: string;
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
}



// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateSchedule() {
  const [buses, setBuses] = useState<BusOption[]>([]);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);

    const minDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }, []);


  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema) as any,
    defaultValues: {
      busId: "",
      routeId: "",
      departure: "",
      arrival: "",
      status: "scheduled",
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
  defaultValue: {
    busId: "",
    routeId: "",
    departure: "",
    arrival: "",
    status: "scheduled",
  },
});

  // ─── Selected previews ──────────────────────────────────────────────────────

  const selectedBus = buses.find((b) => b.id === values.busId);
  const selectedRoute = routes.find((r) => r.id === values.routeId);

  // ─── Fetch buses & routes ───────────────────────────────────────────────────

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    const busRes = await getOperatorBuses();
    const routeRes = await getRoutesForDropdown();

    if (busRes.data) {
      const raw = Array.isArray(busRes.data)
        ? busRes.data
        : busRes.data?.data ?? [];
      setBuses(raw);
    }

    if (routeRes.data) {
      setRoutes(routeRes.data);
    }

    setLoading(false);
  };

  fetchData();
}, []);

  // ─── Duration helper ────────────────────────────────────────────────────────

  const getDuration = () => {
    if (!values.departure || !values.arrival) return null;
    const diff =
      new Date(values.arrival).getTime() -
      new Date(values.departure).getTime();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatDateTime = (val: string) => {
    if (!val) return null;
    return new Date(val).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit = async (data: ScheduleFormValues) => {
    // Token comes from cookie on server action — pass empty string,
    // createSchedule server action reads cookie itself if you refactor it
    // OR pass token from session if using next-auth
    const res = await createSchedule(
      {
        busId: data.busId,
        routeId: data.routeId,
        departure: new Date(data.departure).toISOString(),
        arrival: new Date(data.arrival).toISOString(),
        status: data.status,
      },
    );

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Schedule created successfully!");
      form.reset();
    }
  };

  // ─── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
            Create Schedule
          </h1>
          <p className="text-slate-400 text-lg">
            Assign a bus to a route with departure & arrival times
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ── FORM ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-6">
                Schedule Details
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Bus */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                      Bus
                    </label>
                    <select
                      {...register("busId")}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-xl h-11 px-3 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20 transition-colors"
                    >
                      <option value="" className="bg-[#050d1a]">
                        Select a bus...
                      </option>
                      {buses.map((bus) => (
                        <option
                          key={bus.id}
                          value={bus.id}
                          className="bg-[#050d1a]"
                        >
                          {bus.name} — {bus.number} ({bus.type})
                        </option>
                      ))}
                    </select>
                    {errors.busId && (
                      <p className="text-xs text-red-400 mt-2">
                        {errors.busId.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Route */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                      Route
                    </label>
                    <select
                      {...register("routeId")}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-xl h-11 px-3 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20 transition-colors"
                    >
                      <option value="" className="bg-[#050d1a]">
                        Select a route...
                      </option>
                      {routes.map((route) => (
                        <option
                          key={route.id}
                          value={route.id}
                          className="bg-[#050d1a]"
                        >
                          {route.sourceCity} → {route.destinationCity} (
                          {route.distanceKm} km)
                        </option>
                      ))}
                    </select>
                    {errors.routeId && (
                      <p className="text-xs text-red-400 mt-2">
                        {errors.routeId.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Departure & Arrival */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                        Departure
                      </label>
                      <Input
                        type="datetime-local"
                        {...register("departure")}
                        min={values.arrival || minDateTime}
                        className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                      />
                      {errors.departure && (
                        <p className="text-xs text-red-400 mt-2">
                          {errors.departure.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                        Arrival
                      </label>
                      <Input
                        type="datetime-local"
                        {...register("arrival")}
                        min={values.departure || minDateTime}
                        className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                      />
                      {errors.arrival && (
                        <p className="text-xs text-red-400 mt-2">
                          {errors.arrival.message}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  {/* Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-xl h-11 px-3 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20 transition-colors"
                    >
                      <option value="scheduled" className="bg-[#050d1a]">
                        Scheduled
                      </option>
                      <option value="cancelled" className="bg-[#050d1a]">
                        Cancelled
                      </option>
                      <option value="completed" className="bg-[#050d1a]">
                        Completed
                      </option>
                    </select>
                  </motion.div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:from-amber-400/50 disabled:to-amber-500/50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Create Schedule
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── PREVIEW ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-8">
                Schedule Preview
              </h2>

              {/* Route preview */}
              <div className="flex items-start gap-4 mb-8">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-green-400"
                  />
                  <div className="w-0.5 h-16 bg-gradient-to-b from-green-400 to-red-400" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="w-3 h-3 rounded-full bg-red-400"
                  />
                </div>

                <div className="flex flex-col justify-between gap-10 flex-1">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                      From
                    </p>
                    <p
                      className={`text-2xl font-black ${selectedRoute ? "text-white" : "text-slate-600"}`}
                    >
                      {selectedRoute?.sourceCity ?? "Source City"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                      To
                    </p>
                    <p
                      className={`text-2xl font-black ${selectedRoute ? "text-white" : "text-slate-600"}`}
                    >
                      {selectedRoute?.destinationCity ?? "Destination City"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-400/5 rounded-xl p-4 border border-amber-500/30">
                  <Bus className="h-4 w-4 text-amber-400 mb-2" />
                  <p className="text-xs text-slate-400 mb-1">Bus</p>
                  <p className="text-sm font-black text-amber-400 truncate">
                    {selectedBus
                      ? `${selectedBus.name} (${selectedBus.type})`
                      : "—"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-amber-400/5 rounded-xl p-4 border border-amber-500/30">
                  <Route className="h-4 w-4 text-amber-400 mb-2" />
                  <p className="text-xs text-slate-400 mb-1">Distance</p>
                  <p className="text-xl font-black text-amber-400">
                    {selectedRoute ? `${selectedRoute.distanceKm} km` : "—"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-amber-400/5 rounded-xl p-4 border border-amber-500/30">
                  <CalendarClock className="h-4 w-4 text-amber-400 mb-2" />
                  <p className="text-xs text-slate-400 mb-1">Departure</p>
                  <p className="text-xs font-black text-amber-400">
                    {formatDateTime(values.departure) ?? "—"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-amber-400/5 rounded-xl p-4 border border-amber-500/30">
                  <Clock className="h-4 w-4 text-amber-400 mb-2" />
                  <p className="text-xs text-slate-400 mb-1">Duration</p>
                  <p className="text-xl font-black text-amber-400">
                    {getDuration() ?? "—"}
                  </p>
                </div>
              </div>

              {/* Stops preview */}
              {selectedRoute?.estimatedTimeMinutes && (
                <div className="flex items-center gap-2 text-sm text-slate-400 font-semibold">
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                  <span>
                    Est.{" "}
                    {Math.floor(selectedRoute.estimatedTimeMinutes / 60)}h{" "}
                    {selectedRoute.estimatedTimeMinutes % 60}m travel time
                  </span>
                </div>
              )}

              {/* Status badge */}
              {values.status && (
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${
                      values.status === "scheduled"
                        ? "bg-amber-400/15 border-amber-400/30 text-amber-400"
                        : values.status === "cancelled"
                          ? "bg-red-400/15 border-red-400/30 text-red-400"
                          : "bg-green-400/15 border-green-400/30 text-green-400"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {values.status.charAt(0).toUpperCase() +
                      values.status.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}