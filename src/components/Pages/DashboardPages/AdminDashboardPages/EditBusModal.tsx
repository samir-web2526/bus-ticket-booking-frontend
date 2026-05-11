"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, X, Bus, Settings2, ShieldCheck, CreditCard, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateBus } from "@/src/services/buses.service";

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
  seatSummary?: { VIP: number; DELUXE: number; STANDARD: number };
  pricePerSeat: number;
  isActive: boolean;
}

interface EditModalProps {
  bus: BusDetail;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditBusModal({ bus, open, onClose, onUpdated }: EditModalProps) {
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

  const handleChange = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!form.name.trim()) { toast.error("Bus name is required"); return; }
      if (!form.number.trim()) { toast.error("Bus number is required"); return; }
      if (form.pricePerSeat <= 0) { toast.error("Price per seat must be greater than 0"); return; }

      const res = await updateBus(bus.id, {
        name: form.name, number: form.number, type: form.type,
        totalSeats: form.totalSeats, vipSeats: form.vipSeats, vipPrice: form.vipPrice,
        deluxeSeats: form.deluxeSeats, deluxePrice: form.deluxePrice,
        pricePerSeat: form.pricePerSeat, isActive: form.isActive,
      });

      if (res.error) { toast.error(res.error); return; }
      toast.success("Bus parameters synchronized successfully!");
      onClose();
      onUpdated();
    } catch { toast.error("System synchronization failed"); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-muted/50 border border-border text-foreground rounded-2xl h-14 px-4 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 placeholder:text-muted-foreground/50 text-base font-normal";
  const labelCls = "text-sm font-semibold text-amber-600 block mb-3 ml-1";
  const sectionCls = "p-8 bg-muted/20 border border-border/50 rounded-[32px] space-y-6";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="bg-card border-none max-w-2xl rounded-[48px] p-0 overflow-hidden shadow-2xl shadow-slate-900/20 flex flex-col h-[90vh]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[100px] -z-10" />
        
        <DialogHeader className="px-10 pt-10 pb-8 border-b border-border/50 relative shrink-0">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-amber-600 text-sm font-medium tracking-wide mb-2">Edit Bus</p>
              <DialogTitle className="text-foreground font-bold text-3xl tracking-tight leading-none">
                Edit <span className="text-amber-600">Bus</span>
              </DialogTitle>
            </motion.div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl hover:bg-muted text-muted-foreground transition-all duration-500">
               <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-10 py-8 space-y-10 overflow-y-auto custom-scrollbar flex-1">
          <section className={sectionCls}>
            <div className="flex items-center gap-3 mb-2">
               <Bus className="w-4 h-4 text-amber-500" />
               <p className="text-xs font-medium text-muted-foreground opacity-50">Bus Details</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Bus Name</label>
                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="HANIF EXPRESS" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bus Number</label>
                <input type="text" value={form.number} onChange={(e) => handleChange("number", e.target.value)} placeholder="H-1007" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Bus Type</label>
              <select value={form.type} onChange={(e) => handleChange("type", e.target.value)} className={inputCls}>
                <option value="AC">AC PREMIUM</option>
                <option value="NON_AC">NON-AC STANDARD</option>
                <option value="SLEEPER">SLEEPER CABIN</option>
                <option value="DOUBLE_DECKER">DOUBLE DECKER</option>
              </select>
            </div>
          </section>

          <section className={sectionCls}>
            <div className="flex items-center gap-3 mb-2">
               <LayoutGrid className="w-4 h-4 text-emerald-500" />
               <p className="text-xs font-medium text-muted-foreground opacity-50">Seating</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Total Seats</label>
                <input type="number" value={form.totalSeats} onChange={(e) => handleChange("totalSeats", parseInt(e.target.value))} min="1" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Price (৳)</label>
                <input type="number" value={form.pricePerSeat} onChange={(e) => handleChange("pricePerSeat", parseInt(e.target.value))} min="1" className={inputCls} />
              </div>
            </div>
          </section>

          <section className={sectionCls}>
             <div className="flex items-center gap-3 mb-2">
               <Zap className="w-4 h-4 text-amber-500" />
               <p className="text-xs font-medium text-muted-foreground opacity-50">Pricing & Type</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-xs font-semibold text-amber-600 pb-2 border-b border-border/50">VIP Seats</p>
                <div>
                  <label className={labelCls}>Price Per Seat</label>
                  <input type="number" value={form.vipSeats || ""} onChange={(e) => handleChange("vipSeats", parseInt(e.target.value) || 0)} min="0" placeholder="0" className={inputCls} />
                </div>
                <AnimatePresence>
                  {form.vipSeats > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <label className={labelCls}>VIP Price (৳)</label>
                      <input type="number" value={form.vipPrice || ""} onChange={(e) => handleChange("vipPrice", parseInt(e.target.value) || 0)} min="1" placeholder="0" className={inputCls} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-6">
                 <p className="text-xs font-semibold text-blue-600 pb-2 border-b border-border/50">Deluxe Seats</p>
                <div>
                  <label className={labelCls}>Deluxe Count</label>
                  <input type="number" value={form.deluxeSeats || ""} onChange={(e) => handleChange("deluxeSeats", parseInt(e.target.value) || 0)} min="0" placeholder="0" className={inputCls} />
                </div>
                <AnimatePresence>
                  {form.deluxeSeats > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <label className={labelCls}>Deluxe Price (৳)</label>
                      <input type="number" value={form.deluxePrice || ""} onChange={(e) => handleChange("deluxePrice", parseInt(e.target.value) || 0)} min="1" placeholder="0" className={inputCls} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-between p-8 bg-muted/30 rounded-[32px] border border-border/50">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 shadow-xl ${form.isActive ? 'bg-slate-900 text-emerald-500 shadow-emerald-500/10' : 'bg-muted text-muted-foreground'}`}>
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-none mb-1">Status</p>
                <p className="text-xs font-medium text-muted-foreground opacity-60 leading-none">{form.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
            <button onClick={() => handleChange("isActive", !form.isActive)} className={`w-14 h-8 rounded-full transition-all duration-500 relative ${form.isActive ? 'bg-emerald-500' : 'bg-muted-foreground/20'}`}>
               <motion.div animate={{ x: form.isActive ? 28 : 4 }} className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl" />
            </button>
          </section>
        </div>

        <div className="px-10 py-8 border-t border-border/50 flex gap-6 shrink-0 bg-card">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1 border-border text-muted-foreground hover:bg-muted hover:text-foreground h-14 rounded-2xl font-semibold text-base transition-all">
            Cancel
          </Button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading} className="flex-[1.5] bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold h-14 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 text-base shadow-xl shadow-slate-900/20">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />}
            {loading ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}