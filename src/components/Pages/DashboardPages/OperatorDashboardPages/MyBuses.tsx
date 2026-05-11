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
  Plus,
  Hash,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  ({ AC: "Premium AC", NON_AC: "Standard", SLEEPER: "Sleeper", DOUBLE_DECKER: "Double Decker" }[type] ?? type);

const getBusTag = (type: string): string =>
  ({ AC: "Premium", NON_AC: "Budget", SLEEPER: "Luxury", DOUBLE_DECKER: "Special" }[type] ?? "Standard");

const tagColors: Record<string, string> = {
  Premium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Budget:  "bg-slate-900/10 text-slate-900 border-slate-900/20",
  Luxury:  "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Special: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const getBusImage = (type: string): string =>
  ({
    AC:            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    NON_AC:        "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80",
    SLEEPER:       "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
    DOUBLE_DECKER: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  }[type] ?? "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80");

const filters: { label: string; value: FilterType }[] = [
  { label: "All Assets", value: "" },
  { label: "AC Premium", value: "AC" },
  { label: "Standard", value: "NON_AC" },
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
    <div className={`rounded-[32px] p-6 border transition-all duration-500 group ${
      accent
        ? "bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-900/20"
        : "bg-card border-border shadow-sm"
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mb-5 ${
        accent ? "bg-white/10 text-amber-500" : "bg-muted border border-border text-amber-600 group-hover:bg-amber-500/10 transition-colors"
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className={`text-sm font-medium mb-1 ${
          accent ? "text-slate-400" : "text-muted-foreground opacity-60"
        }`}>{label}</p>
        <p className="font-bold text-3xl tracking-tight">{value}</p>
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
    <section ref={ref} className="bg-background min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Decorative bg blobs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.02] rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">
              Fleet Management
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              My <span className="text-amber-600">Buses</span>
            </h1>
          </div>
          <Link href="/operator-dashboard/create-bus">
            <Button className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center gap-3 shadow-2xl shadow-slate-900/20 group">
              <Plus className="w-5 h-5 text-amber-500 group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-base font-semibold">Add New Bus</span>
            </Button>
          </Link>
        </motion.div>

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
          >
            <StatCard icon={BusFront} label="Total Fleet" value={totalBuses} accent />
            <StatCard icon={Activity} label="Ready Units" value={activeBuses} />
            <StatCard icon={AlertCircle} label="Maintenance" value={inactiveBuses} />
          </motion.div>
        )}

        {!loading && !error && buses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center gap-3 flex-wrap mb-10 bg-card border border-border p-2 rounded-full w-fit shadow-sm"
          >
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => { setBusType(f.value); setShowAll(false); }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  busType === f.value
                    ? "bg-slate-900 text-white shadow-xl"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px]">
            <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-6" />
            <p className="text-muted-foreground text-base font-medium">Loading buses...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px]">
            <AlertCircle className="h-12 w-12 text-destructive mb-6" />
            <p className="text-foreground font-bold text-xl tracking-tight mb-2">Error</p>
            <p className="text-muted-foreground text-base font-normal">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px]">
            <Bus className="h-20 w-20 text-muted-foreground/20 mb-6" />
            <p className="text-foreground font-bold text-xl tracking-tight mb-2">No buses found</p>
            <p className="text-muted-foreground text-base font-normal">
              {buses.length === 0
                ? "Initialize your first fleet unit to begin"
                : "No matching assets found in current category"}
            </p>
          </div>
        )}

        {!loading && !error && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((bus, i) => {
              const tag = getBusTag(bus.type);
              return (
                <motion.div
                  key={bus.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group bg-card border border-border rounded-[40px] overflow-hidden hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-900/[0.03]"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getBusImage(bus.type)}
                      alt={bus.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                    <div className="absolute top-6 left-6 flex items-center gap-2">
                       <Badge className={`border px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md ${tagColors[tag] ?? ""}`}>
                        {tag}
                      </Badge>
                    </div>

                    <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium shadow-xl border backdrop-blur-md ${
                      bus.isActive
                        ? "bg-emerald-500/80 text-white border-emerald-400"
                        : "bg-destructive/80 text-white border-destructive/40"
                    }`}>
                      {bus.isActive ? "Active" : "Inactive"}
                    </div>

                    <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 shadow-2xl">
                      <Users className="w-3 h-3 text-amber-500" />
                      {bus.totalSeats} Seats
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-foreground font-bold text-xl tracking-tight mb-1">{bus.name}</h3>
                        <p className="text-muted-foreground text-sm font-medium opacity-60">
                          {getBusLabel(bus.type)} &nbsp;·&nbsp; 
                          <span className="text-amber-600 ml-1">#{bus.number}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground font-bold text-2xl tracking-tight">৳{bus.pricePerSeat}</p>
                        <p className="text-muted-foreground text-sm font-medium opacity-40">/ Seat</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-14 rounded-2xl bg-muted/50 border border-border/50 hover:bg-slate-900 hover:text-white transition-all duration-500 group/btn"
                        onClick={() => router.push(`/operator-dashboard/buses/${bus.id}`)}
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-14 rounded-2xl bg-muted/50 border border-border/50 hover:bg-slate-900 hover:text-white transition-all duration-500 group/btn"
                        onClick={() => router.push(`/operator-dashboard/buses/${bus.id}/edit`)}
                      >
                        <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-14 rounded-2xl bg-muted/50 border border-border/50 hover:bg-destructive hover:text-white transition-all duration-500 group/btn"
                        onClick={() => console.log("delete", bus.id)}
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
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
            className="text-center mt-20 flex flex-col items-center gap-6"
          >
            <p className="text-muted-foreground text-sm font-medium opacity-50">
              Showing{" "}
              <span className="text-foreground font-semibold">{displayed.length}</span>{" "}
              of{" "}
              <span className="text-foreground font-semibold">{filtered.length}</span>{" "}
              Buses
            </p>
            {filtered.length > 6 && (
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="h-14 px-10 border-border text-foreground hover:bg-slate-900 hover:text-white hover:border-slate-800 transition-all duration-500 rounded-full text-base font-medium"
              >
                {showAll ? "Show Less" : `View All (${filtered.length} Buses)`}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}