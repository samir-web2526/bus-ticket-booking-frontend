"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertCircle, ArrowLeft, Users, DollarSign,
  Pencil, Trash2, CheckCircle, Hash, Building2, Calendar, RefreshCw, Zap, ShieldCheck, Activity, Database, Navigation
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
  const labels: Record<string, string> = { AC: "AC", NON_AC: "NON-AC", SLEEPER: "SLEEPER", DOUBLE_DECKER: "DOUBLE DECKER" };
  return labels[type] || type;
};

const getBusTag = (type: string): string => {
  const tags: Record<string, string> = { AC: "PREMIUM", NON_AC: "BUDGET", SLEEPER: "LUXURY", DOUBLE_DECKER: "SPECIAL" };
  return tags[type] || "STANDARD";
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
    <div className={`p-8 rounded-[32px] border flex flex-col gap-6 transition-all duration-500 group ${accent ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-900/20' : 'bg-card border-border hover:border-amber-500/30 shadow-sm'}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${accent ? 'bg-amber-500 text-white' : 'bg-muted text-amber-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className={`text-xs font-medium mb-2 ${accent ? 'text-amber-500/70' : 'text-muted-foreground opacity-60'}`}>{label}</p>
        <p className={`font-bold text-xl tracking-tight leading-none ${accent ? 'text-white' : 'text-foreground'}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl shadow-slate-900/[0.02] group">
      <div className="px-10 py-6 border-b border-border/50 flex items-center gap-5 bg-muted/10">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-lg group-hover:rotate-6 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-foreground font-semibold text-base tracking-tight">{title}</p>
      </div>
      <div className="p-10 space-y-2">{children}</div>
    </motion.div>
  );
}

function FieldRow({ label, value, highlight }: { label: string; value: string | number | null | undefined, highlight?: boolean }) {
  const display = value === null || value === undefined || (typeof value === "number" && isNaN(value)) ? "NOT PROVIDED" : value;
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-border/40 last:border-0 group/row">
      <p className="text-xs font-medium text-muted-foreground shrink-0 opacity-60">{label}</p>
      <p className={`text-base font-medium transition-colors ${highlight ? 'text-amber-500' : 'text-foreground group-hover/row:text-amber-500'}`}>{display}</p>
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
      } catch { setError("FAILED TO LOAD ASSET DIAGNOSTICS"); setBus(null); }
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="relative">
           <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
           <Loader2 className="h-20 w-20 text-amber-500 animate-spin relative z-10" />
        </div>
        <p className="text-muted-foreground font-medium text-base animate-pulse mt-10">Loading bus details...</p>
      </div>
    );
  }

  if (error || !bus) {
    return (
      <div className="min-h-screen bg-background py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="inline-flex items-center gap-4 text-muted-foreground hover:text-foreground text-base font-medium mb-12 transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform text-amber-500" /> Back to Buses
          </button>
          <div className="flex items-center justify-center h-96 bg-card border border-border rounded-[56px] shadow-2xl">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-8 animate-bounce" />
              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Error</h3>
              <p className="text-muted-foreground font-normal text-base">{error}</p>
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
    <section className="min-h-screen bg-background py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <button onClick={() => router.back()} className="inline-flex items-center gap-4 text-muted-foreground hover:text-foreground text-base font-medium mb-12 transition-all group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform text-amber-500" /> Back to Buses
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-card border border-border rounded-[56px] overflow-hidden mb-12 shadow-2xl shadow-slate-900/[0.03] group">
          <div className="h-48 bg-gradient-to-r from-muted/50 via-muted/20 to-transparent relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>
          <div className="px-12 pb-12">
            <div className="-mt-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div className="flex items-end gap-8 relative z-10">
                <div className="w-40 h-40 rounded-[40px] overflow-hidden border-8 border-card shadow-2xl group-hover:scale-105 transition-transform duration-700">
                  <img src={getBusImage(bus.type)} alt={bus.name} className="w-full h-full object-cover" />
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-5 mb-4 flex-wrap">
                    <h1 className="text-foreground font-bold text-3xl lg:text-4xl tracking-tight leading-none">{bus.name}</h1>
                    <Badge className="bg-amber-500 text-white border-none px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-amber-500/20">
                      {tag}
                    </Badge>
                    {bus.isActive && (
                      <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm font-medium opacity-60 leading-none">
                    {getBusLabel(bus.type)} · #{bus.number}
                  </p>
                  {bus.operator && <p className="text-amber-600 text-sm font-semibold mt-3 opacity-90">{bus.operator.name}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap mb-4">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: '#0f172a', color: '#fff' }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => setEditOpen(true)} 
                  className="flex items-center gap-3 bg-slate-900 border border-slate-800 text-white font-semibold px-6 py-3 rounded-2xl text-base shadow-xl shadow-slate-900/20 group/btn"
                >
                  <Pencil className="w-4 h-4 text-amber-500 group-hover/btn:rotate-12 transition-transform" /> Edit
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => setDeleteOpen(true)} 
                  className="flex items-center gap-3 bg-destructive/5 border border-destructive/20 text-destructive font-semibold px-6 py-3 rounded-2xl text-base transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard icon={Users} label="Total Slots" value={bus.totalSeats} accent />
          <StatCard icon={DollarSign} label="Yield/Slot" value={`৳${bus.pricePerSeat}`} />
          <StatCard icon={Calendar} label="Deployed" value={new Date(bus.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()} />
          <StatCard icon={RefreshCw} label="Last Sync" value={new Date(bus.updatedAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <InfoCard title="Asset Specifications" icon={Database}>
            <FieldRow label="Asset Name" value={bus.name} />
            <FieldRow label="Registry Number" value={bus.number} />
            <FieldRow label="Asset Class" value={getBusLabel(bus.type)} />
            <FieldRow label="Operational Status" value={bus.isActive ? "ONLINE" : "OFFLINE"} highlight={bus.isActive} />
          </InfoCard>

          <InfoCard title="Slot Allocation" icon={Users}>
            <FieldRow label="Total Capacity" value={bus.totalSeats} />
            <FieldRow label="Standard Units" value={standardCount} />
            {vipCount > 0 && (<><FieldRow label="VIP Units" value={vipCount} highlight /><FieldRow label="VIP Yield" value={bus.vipPrice ? `৳${bus.vipPrice}` : "NOT DEFINED"} highlight /></>)}
            {deluxeCount > 0 && (<><FieldRow label="Deluxe Units" value={deluxeCount} highlight /><FieldRow label="Deluxe Yield" value={bus.deluxePrice ? `৳${bus.deluxePrice}` : "NOT DEFINED"} highlight /></>)}
          </InfoCard>

          <InfoCard title="Yield Configuration" icon={DollarSign}>
            <FieldRow label="Standard Yield" value={`৳${bus.pricePerSeat}`} />
            {vipCount > 0 && <FieldRow label="VIP Premium" value={bus.vipPrice ? `৳${bus.vipPrice}` : "NOT DEFINED"} highlight />}
            {deluxeCount > 0 && <FieldRow label="Deluxe Premium" value={bus.deluxePrice ? `৳${bus.deluxePrice}` : "NOT DEFINED"} highlight />}
          </InfoCard>

          {bus.operator && (
            <InfoCard title="Authorized Operator" icon={ShieldCheck}>
              <FieldRow label="Designation" value={bus.operator.name} />
              <FieldRow label="Uplink" value={bus.operator.email} />
              <FieldRow label="Signal" value={bus.operator.phone} />
            </InfoCard>
          )}
        </div>
        
        {/* Technical Detail Footer */}
        <div className="mt-24 pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-2xl">
                 <Zap className="w-8 h-8 fill-amber-500" />
              </div>
              <div>
                 <p className="text-xs font-medium text-muted-foreground opacity-60 mb-1">Bus ID</p>
                 <p className="text-foreground font-semibold text-base tracking-tight">{bus.id}</p>
              </div>
           </div>
           <div className="flex items-center gap-4 text-muted-foreground/40 text-sm font-medium">
              <Activity className="w-4 h-4" /> Bus details loaded
           </div>
        </div>
      </div>

      <AnimatePresence>
        {editOpen && <EditBusModal key={`${bus.id}-${editOpen}`} bus={bus} open={editOpen} onClose={() => setEditOpen(false)} onUpdated={() => { setEditOpen(false); router.refresh(); }} />}
      </AnimatePresence>

      <AnimatePresence>
        {deleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => !deleteLoading && setDeleteOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-card border border-border rounded-[48px] p-12 max-w-lg w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
              <div className="w-20 h-20 rounded-[32px] bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-8">
                <Trash2 className="w-10 h-10" />
              </div>
              <p className="text-destructive text-sm font-medium mb-3">Delete Bus</p>
              <h2 className="text-foreground font-bold text-3xl mb-4 tracking-tight leading-tight">Delete <span className="text-destructive">{bus.name}</span>?</h2>
              <p className="text-muted-foreground text-base mb-10 font-normal">Are you sure you want to permanently delete this bus? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteOpen(false)} disabled={deleteLoading} className="flex-1 bg-muted/40 text-muted-foreground hover:bg-muted/60 rounded-2xl h-14 font-semibold text-base transition-all disabled:opacity-50">
                  Cancel
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDelete} disabled={deleteLoading} className="flex-[1.5] bg-destructive hover:bg-destructive/90 disabled:opacity-50 text-white font-semibold h-14 rounded-2xl transition-all flex items-center justify-center gap-3 text-base shadow-xl shadow-destructive/20">
                  {deleteLoading ? <><Activity className="w-5 h-5 animate-spin" /> Deleting...</> : <><Trash2 className="w-5 h-5" /> Delete Bus</>}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}