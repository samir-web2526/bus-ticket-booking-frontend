"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateUser } from "@/src/services/user.service";

const inputCls = "w-full bg-white border border-gray-200 text-gray-900 rounded-xl h-11 px-3 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors placeholder:text-gray-300";
const disabledInputCls = "w-full bg-gray-50 border border-gray-100 text-gray-400 rounded-xl h-11 px-3 cursor-not-allowed opacity-60";

export interface UpdateOperatorPayload {
  email?: string;
  phone?: string;
  status?: "ACTIVE" | "BLOCKED" | "DELETED";
  companyName?: string;
  address?: string;
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

      toast.success("Operator updated successfully!");

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
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent aria-describedby={undefined} className="bg-white border border-gray-200 text-gray-900 max-w-lg rounded-3xl p-0 overflow-hidden shadow-xl">
        <DialogHeader className="px-8 pt-8 pb-5 border-b border-gray-100 relative">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">— Edit Operator</p>
            <DialogTitle className="text-gray-900 font-black text-2xl">Update <span className="text-gray-500">Operator</span></DialogTitle>
            <p className="text-gray-400 text-sm mt-2">Edit operator information below</p>
          </motion.div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-6 relative max-h-96 overflow-y-auto">
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-gray-100">Contact Information</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><Lock className="w-3 h-3" /> Full Name</label>
                <input type="text" value={form.name} disabled className={disabledInputCls} />
                <p className="text-gray-400 text-xs mt-1">Contact support to change this field</p>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Email Address</label>
                <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="email@example.com" className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Phone Number</label>
                <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="01XXXXXXXXX" className={inputCls} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-gray-100">Company Information</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Company Name</label>
                <input type="text" value={form.companyName} onChange={(e) => handleChange("companyName", e.target.value)} placeholder="Company name" className={inputCls} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><Lock className="w-3 h-3" /> Trade License</label>
                <input type="text" value={form.tradeLicense} disabled className={disabledInputCls} />
                <p className="text-gray-400 text-xs mt-1">Contact support to change this field</p>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><Lock className="w-3 h-3" /> National ID (NID)</label>
                <input type="text" value={form.nid} disabled className={disabledInputCls} />
                <p className="text-gray-400 text-xs mt-1">Contact support to change this field</p>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Address</label>
                <textarea value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Street address, city, district..." className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors placeholder:text-gray-300" rows={3} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-gray-100">Status</p>
            <div>
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Account Status</label>
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className={inputCls}>
                <option value="ACTIVE">Active</option>
                <option value="BLOCKED">Blocked</option>
                <option value="DELETED">Deleted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2">Verification</label>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={form.isVerified} onChange={(e) => handleChange("isVerified", e.target.checked)} className="w-4 h-4 accent-gray-900" />
              <span className="text-sm text-gray-600">{form.isVerified ? "Verified" : "Not Verified"}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-5 border-t border-gray-100 gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1 border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:text-gray-900 rounded-xl h-11">
            Cancel
          </Button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading} className="flex-1 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Zap className="w-4 h-4" /> Save Changes</>}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}