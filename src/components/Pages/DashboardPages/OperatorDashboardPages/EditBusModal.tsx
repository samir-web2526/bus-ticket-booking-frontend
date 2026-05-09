"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateBus } from "@/src/services/buses.service";

const inputCls =
  "w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl h-11 px-3 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors placeholder:text-gray-400";

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

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!form.name.trim()) { toast.error("Bus name is required"); return; }
      if (!form.number.trim()) { toast.error("Bus number is required"); return; }
      if (form.pricePerSeat <= 0) { toast.error("Price per seat must be greater than 0"); return; }

      const res = await updateBus(bus.id, {
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
      });

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
      <DialogContent className="bg-white border border-gray-200 text-gray-900 max-w-lg rounded-3xl p-0 overflow-hidden shadow-xl">
        <DialogHeader className="px-8 pt-8 pb-5 border-b border-gray-100 relative">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">— Edit Bus</p>
            <DialogTitle className="text-gray-900 font-black text-2xl">
              Update <span className="text-gray-500">Bus</span>
            </DialogTitle>
            <p className="text-gray-400 text-sm mt-2">Edit bus information below</p>
          </motion.div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-6 relative max-h-96 overflow-y-auto">

          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-gray-100">
              Basic Information
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Bus Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., Hanif Express"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Bus Number</label>
                <input
                  type="text"
                  value={form.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  placeholder="e.g., h-1007"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Bus Type</label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className={inputCls}
                >
                  <option value="AC">AC</option>
                  <option value="NON_AC">Non-AC</option>
                  <option value="SLEEPER">Sleeper</option>
                  <option value="DOUBLE_DECKER">Double Decker</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-gray-100">
              Seating &amp; Pricing
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Total Seats</label>
                <input
                  type="number"
                  value={form.totalSeats}
                  onChange={(e) => handleChange("totalSeats", parseInt(e.target.value))}
                  min="1"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Price Per Seat (৳)</label>
                <input
                  type="number"
                  value={form.pricePerSeat}
                  onChange={(e) => handleChange("pricePerSeat", parseInt(e.target.value))}
                  min="1"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-gray-100">
              VIP Seats (Optional)
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">VIP Seats</label>
                <input
                  type="number"
                  value={form.vipSeats || ""}
                  onChange={(e) => handleChange("vipSeats", parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Number of VIP seats"
                  className={inputCls}
                />
              </div>
              {form.vipSeats > 0 && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">VIP Price (৳)</label>
                  <input
                    type="number"
                    value={form.vipPrice || ""}
                    onChange={(e) => handleChange("vipPrice", parseInt(e.target.value) || 0)}
                    min="1"
                    placeholder="VIP seat price"
                    className={inputCls}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-gray-100">
              Deluxe Seats (Optional)
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Deluxe Seats</label>
                <input
                  type="number"
                  value={form.deluxeSeats || ""}
                  onChange={(e) => handleChange("deluxeSeats", parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Number of deluxe seats"
                  className={inputCls}
                />
              </div>
              {form.deluxeSeats > 0 && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Deluxe Price (৳)</label>
                  <input
                    type="number"
                    value={form.deluxePrice || ""}
                    onChange={(e) => handleChange("deluxePrice", parseInt(e.target.value) || 0)}
                    min="1"
                    placeholder="Deluxe seat price"
                    className={inputCls}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-gray-100">
              Status
            </p>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 accent-gray-900"
              />
              <label htmlFor="isActive" className="text-gray-700 font-semibold text-sm">Bus is Active</label>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-5 border-t border-gray-100 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-900 rounded-xl h-11"
          >
            Cancel
          </Button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Zap className="w-4 h-4" /> Save Changes</>}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}