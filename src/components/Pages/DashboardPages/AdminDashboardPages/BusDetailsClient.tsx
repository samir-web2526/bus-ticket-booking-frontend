"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Users,
  DollarSign,
  Pencil,
  Trash2,
  CheckCircle,
  Hash,
  Building2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getBusById, deleteBus } from "@/src/services/buses.service";
import EditBusModal from "./EditBusModal";


// ─── Types ────────────────────────────────────────────────────────────────
export interface BusDetail {
  id: string;
  name: string;
  number: string;
  type: "AC" | "NON_AC" | "SLEEPER" | "DOUBLE_DECKER";
  totalSeats: number;
  vipSeats?: number;
  vipPrice?: number;
  deluxeSeats?: number;
  deluxePrice?: number;
  seatSummary?: {
    VIP: number;
    DELUXE: number;
    STANDARD: number;
  };
  pricePerSeat: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  operatorId: string;
  operator?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
}

// ─── Helper Functions ─────────────────────────────────────────────────────
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
    AC: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    NON_AC: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80",
    SLEEPER: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
    DOUBLE_DECKER: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  };
  return images[type] || images.NON_AC;
};

// ─── Stat Card ────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border flex flex-col gap-3 ${
        accent ? "bg-amber-400/5 border-amber-400/20" : "bg-white/[0.03] border-white/10"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          accent ? "bg-amber-400/15 text-amber-400" : "bg-white/5 text-slate-400"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-slate-500 text-xs mb-0.5">{label}</p>
        <p className={`font-bold text-sm leading-snug ${accent ? "text-amber-400" : "text-white"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────
function InfoCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-white font-bold text-sm uppercase tracking-wider">{title}</p>
      </div>
      <div className="p-6 space-y-1">{children}</div>
    </motion.div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────
function FieldRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const display =
    value === null ||
    value === undefined ||
    (typeof value === "number" && isNaN(value))
      ? "Not provided"
      : value;

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <p className="text-slate-500 text-xs uppercase tracking-wider shrink-0 pt-0.5">
        {label}
      </p>
      <p className="text-white text-sm font-semibold text-right">{display}</p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function BusDetailsClient({ id }: { id: string }) {
  const router = useRouter();

  const [bus, setBus] = useState<BusDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Fetch Bus Data ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchBus = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getBusById(id);

        if ("error" in result) {
          setError(result.error);
          setBus(null);
        } else {
          setBus(result.data);
        }
      } catch (err) {
        setError("Failed to load bus details");
        setBus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [id]);

  // ─── Delete Handler ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const result = await deleteBus(id);

      if (result.error) {
        toast.error(result.error);
        setDeleteLoading(false);
        return;
      }

      toast.success("Bus deleted successfully!");
      setDeleteOpen(false);
      router.push("/admin-dashboard/buses");
    } catch {
      toast.error("Something went wrong");
      setDeleteLoading(false);
    }
  };

  // ─── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-[#050d1a] min-h-screen py-24 px-6 lg:px-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading bus details...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────────
  if (error || !bus) {
    return (
      <div className="bg-[#050d1a] min-h-screen py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
              <p className="text-rose-400 text-lg mb-2">Failed to load bus</p>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Data Calculations ────────────────────────────────────────────────────
  const tag = getBusTag(bus.type);
  const vipCount = bus.seatSummary?.VIP ?? bus.vipSeats ?? 0;
  const deluxeCount = bus.seatSummary?.DELUXE ?? bus.deluxeSeats ?? 0;
  const standardCount = bus.seatSummary?.STANDARD ?? bus.totalSeats - vipCount - deluxeCount;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <section className="bg-[#050d1a] min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Buses
        </button>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden mb-6"
        >
          <div className="h-32 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.15),transparent_60%)]" />
          </div>
          <div className="px-8 pb-8">
            <div className="-mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              {/* Bus Image + Name */}
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#050d1a] shadow-xl">
                  <img
                    src={getBusImage(bus.type)}
                    alt={bus.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-white font-black text-2xl lg:text-3xl">{bus.name}</h1>
                    <Badge className={`border text-xs font-semibold ${tagColors[tag] ?? ""}`}>
                      {tag}
                    </Badge>
                    {bus.isActive && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">
                    {getBusLabel(bus.type)} · #{bus.number}
                  </p>
                  {bus.operator && (
                    <p className="text-amber-400/70 text-xs mt-0.5 font-medium">
                      {bus.operator.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Edit + Delete Buttons */}
              <div className="self-start sm:self-auto flex items-center gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-400/10"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat Pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatCard icon={Users} label="Total Seats" value={bus.totalSeats} accent />
          <StatCard icon={DollarSign} label="Price/Seat" value={`৳${bus.pricePerSeat}`} />
          <StatCard
            icon={Calendar}
            label="Created"
            value={new Date(bus.createdAt).toLocaleDateString("en-BD", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
          <StatCard
            icon={RefreshCw}
            label="Updated"
            value={new Date(bus.updatedAt).toLocaleDateString("en-BD", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bus Information */}
          <InfoCard title="Bus Information" icon={Hash}>
            <FieldRow label="Bus Name" value={bus.name} />
            <FieldRow label="Bus Number" value={bus.number} />
            <FieldRow label="Bus Type" value={getBusLabel(bus.type)} />
            <FieldRow label="Status" value={bus.isActive ? "Active" : "Inactive"} />
          </InfoCard>

          {/* Seat Details */}
          <InfoCard title="Seat Details" icon={Users}>
            <FieldRow label="Total Seats" value={bus.totalSeats} />
            <FieldRow label="Standard Seats" value={standardCount} />
            {vipCount > 0 && (
              <>
                <FieldRow label="VIP Seats" value={vipCount} />
                <FieldRow
                  label="VIP Price"
                  value={bus.vipPrice ? `৳${bus.vipPrice}` : "Not provided"}
                />
              </>
            )}
            {deluxeCount > 0 && (
              <>
                <FieldRow label="Deluxe Seats" value={deluxeCount} />
                <FieldRow
                  label="Deluxe Price"
                  value={bus.deluxePrice ? `৳${bus.deluxePrice}` : "Not provided"}
                />
              </>
            )}
          </InfoCard>

          {/* Pricing */}
          <InfoCard title="Pricing" icon={DollarSign}>
            <FieldRow label="Standard Price" value={`৳${bus.pricePerSeat}`} />
            {vipCount > 0 && (
              <FieldRow
                label="VIP Price"
                value={bus.vipPrice ? `৳${bus.vipPrice}` : "Not provided"}
              />
            )}
            {deluxeCount > 0 && (
              <FieldRow
                label="Deluxe Price"
                value={bus.deluxePrice ? `৳${bus.deluxePrice}` : "Not provided"}
              />
            )}
          </InfoCard>

          {/* Operator Information */}
          {bus.operator && (
            <InfoCard title="Operator Information" icon={Building2}>
              <FieldRow label="Name" value={bus.operator.name} />
              <FieldRow label="Email" value={bus.operator.email} />
              <FieldRow label="Phone" value={bus.operator.phone} />
            </InfoCard>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {bus && (
        <EditBusModal
          key={`${bus.id}-${editOpen}`}
          bus={bus}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onUpdated={() => {
            setEditOpen(false);
            router.refresh();
          }}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !deleteLoading && setDeleteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#050d1a] border border-red-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
              <Trash2 className="w-6 h-6" />
            </div>
            <p className="text-red-400 text-xs font-semibold tracking-widest uppercase mb-2">
              — Danger Zone
            </p>
            <h2 className="text-white font-black text-2xl mb-2">Delete Bus?</h2>
            <p className="text-slate-400 text-sm mb-8">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">{bus.name}</span>? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                disabled={deleteLoading}
                className="flex-1 border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white rounded-xl h-11 font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}