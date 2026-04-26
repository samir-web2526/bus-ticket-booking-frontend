"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bus,
  Plus,
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
 // adjust path as needed
import { useRouter } from "next/navigation";
import { getOperatorBuses } from "@/src/services/buses.service";

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getBusLabel = (type: string): string => {
  const labels: Record<string, string> = {
    AC: "AC",
    NON_AC: "Non-AC",
    SLEEPER: "Sleeper",
    DOUBLE_DECKER: "Double Decker",
  };
  return labels[type] || type;
};

const getBusTag = (type: string): string => {
  const tags: Record<string, string> = {
    AC: "Premium",
    NON_AC: "Budget",
    SLEEPER: "Luxury",
    DOUBLE_DECKER: "Special",
  };
  return tags[type] || "Standard";
};

const tagColors: Record<string, string> = {
  Premium: "bg-rose-400/10 text-rose-400 border-rose-400/30",
  Budget: "bg-green-400/10 text-green-400 border-green-400/30",
  Luxury: "bg-purple-400/10 text-purple-400 border-purple-400/30",
  Special: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",
};

const getBusImage = (type: string): string => {
  const images: Record<string, string> = {
    AC: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
    NON_AC: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=80",
    SLEEPER: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80",
    DOUBLE_DECKER: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  };
  return images[type] || images.NON_AC;
};

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "" },
  { label: "AC", value: "AC" },
  { label: "Non-AC", value: "NON_AC" },
  { label: "Sleeper", value: "SLEEPER" },
  { label: "Double Decker", value: "DOUBLE_DECKER" },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">
          {label}
        </p>
        <p
          className="text-white font-black text-2xl"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyBuses() {
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [buses, setBuses] = useState<BusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busType, setBusType] = useState<FilterType>("");
  const [showAll, setShowAll] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
 useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const result = await getOperatorBuses();
      console.log("[MyBuses] result:", result); // ← দেখো কী আসছে

      if ("error" in result) {
        setError(result.error);
        setBuses([]); // ← error হলে empty array
      } else {
        // API response structure যেকোনো একটা হতে পারে:
        // result.data → array
        // result.data.data → array
        // result.data.buses → array
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

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = busType === "" ? buses : buses.filter((b) => b.type === busType);
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.isActive).length;
  const inactiveBuses = buses.filter((b) => !b.isActive).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section ref={ref} className="bg-[#07111f] min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              — Fleet Management
            </p>
            <h1
              className="text-4xl lg:text-5xl font-black text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              My <span className="text-amber-400">Buses</span>
            </h1>
          </div>
        </motion.div>

        {/* ── Stats Row ─────────────────────────────────────────────────── */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <StatCard
              icon={BusFront}
              label="Total Buses"
              value={totalBuses}
              accent="bg-amber-400/10 text-amber-400"
            />
            <StatCard
              icon={Activity}
              label="Active"
              value={activeBuses}
              accent="bg-green-400/10 text-green-400"
            />
            <StatCard
              icon={AlertCircle}
              label="Inactive"
              value={inactiveBuses}
              accent="bg-rose-400/10 text-rose-400"
            />
          </motion.div>
        )}

        {/* ── Filter Pills ───────────────────────────────────────────────── */}
        {!loading && !error && buses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center gap-2 flex-wrap mb-8"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setBusType(f.value);
                  setShowAll(false);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  busType === f.value
                    ? "bg-amber-400 text-black border-amber-400"
                    : "text-white border-white/20 hover:border-amber-400/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Loading ────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading your fleet...</p>
            </div>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && !loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
              <p className="text-rose-400 text-lg mb-2">Failed to load buses</p>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* ── Empty ─────────────────────────────────────────────────────── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Bus className="h-16 w-16 text-slate-600" />
            <p className="text-slate-400 text-lg">
              {buses.length === 0
                ? "You haven't added any buses yet."
                : "No buses found for this category."}
            </p>
          </div>
        )}

        {/* ── Grid ──────────────────────────────────────────────────────── */}
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
                  className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/30 transition-colors duration-300"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getBusImage(bus.type)}
                      alt={bus.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-transparent to-transparent" />

                    {/* Tag badge */}
                    <Badge
                      className={`absolute top-3 left-3 border text-xs font-semibold ${
                        tagColors[tag] ?? ""
                      }`}
                    >
                      {tag}
                    </Badge>

                    {/* Active / Inactive pill */}
                    <span
                      className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        bus.isActive
                          ? "bg-green-400/10 text-green-400 border-green-400/30"
                          : "bg-rose-400/10 text-rose-400 border-rose-400/30"
                      }`}
                    >
                      {bus.isActive ? "Active" : "Inactive"}
                    </span>

                    {/* Seat count */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                      <Users className="w-3 h-3" />
                      {bus.totalSeats} seats
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {bus.name}
                        </h3>
                        <p className="text-slate-400 text-sm mt-0.5">
                          {getBusLabel(bus.type)} &nbsp;·&nbsp; #{bus.number}
                        </p>
                      </div>
                      <div>
                        <p className="text-amber-400 font-black text-xl text-right">
                          ৳{bus.pricePerSeat}
                        </p>
                        <p className="text-slate-500 text-xs text-right">/ seat</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/10 text-slate-300 hover:text-white hover:border-white/30 bg-transparent text-xs"
                        onClick={() => router.push(`/operator/buses/${bus.id}`)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/10 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 bg-transparent text-xs"
                        onClick={() => router.push(`/operator/buses/${bus.id}/edit`)}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-slate-300 hover:text-rose-400 hover:border-rose-400/40 bg-transparent"
                        onClick={() => {
                          // TODO: wire up delete handler
                          console.log("delete", bus.id);
                        }}
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

        {/* ── Footer / View All ─────────────────────────────────────────── */}
        {!loading && !error && buses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12 flex flex-col items-center gap-4"
          >
            <p className="text-slate-400 text-sm">
              Showing{" "}
              <span className="text-amber-400 font-semibold">{displayed.length}</span> of{" "}
              <span className="text-amber-400 font-semibold">{filtered.length}</span> buses
            </p>

            {filtered.length > 6 && (
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="border-white/20 text-white hover:text-amber-400 bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 group transition-all duration-300"
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