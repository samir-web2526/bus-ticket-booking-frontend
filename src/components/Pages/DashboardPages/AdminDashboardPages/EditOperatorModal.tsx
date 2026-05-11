"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, Lock, X, Mail, Phone, Building2, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateUser } from "@/src/services/user.service";

export interface UpdateOperatorPayload {
  email?: string;
  phone?: string;
  status?: "ACTIVE" | "BLOCKED" | "DELETED";
  companyName?: string;
  address?: string;
  isVerified?: boolean;
}

interface OperatorProfile {
  id: string;
  userId: string;
  companyName: string;
  tradeLicense: string;
  nid: string;
  address: string;
}

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  isVerified: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  operatorProfile?: OperatorProfile | null | undefined;
}

interface EditOperatorModalProps {
  operator: Operator;
  open: boolean;
  onClose: () => void;
  onUpdated: (op: Operator) => void;
}

export default function EditOperatorModal({ operator, open, onClose, onUpdated }: EditOperatorModalProps) {
  const [form, setForm] = useState({
    name: operator.name || "",
    email: operator.email || "",
    phone: operator.phone || "",
    companyName: operator.operatorProfile?.companyName || "",
    tradeLicense: operator.operatorProfile?.tradeLicense || "",
    nid: operator.operatorProfile?.nid || "",
    address: operator.operatorProfile?.address || "",
    status: operator.status || "BLOCKED",
    isVerified: operator.isVerified ?? false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: operator.name || "",
        email: operator.email || "",
        phone: operator.phone || "",
        companyName: operator.operatorProfile?.companyName || "",
        tradeLicense: operator.operatorProfile?.tradeLicense || "",
        nid: operator.operatorProfile?.nid || "",
        address: operator.operatorProfile?.address || "",
        status: operator.status || "BLOCKED",
        isVerified: operator.isVerified ?? false,
      });
    }
  }, [open, operator]);

  const handleChange = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload: UpdateOperatorPayload = {
        ...(form.email.trim() && { email: form.email }),
        ...(form.phone.trim() && { phone: form.phone }),
        ...(form.status && { status: form.status as UpdateOperatorPayload["status"] }),
        ...(form.isVerified !== undefined && { isVerified: form.isVerified }),
        ...(form.companyName.trim() && { companyName: form.companyName }),
        ...(form.address.trim() && { address: form.address }),
      };

      const res = await updateUser(operator.id, payload);
      if (res.error) { toast.error(res.error); return; }

      toast.success("Operator profile synchronized successfully!");

      const updatedOperator: Operator = {
        ...operator,
        ...(form.email.trim() && { email: form.email }),
        ...(form.phone.trim() && { phone: form.phone }),
        status: form.status,
        isVerified: form.isVerified,
        operatorProfile: operator.operatorProfile ? {
          ...operator.operatorProfile,
          ...(form.companyName.trim() && { companyName: form.companyName }),
          ...(form.address.trim() && { address: form.address }),
        } : null,
      };

      onUpdated(updatedOperator);
      onClose();
    } catch { toast.error("System synchronization failed"); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-muted/50 border border-border text-foreground rounded-2xl h-14 px-4 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 placeholder:text-muted-foreground/30 text-sm font-black uppercase tracking-tight";
  const disabledInputCls = "w-full bg-muted/20 border border-border/30 text-muted-foreground rounded-2xl h-14 px-4 cursor-not-allowed opacity-60 text-sm font-black uppercase tracking-tight";
  const labelCls = "text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] block mb-3 ml-1";
  const sectionCls = "p-8 bg-muted/20 border border-border/50 rounded-[32px] space-y-6";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent aria-describedby={undefined} className="bg-card border-none max-w-2xl rounded-[48px] p-0 overflow-hidden shadow-2xl shadow-slate-900/20 flex flex-col h-[90vh]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[100px] -z-10" />
        
        <DialogHeader className="px-10 pt-10 pb-8 border-b border-border/50 relative shrink-0">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-3 italic">— Authority Management</p>
              <DialogTitle className="text-foreground font-black text-4xl font-heading uppercase italic tracking-tighter leading-none">
                Modify <span className="text-amber-500">Operator</span>
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
               <UserCheck className="w-4 h-4 text-amber-500" />
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-40">Personnel Profile</p>
            </div>
            <div>
              <label className={labelCls}>Authorized Name</label>
              <div className="relative">
                 <input type="text" value={form.name} disabled className={disabledInputCls} />
                 <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              </div>
              <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mt-2 ml-1 italic">Security Locked: Contact Admin to Change</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Direct Channel (Email)</label>
                <div className="relative">
                  <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="EMAIL@DOMAIN.COM" className={inputCls} />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Direct Line (Phone)</label>
                <div className="relative">
                  <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="01XXXXXXXXX" className={inputCls} />
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
            </div>
          </section>

          <section className={sectionCls}>
            <div className="flex items-center gap-3 mb-2">
               <Building2 className="w-4 h-4 text-blue-500" />
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-40">Corporate Entity Details</p>
            </div>
            <div>
              <label className={labelCls}>Corporate Registry Name</label>
              <input type="text" value={form.companyName} onChange={(e) => handleChange("companyName", e.target.value)} placeholder="CORPORATE ENTITY NAME" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Trade License Node</label>
                <div className="relative">
                  <input type="text" value={form.tradeLicense} disabled className={disabledInputCls} />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
              <div>
                <label className={labelCls}>National ID Vector (NID)</label>
                <div className="relative">
                  <input type="text" value={form.nid} disabled className={disabledInputCls} />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls}>Operational Headquarters</label>
              <div className="relative">
                <textarea value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="STREET ADDRESS, CITY, DISTRICT..." className="w-full bg-muted/50 border border-border text-foreground rounded-2xl px-4 py-4 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 placeholder:text-muted-foreground/30 text-sm font-black uppercase tracking-tight" rows={3} />
                <MapPin className="absolute right-4 top-4 w-4 h-4 text-muted-foreground/30" />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-muted/20 border border-border/50 rounded-[32px] space-y-6">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-40 mb-2">Authority Status</p>
               <div>
                  <label className={labelCls}>Access Level</label>
                  <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className={inputCls}>
                    <option value="ACTIVE">ACTIVE CLEARANCE</option>
                    <option value="BLOCKED">REVOKED / BLOCKED</option>
                    <option value="DELETED">DECOMMISSIONED</option>
                  </select>
               </div>
            </div>

            <div className="p-8 bg-muted/20 border border-border/50 rounded-[32px] flex flex-col justify-center">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-40 mb-4">Identity Verification</p>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 shadow-xl ${form.isVerified ? 'bg-slate-900 text-emerald-500 shadow-emerald-500/10' : 'bg-muted text-muted-foreground'}`}>
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                     <p className="text-xs font-black text-foreground font-heading tracking-tight italic uppercase">{form.isVerified ? "VERIFIED" : "UNVERIFIED"}</p>
                  </div>
                  <button onClick={() => handleChange("isVerified", !form.isVerified)} className={`w-14 h-8 rounded-full transition-all duration-500 relative ${form.isVerified ? 'bg-emerald-500' : 'bg-muted-foreground/20'}`}>
                    <motion.div animate={{ x: form.isVerified ? 28 : 4 }} className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl" />
                  </button>
               </div>
            </div>
          </section>
        </div>

        <div className="px-10 py-8 border-t border-border/50 flex gap-6 shrink-0 bg-card">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1 border-border text-muted-foreground hover:bg-muted hover:text-foreground h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
            Cancel Modification
          </Button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading} className="flex-[1.5] bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black h-16 rounded-2xl transition-all duration-500 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/20">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />}
            {loading ? "Synchronizing..." : "Commit Entity Changes"}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}