"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2, AlertCircle, ArrowLeft, Users, DollarSign,
  Pencil, Trash2, CheckCircle, Hash, Building2, Calendar, RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getBusById, deleteBus } from "@/src/services/buses.service";
import EditBusModal from "./EditBusModal";

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
  seatSummary?: { VIP: number; DELUXE: number; STANDARD: number };
  pricePerSeat: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  operatorId: string;
  operator?: { id: string; name: string; email: string; phone: string; profileImage?: string };
}

const getBusLabel = (type: string): string => {
  const labels: Record<string, string> = { AC: "AC", NON_AC: "Non-AC", SLEEPER: "Sleeper", DOUBLE_DECKER: "Double Decker" };
  return labels[type] || type;
};

const getBusTag = (type: string): string => {
  const tags: Record<string, string> = { AC: "Premium", NON_AC: "Budget", SLEEPER: "Luxury", DOUBLE_DECKER: "Special" };
  return tags[type] || "Standard";
};

const tagColors: Record<string, string> = {
  Premium: "bg-rose-100 text-rose-700 border-rose-200",
  Budget: "bg-green-100 text-green-700 border-green-200",
  Luxury: "bg-purple-100 text-purple-700 border-purple-200",
  Special: "bg-cyan-100 text-cyan-700 border-cyan-200",
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

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${accent ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'} shadow-sm`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-500'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className={`text-xs mb-0.5 ${accent ? 'text-gray-400' : 'text-gray-400'}`}>{label}</p>
        <p className={`font-bold text-sm leading-snug ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-gray-900 font-bold text-sm uppercase tracking-wider">{title}</p>
      </div>
      <div className="p-6 space-y-1">{children}</div>
    </motion.div>
  );
}

function FieldRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  const display = value === null || value === undefined || (typeof value === "number" && isNaN(value)) ? "Not provided" : value;
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <p className="text-gray-400 text-xs uppercase tracking-wider shrink-0 pt-0.5">{label}</p>
      <p className="text-gray-900 text-sm font-semibold text-right">{display}</p>
    </div>
  );
}

export default function BusDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [bus, setBus] = useState<BusDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getBusById(id);
        if ("error" in result) { setError(result.error); setBus(null); }
        else { setBus(result.data); }
      } catch { setError("Failed to load bus details"); setBus(null); }
      finally { setLoading(false); }
    };
    fetchBus();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const result = await deleteBus(id);
      if (result.error) { toast.error(result.error); setDeleteLoading(false); return; }
      toast.success("Bus deleted successfully!");
      setDeleteOpen(false);
      router.push("/admin-dashboard/buses");
    } catch { toast.error("Something went wrong"); setDeleteLoading(false); }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (error || !bus) {
    return (
      <div className="bg-gray-50 min-h-screen py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-500 text-lg mb-2">Failed to load bus</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tag = getBusTag(bus.type);
  const vipCount = bus.seatSummary?.VIP ?? bus.vipSeats ?? 0;
  const deluxeCount = bus.seatSummary?.DELUXE ?? bus.deluxeSeats ?? 0;
  const standardCount = bus.seatSummary?.STANDARD ?? bus.totalSeats - vipCount - deluxeCount;

  return (
    <section className="bg-gray-50 min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Buses
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-6 shadow-sm">
          <div className="h-32 bg-gradient-to-r from-gray-100 via-gray-50 to-white relative" />
          <div className="px-8 pb-8">
            <div className="-mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img src={getBusImage(bus.type)} alt={bus.name} className="w-full h-full object-cover" />
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-gray-900 font-black text-2xl lg:text-3xl">{bus.name}</h1>
                    <Badge className={`border text-xs font-semibold ${tagColors[tag] ?? ""}`}>{tag}</Badge>
                    {bus.isActive && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{getBusLabel(bus.type)} · #{bus.number}</p>
                  {bus.operator && <p className="text-gray-500 text-xs mt-0.5 font-medium">{bus.operator.name}</p>}
                </div>
              </div>

              <div className="self-start sm:self-auto flex items-center gap-3 flex-wrap">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setEditOpen(true)} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-sm">
                  <Pencil className="w-4 h-4" /> Edit
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setDeleteOpen(true)} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider transition-all">
                  <Trash2 className="w-4 h-4" /> Delete
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users} label="Total Seats" value={bus.totalSeats} accent />
          <StatCard icon={DollarSign} label="Price/Seat" value={`৳${bus.pricePerSeat}`} />
          <StatCard icon={Calendar} label="Created" value={new Date(bus.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })} />
          <StatCard icon={RefreshCw} label="Updated" value={new Date(bus.updatedAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })} />
        </motion.div>

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
            {vipCount > 0 && (<><FieldRow label="VIP Seats" value={vipCount} /><FieldRow label="VIP Price" value={bus.vipPrice ? `৳${bus.vipPrice}` : "Not provided"} /></>)}
            {deluxeCount > 0 && (<><FieldRow label="Deluxe Seats" value={deluxeCount} /><FieldRow label="Deluxe Price" value={bus.deluxePrice ? `৳${bus.deluxePrice}` : "Not provided"} /></>)}
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

      {bus && <EditBusModal key={`${bus.id}-${editOpen}`} bus={bus} open={editOpen} onClose={() => setEditOpen(false)} onUpdated={() => { setEditOpen(false); router.refresh(); }} />}

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !deleteLoading && setDeleteOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white border border-gray-200 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500 mb-5">
              <Trash2 className="w-6 h-6" />
            </div>
            <p className="text-red-500 text-xs font-semibold tracking-widest uppercase mb-2">— Danger Zone</p>
            <h2 className="text-gray-900 font-black text-2xl mb-2">Delete Bus?</h2>
            <p className="text-gray-500 text-sm mb-8">Are you sure you want to delete <span className="text-gray-900 font-semibold">{bus.name}</span>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteOpen(false)} disabled={deleteLoading} className="flex-1 border border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:text-gray-900 rounded-xl h-11 font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50">
                Cancel
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDelete} disabled={deleteLoading} className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                {deleteLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : <><Trash2 className="w-4 h-4" /> Delete</>}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}