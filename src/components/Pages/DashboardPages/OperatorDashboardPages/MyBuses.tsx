"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bus,
  SlidersHorizontal,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  BusFront,
  Users,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getOperatorBuses } from "@/src/services/buses.service";

interface BusItem {
  id: string;
  name: string;
  number: string;
  type: "AC" | "NON_AC" | "SLEEPER" | "DOUBLE_DECKER";
  totalSeats: number;
  pricePerSeat: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

type FilterType = "" | "AC" | "NON_AC" | "SLEEPER" | "DOUBLE_DECKER";

const getBusLabel = (type: string): string =>
  ({ AC: "AC", NON_AC: "Non-AC", SLEEPER: "Sleeper", DOUBLE_DECKER: "Double Decker" }[type] ?? type);

const getBusTag = (type: string): string =>
  ({ AC: "Premium", NON_AC: "Budget", SLEEPER: "Luxury", DOUBLE_DECKER: "Special" }[type] ?? "Standard");

const tagColors: Record<string, string> = {
  Premium: "bg-rose-100 text-rose-700 border-rose-200",
  Budget:  "bg-emerald-100 text-emerald-700 border-emerald-200",
  Luxury:  "bg-purple-100 text-purple-700 border-purple-200",
  Special: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

const getBusImage = (type: string): string =>
  ({
    AC:            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
    NON_AC:        "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80",
    SLEEPER:       "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80",
    DOUBLE_DECKER: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  }[type] ?? "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80");

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "" },
  { label: "AC", value: "AC" },
  { label: "Non-AC", value: "NON_AC" },
  { label: "Sleeper", value: "SLEEPER" },
  { label: "Double Decker", value: "DOUBLE_DECKER" },
];

function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-5 flex items-center gap-4 border ${
      accent
        ? "bg-gray-900 border-gray-900 text-white"
        : "bg-gray-50 border-gray-100 text-gray-900"
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
        accent ? "bg-white/10 text-white" : "bg-gray-200 text-gray-500"
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className={`text-xs uppercase tracking-widest font-semibold mb-1 ${
          accent ? "text-gray-300" : "text-gray-400"
        }`}>{label}</p>
        <p className="font-black text-2xl">{value}</p>
      </div>
    </div>
  );
}

export default function MyBuses() {
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [buses, setBuses] = useState<BusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busType, setBusType] = useState<FilterType>("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const result = await getOperatorBuses();

      if ("error" in result) {
        setError(result.error);
        setBuses([]);
      } else {
        const raw = result.data;
        const arr = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.buses)
          ? raw.buses
          : [];
        setBuses(arr);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = busType === "" ? buses : buses.filter((b) => b.type === busType);
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.isActive).length;
  const inactiveBuses = buses.filter((b) => !b.isActive).length;

  return (
    <section ref={ref} className="bg-white min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-3">
              — Fleet Management
            </p>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
              My <span className="text-gray-500">Buses</span>
            </h1>
          </div>
        </motion.div>

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <StatCard icon={BusFront} label="Total Buses" value={totalBuses} accent />
            <StatCard icon={Activity} label="Active" value={activeBuses} />
            <StatCard icon={AlertCircle} label="Inactive" value={inactiveBuses} />
          </motion.div>
        )}

        {!loading && !error && buses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center gap-2 flex-wrap mb-8"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => { setBusType(f.value); setShowAll(false); }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  busType === f.value
                    ? "bg-gray-900 text-white border-gray-900"
                    : "text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading your fleet...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-500 text-lg mb-2">Failed to load buses</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Bus className="h-16 w-16 text-gray-200" />
            <p className="text-gray-400 text-lg">
              {buses.length === 0
                ? "You haven't added any buses yet."
                : "No buses found for this category."}
            </p>
          </div>
        )}

        {!loading && !error && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((bus, i) => {
              const tag = getBusTag(bus.type);
              return (
                <motion.div
                  key={bus.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-400 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getBusImage(bus.type)}
                      alt={bus.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                    <Badge className={`absolute top-3 left-3 border text-xs font-semibold ${tagColors[tag] ?? ""}`}>
                      {tag}
                    </Badge>

                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      bus.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}>
                      {bus.isActive ? "Active" : "Inactive"}
                    </span>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/80 backdrop-blur text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-100">
                      <Users className="w-3 h-3" />
                      {bus.totalSeats} seats
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-gray-900 font-bold text-lg leading-tight">{bus.name}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">
                          {getBusLabel(bus.type)} &nbsp;·&nbsp; #{bus.number}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-900 font-black text-xl text-right">৳{bus.pricePerSeat}</p>
                        <p className="text-gray-400 text-xs text-right">/ seat</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 bg-transparent text-xs rounded-xl"
                        onClick={() => router.push(`/operator-dashboard/buses/${bus.id}`)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 bg-transparent text-xs rounded-xl"
                        onClick={() => router.push(`/operator-dashboard/buses/${bus.id}/edit`)}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 bg-transparent rounded-xl"
                        onClick={() => console.log("delete", bus.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && !error && buses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12 flex flex-col items-center gap-4"
          >
            <p className="text-gray-400 text-sm">
              Showing{" "}
              <span className="text-gray-900 font-semibold">{displayed.length}</span>{" "}
              of{" "}
              <span className="text-gray-900 font-semibold">{filtered.length}</span>{" "}
              buses
            </p>
            {filtered.length > 6 && (
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="border-gray-200 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 rounded-xl"
              >
                {showAll ? "Show Less" : `View All ${filtered.length} Buses`}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}