"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateUser, User } from "@/src/services/user.service";

const inputCls = "w-full bg-white border border-gray-200 text-gray-900 rounded-xl h-11 px-3 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors placeholder:text-gray-300";
const disabledInputCls = "w-full bg-gray-50 border border-gray-100 text-gray-400 rounded-xl h-11 px-3 cursor-not-allowed opacity-60";

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
      toast.success('Passenger updated successfully!');
      onUpdated(res.data);
      onClose();
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-white border border-gray-200 text-gray-900 max-w-lg rounded-3xl p-0 overflow-hidden shadow-xl">
        <DialogHeader className="px-8 pt-8 pb-5 border-b border-gray-100">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">— Edit Passenger</p>
            <DialogTitle className="text-gray-900 font-black text-2xl">Update <span className="text-gray-500">Passenger</span></DialogTitle>
          </motion.div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-4">
          <div>
            <label className="text-gray-400 text-sm flex items-center gap-2"><Lock className="w-3 h-3" /> Full Name</label>
            <input disabled value={form.name} className={disabledInputCls} />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-semibold block mb-1">Email</label>
            <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-semibold block mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-semibold block mb-1">Status</label>
            <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className={inputCls}>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={form.isVerified} onChange={(e) => handleChange("isVerified", e.target.checked)} className="w-4 h-4 accent-gray-900" />
            <span className="text-sm text-gray-600">{form.isVerified ? "Verified" : "Not Verified"}</span>
          </div>
        </div>

        <DialogFooter className="px-8 py-5 border-t border-gray-100 gap-3">
          <Button onClick={onClose} disabled={loading} variant="outline" className="flex-1 border-gray-200 text-gray-600 rounded-xl h-11">
            Cancel
          </Button>
          <motion.button onClick={handleSubmit} disabled={loading} className="flex-1 bg-gray-900 hover:bg-gray-700 text-white rounded-xl py-2 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Zap className="w-4 h-4" /> Save Changes</>}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}