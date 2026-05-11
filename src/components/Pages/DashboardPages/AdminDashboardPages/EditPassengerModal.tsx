"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap, Lock, X, Mail, Phone, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateUser, User } from "@/src/services/user.service";

interface EditPassengerModalProps {
  passenger: User;
  open: boolean;
  onClose: () => void;
  onUpdated: (p: User) => void;
}

export default function EditPassengerModal({ passenger, open, onClose, onUpdated }: EditPassengerModalProps) {
  const [form, setForm] = useState({
    name: passenger.name || "",
    email: passenger.email || "",
    phone: passenger.phone || "",
    status: passenger.status || "ACTIVE",
    isVerified: passenger.isVerified ?? false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await updateUser(passenger.id, {
        email: form.email,
        phone: form.phone,
        status: form.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
        isVerified: form.isVerified,
      });

      if (res.error || !res.data) { toast.error(res.error ?? 'Failed to update'); return; }
      toast.success('Passenger profile synchronized successfully!');
      onUpdated(res.data);
      onClose();
    } catch { toast.error('System synchronization failed'); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-muted/50 border border-border text-foreground rounded-2xl h-14 px-4 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 placeholder:text-muted-foreground/50 text-base font-normal";
  const disabledInputCls = "w-full bg-muted/20 border border-border/30 text-muted-foreground rounded-2xl h-14 px-4 cursor-not-allowed opacity-60 text-base font-normal";
  const labelCls = "text-sm font-semibold text-amber-600 block mb-3 ml-1";
  const sectionCls = "p-8 bg-muted/20 border border-border/50 rounded-[32px] space-y-6";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-none max-w-xl rounded-[48px] p-0 overflow-hidden shadow-2xl shadow-slate-900/20 flex flex-col">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[100px] -z-10" />
        
        <DialogHeader className="px-10 pt-10 pb-8 border-b border-border/50 relative shrink-0">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-amber-600 text-sm font-medium tracking-wide mb-2">Edit Passenger</p>
              <DialogTitle className="text-foreground font-bold text-3xl tracking-tight leading-none">
                Edit <span className="text-amber-600">Passenger</span>
              </DialogTitle>
            </motion.div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl hover:bg-muted text-muted-foreground transition-all duration-500">
               <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-10 py-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
          <section className={sectionCls}>
             <div className="flex items-center gap-3 mb-2">
               <UserCheck className="w-4 h-4 text-amber-500" />
               <p className="text-xs font-medium text-muted-foreground opacity-50">Identity</p>
            </div>
            <div>
              <label className={labelCls}>Name</label>
              <div className="relative">
                <input disabled value={form.name} className={disabledInputCls} />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Email Matrix</label>
                <div className="relative">
                   <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={inputCls} placeholder="EMAIL@DOMAIN.COM" />
                   <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Phone Link</label>
                <div className="relative">
                   <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputCls} placeholder="01XXXXXXXXX" />
                   <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={sectionCls}>
               <p className="text-xs font-medium text-muted-foreground opacity-50 mb-2">Account Status</p>
               <div>
                  <label className={labelCls}>Status</label>
                  <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className={inputCls}>
                    <option value="ACTIVE">ACTIVE CLEARANCE</option>
                    <option value="BLOCKED">REVOKED / BLOCKED</option>
                    <option value="DELETED">DECOMMISSIONED</option>
                  </select>
               </div>
            </div>

            <div className={`${sectionCls} flex flex-col justify-center`}>
               <p className="text-xs font-medium text-muted-foreground opacity-50 mb-4">Verification</p>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 shadow-xl ${form.isVerified ? 'bg-slate-900 text-emerald-500 shadow-emerald-500/10' : 'bg-muted text-muted-foreground'}`}>
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                     <p className="text-sm font-semibold text-foreground tracking-tight">{form.isVerified ? "Verified" : "Unverified"}</p>
                  </div>
                  <button onClick={() => handleChange("isVerified", !form.isVerified)} className={`w-14 h-8 rounded-full transition-all duration-500 relative ${form.isVerified ? 'bg-emerald-500' : 'bg-muted-foreground/20'}`}>
                    <motion.div animate={{ x: form.isVerified ? 28 : 4 }} className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl" />
                  </button>
               </div>
            </div>
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