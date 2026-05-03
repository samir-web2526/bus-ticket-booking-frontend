"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateUser } from "@/src/services/user.service";

// ─── Styles ───────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-white/5 border border-white/20 text-white rounded-xl h-11 px-3 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20 transition-colors placeholder:text-slate-600";

const disabledInputCls =
  "w-full bg-white/5 border border-white/10 text-slate-400 rounded-xl h-11 px-3 cursor-not-allowed opacity-60";

// ─── Types ────────────────────────────────────────────────────────────────

interface Passenger {
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
}

interface EditPassengerModalProps {
  passenger: Passenger;
  open: boolean;
  onClose: () => void;
  onUpdated: (p: Passenger) => void;
}

// ─── Component ────────────────────────────────────────────────────────────

export default function EditPassengerModal({
  passenger,
  open,
  onClose,
  onUpdated,
}: EditPassengerModalProps) {
  const [form, setForm] = useState({
    name: passenger.name || "",
    email: passenger.email || "",
    phone: passenger.phone || "",
    status: passenger.status || "ACTIVE",
    isVerified: passenger.isVerified ?? false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: passenger.name || "",
        email: passenger.email || "",
        phone: passenger.phone || "",
        status: passenger.status || "ACTIVE",
        isVerified: passenger.isVerified ?? false,
      });
    }
  }, [open, passenger]);

  // ✅ FIXED: strict typing (string | boolean)
  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        email: form.email,
        phone: form.phone,
        status: form.status,
        isVerified: form.isVerified,
      };

      const res = await updateUser(passenger.id, payload);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Passenger updated successfully!");

      onUpdated({
        ...passenger,
        email: form.email,
        phone: form.phone,
        status: form.status,
        isVerified: form.isVerified,
      });

      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[#050d1a] border border-white/10 text-white max-w-lg rounded-3xl p-0 overflow-hidden shadow-2xl">

        <DialogHeader className="px-8 pt-8 pb-5 border-b border-white/10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amber-400 text-xs font-semibold uppercase mb-1">
              — Edit Passenger
            </p>
            <DialogTitle className="text-white font-black text-2xl">
              Update <span className="text-amber-400">Passenger</span>
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-4">

          {/* Name */}
          <div>
            <label className="text-slate-400 text-sm flex items-center gap-2">
              <Lock className="w-3 h-3" /> Full Name
            </label>
            <input disabled value={form.name} className={disabledInputCls} />
          </div>

          {/* Email */}
          <div>
            <label className="text-amber-400 text-sm">Email</label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-amber-400 text-sm">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-amber-400 text-sm">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={inputCls}
            >
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>

          {/* Verified */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isVerified}
              onChange={(e) => handleChange("isVerified", e.target.checked)}
              className="w-4 h-4 accent-amber-400"
            />
            <span className="text-sm text-slate-300">
              {form.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>

        </div>

        <DialogFooter className="px-8 py-5 border-t border-white/10 gap-3">
          <Button onClick={onClose} disabled={loading} className="flex-1">
            Cancel
          </Button>

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-amber-400 text-black rounded-xl py-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Save Changes
              </>
            )}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}