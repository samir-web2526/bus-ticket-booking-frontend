"use client";

import { useState, useEffect, useCallback } from "react";
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
  Zap,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getBusById, updateBus, deleteBus } from "@/src/services/buses.service";

// ─── Types ────────────────────────────────────────────────────────────────
interface BusDetail {
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

// ─── Styles ───────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-white/5 border border-white/20 text-white rounded-xl h-11 px-3 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20 transition-colors placeholder:text-slate-600";

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
    <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${accent ? "bg-amber-400/5 border-amber-400/20" : "bg-white/[0.03] border-white/10"}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-amber-400/15 text-amber-400" : "bg-white/5 text-slate-400"}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-slate-500 text-xs mb-0.5">{label}</p>
        <p className={`font-bold text-sm leading-snug ${accent ? "text-amber-400" : "text-white"}`}>{value}</p>
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
function FieldRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  const display =
    value === null || value === undefined || (typeof value === "number" && isNaN(value))
      ? "Not provided"
      : value;

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <p className="text-slate-500 text-xs uppercase tracking-wider shrink-0 pt-0.5">{label}</p>
      <p className="text-white text-sm font-semibold text-right">{display}</p>
    </div>
  );
}

// ─── Edit Modal ────────────────────────────────────────────────────────────
interface EditModalProps {
  bus: BusDetail;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

function EditBusModal({ bus, open, onClose, onUpdated }: EditModalProps) {
  const [form, setForm] = useState({
    name: bus.name || "",
    number: bus.number || "",
    type: bus.type || "NON_AC",
    totalSeats: bus.totalSeats || 40,
    vipSeats: bus.seatSummary?.VIP ?? bus.vipSeats ?? 0,
    vipPrice: bus.vipPrice ?? 0,
    deluxeSeats: bus.seatSummary?.DELUXE ?? bus.deluxeSeats ?? 0,
    deluxePrice: bus.deluxePrice ?? 0,
    pricePerSeat: bus.pricePerSeat || 0,
    isActive: bus.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: bus.name || "",
        number: bus.number || "",
        type: bus.type || "NON_AC",
        totalSeats: bus.totalSeats || 40,
        vipSeats: bus.seatSummary?.VIP ?? bus.vipSeats ?? 0,
        vipPrice: bus.vipPrice ?? 0,
        deluxeSeats: bus.seatSummary?.DELUXE ?? bus.deluxeSeats ?? 0,
        deluxePrice: bus.deluxePrice ?? 0,
        pricePerSeat: bus.pricePerSeat || 0,
        isActive: bus.isActive ?? true,
      });
    }
  }, [open, bus]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.name.trim()) { toast.error("Bus name is required"); return; }
      if (!form.number.trim()) { toast.error("Bus number is required"); return; }
      if (form.pricePerSeat <= 0) { toast.error("Price per seat must be greater than 0"); return; }

      const payload = {
        name: form.name,
        number: form.number,
        type: form.type,
        totalSeats: form.totalSeats,
        vipSeats: form.vipSeats,
        vipPrice: form.vipPrice,
        deluxeSeats: form.deluxeSeats,
        deluxePrice: form.deluxePrice,
        pricePerSeat: form.pricePerSeat,
        isActive: form.isActive,
      };

      const res = await updateBus(bus.id, payload);
      if (res.error) { toast.error(res.error); return; }

      toast.success("Bus updated successfully!");
      onClose();
      onUpdated();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="bg-[#07111f] border border-white/10 text-white max-w-lg rounded-3xl p-0 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <DialogHeader className="px-8 pt-8 pb-5 border-b border-white/10 relative">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">— Edit Bus</p>
            <DialogTitle className="text-white font-black text-2xl">
              Update <span className="text-amber-400">Bus</span>
            </DialogTitle>
            <p className="text-slate-500 text-sm mt-2">Edit bus information below</p>
          </motion.div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-6 relative max-h-96 overflow-y-auto">
          {/* Basic Information */}
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-white/10">Basic Information</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Bus Name</label>
                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g., Hanif Express" className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Bus Number</label>
                <input type="text" value={form.number} onChange={(e) => handleChange("number", e.target.value)} placeholder="e.g., h-1007" className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Bus Type</label>
                <select value={form.type} onChange={(e) => handleChange("type", e.target.value)} className={inputCls}>
                  <option value="AC">AC</option>
                  <option value="NON_AC">Non-AC</option>
                  <option value="SLEEPER">Sleeper</option>
                  <option value="DOUBLE_DECKER">Double Decker</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seating & Pricing */}
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-white/10">Seating & Pricing</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Total Seats</label>
                <input type="number" value={form.totalSeats} onChange={(e) => handleChange("totalSeats", parseInt(e.target.value))} min="1" className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Price Per Seat (৳)</label>
                <input type="number" value={form.pricePerSeat} onChange={(e) => handleChange("pricePerSeat", parseInt(e.target.value))} min="1" className={inputCls} />
              </div>
            </div>
          </div>

          {/* VIP Seats */}
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-white/10">VIP Seats (Optional)</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">VIP Seats</label>
                <input type="number" value={form.vipSeats || ""} onChange={(e) => handleChange("vipSeats", parseInt(e.target.value) || 0)} min="0" placeholder="Number of VIP seats" className={inputCls} />
              </div>
              {form.vipSeats > 0 && (
                <div>
                  <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">VIP Price (৳)</label>
                  <input type="number" value={form.vipPrice || ""} onChange={(e) => handleChange("vipPrice", parseInt(e.target.value) || 0)} min="1" placeholder="VIP seat price" className={inputCls} />
                </div>
              )}
            </div>
          </div>

          {/* Deluxe Seats */}
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-white/10">Deluxe Seats (Optional)</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Deluxe Seats</label>
                <input type="number" value={form.deluxeSeats || ""} onChange={(e) => handleChange("deluxeSeats", parseInt(e.target.value) || 0)} min="0" placeholder="Number of deluxe seats" className={inputCls} />
              </div>
              {form.deluxeSeats > 0 && (
                <div>
                  <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Deluxe Price (৳)</label>
                  <input type="number" value={form.deluxePrice || ""} onChange={(e) => handleChange("deluxePrice", parseInt(e.target.value) || 0)} min="1" placeholder="Deluxe seat price" className={inputCls} />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-white/10">Status</p>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} className="w-5 h-5 rounded border-white/20 accent-amber-400" />
              <label htmlFor="isActive" className="text-white font-semibold text-sm">Bus is Active</label>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-5 border-t border-white/10 gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}
            className="flex-1 border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white rounded-xl h-11">
            Cancel
          </Button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} disabled={loading}
            className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Zap className="w-4 h-4" /> Save Changes</>}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function BusDetailsPage({ id }: { id: string }) {
  const router = useRouter();

  const [bus, setBus] = useState<BusDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBus = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getBusById(id);
    if ("error" in result) {
      setError(result.error);
    } else {
      setBus(result.data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchBus();
  }, [fetchBus]);

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
      router.push("/operator-dashboard/buses");
    } catch {
      toast.error("Something went wrong");
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-[#07111f] min-h-screen py-24 px-6 lg:px-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading bus details...</p>
        </div>
      </section>
    );
  }

  if (error || !bus) {
    return (
      <section className="bg-[#07111f] min-h-screen py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
              <p className="text-rose-400 text-lg mb-2">Failed to load bus</p>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const tag = getBusTag(bus.type);

  // seatSummary থেকে নাও, না থাকলে direct field থেকে
  const vipCount = bus.seatSummary?.VIP ?? bus.vipSeats ?? 0;
  const deluxeCount = bus.seatSummary?.DELUXE ?? bus.deluxeSeats ?? 0;
  const standardCount = bus.seatSummary?.STANDARD ?? (bus.totalSeats - vipCount - deluxeCount);

  return (
    <section className="bg-[#07111f] min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Buses
        </button>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden mb-6"
        >
          <div className="h-32 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.15),transparent_60%)]" />
          </div>
          <div className="px-8 pb-8">
            <div className="-mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#07111f] shadow-xl">
                  <img src={getBusImage(bus.type)} alt={bus.name} className="w-full h-full object-cover" />
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-white font-black text-2xl lg:text-3xl">{bus.name}</h1>
                    <Badge className={`border text-xs font-semibold ${tagColors[tag] ?? ""}`}>{tag}</Badge>
                    {bus.isActive && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{getBusLabel(bus.type)} · #{bus.number}</p>
                  {bus.operator && <p className="text-amber-400/70 text-xs mt-0.5 font-medium">{bus.operator.name}</p>}
                </div>
              </div>
              <div className="self-start sm:self-auto flex items-center gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-400/10"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
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
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatCard icon={Users} label="Total Seats" value={bus.totalSeats} accent />
          <StatCard icon={DollarSign} label="Price/Seat" value={`৳${bus.pricePerSeat}`} />
          <StatCard icon={Calendar} label="Created" value={new Date(bus.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })} />
          <StatCard icon={RefreshCw} label="Updated" value={new Date(bus.updatedAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })} />
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard title="Bus Information" icon={Hash}>
            <FieldRow label="Bus Name" value={bus.name} />
            <FieldRow label="Bus Number" value={bus.number} />
            <FieldRow label="Bus Type" value={getBusLabel(bus.type)} />
            <FieldRow label="Status" value={bus.isActive ? "Active" : "Inactive"} />
          </InfoCard>

          <InfoCard title="Seat Details" icon={Users}>
            <FieldRow label="Total Seats" value={bus.totalSeats} />
            <FieldRow label="Standard Seats" value={standardCount} />
            {vipCount > 0 && (
              <>
                <FieldRow label="VIP Seats" value={vipCount} />
                <FieldRow label="VIP Price" value={bus.vipPrice ? `৳${bus.vipPrice}` : "Not provided"} />
              </>
            )}
            {deluxeCount > 0 && (
              <>
                <FieldRow label="Deluxe Seats" value={deluxeCount} />
                <FieldRow label="Deluxe Price" value={bus.deluxePrice ? `৳${bus.deluxePrice}` : "Not provided"} />
              </>
            )}
          </InfoCard>

          <InfoCard title="Pricing" icon={DollarSign}>
            <FieldRow label="Standard Price" value={`৳${bus.pricePerSeat}`} />
            {vipCount > 0 && <FieldRow label="VIP Price" value={bus.vipPrice ? `৳${bus.vipPrice}` : "Not provided"} />}
            {deluxeCount > 0 && <FieldRow label="Deluxe Price" value={bus.deluxePrice ? `৳${bus.deluxePrice}` : "Not provided"} />}
          </InfoCard>

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
      <EditBusModal
        key={bus.id + String(editOpen)}
        bus={bus}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={fetchBus}
      />

      {/* Delete Confirm Dialog */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !deleteLoading && setDeleteOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#07111f] border border-red-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
              <Trash2 className="w-6 h-6" />
            </div>
            <p className="text-red-400 text-xs font-semibold tracking-widest uppercase mb-2">— Danger Zone</p>
            <h2 className="text-white font-black text-2xl mb-2">Delete Bus?</h2>
            <p className="text-slate-400 text-sm mb-8">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">{bus.name}</span>? This action cannot be undone.
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
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                {deleteLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                  : <><Trash2 className="w-4 h-4" /> Delete</>
                }
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}