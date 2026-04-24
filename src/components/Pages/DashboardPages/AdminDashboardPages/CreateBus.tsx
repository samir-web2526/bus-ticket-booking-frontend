
"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createBus } from "@/src/services/buses.service";
import { Bus, Zap } from "lucide-react";

const busSchema = z
  .object({
    name: z.string().min(1, "Bus name is required"),
    number: z.string().min(1, "Bus number is required"),
    type: z.enum(["AC", "NON_AC"]),
    totalSeats: z.coerce.number().min(1, "Minimum 1 seat required"),
    vipSeats: z.coerce.number().min(0),
    vipPrice: z.coerce.number().min(0),
    deluxeSeats: z.coerce.number().min(0),
    deluxePrice: z.coerce.number().min(0),
    pricePerSeat: z.coerce.number().min(1, "Price must be at least 1"),
    isActive: z.boolean(),
    operatorId: z.string().min(1, "Operator is required"), // ✅
  })
  .refine(
    (data) => data.vipSeats + data.deluxeSeats <= data.totalSeats,
    {
      message: "VIP + Deluxe seats cannot exceed total seats",
      path: ["vipSeats"],
    }
  );

type BusFormValues = z.infer<typeof busSchema>;

interface Props {
  operators: { id: string; name: string; email: string }[]; // ✅
}

export default function CreateBus({ operators = [] }: Props) {
  const form = useForm<BusFormValues>({
    resolver: zodResolver(busSchema),
    defaultValues: {
      name: "",
      number: "",
      type: "NON_AC",
      totalSeats: 40,
      vipSeats: 0,
      vipPrice: 0,
      deluxeSeats: 0,
      deluxePrice: 0,
      pricePerSeat: 200,
      isActive: true,
      operatorId: "", // ✅
    },
  });

  const { watch, handleSubmit, register, formState } = form;
  const values = watch();

  const seats = useMemo(() => {
    const arr = [];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const vip = Number(values.vipSeats);
    const deluxe = Number(values.deluxeSeats);
    const total = Number(values.totalSeats);

    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / 4);
      const col = (i % 4) + 1;

      let type = "STANDARD";
      if (i < vip) type = "VIP";
      else if (i < vip + deluxe) type = "DELUXE";

      arr.push({ label: `${letters[row]}${col}`, type });
    }

    return arr;
  }, [values]);

  const vipCount = seats.filter((s) => s.type === "VIP").length;
  const deluxeCount = seats.filter((s) => s.type === "DELUXE").length;
  const standardCount = seats.filter((s) => s.type === "STANDARD").length;

  const onSubmit = async (data: BusFormValues) => {
    const res = await createBus(data);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Bus created successfully!");
      form.reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">Create Bus</h1>
          <p className="text-slate-400 text-lg">Add a new bus with seat configuration</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORM */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-6">Bus Details</h2>
              <div className="space-y-5">

                <div>
                  <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Bus Name</label>
                  <Input placeholder="e.g., Sky Line Express" {...register("name")}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11" />
                  {formState.errors.name && <p className="text-red-400 text-xs mt-1">{formState.errors.name.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Bus Number</label>
                  <Input placeholder="e.g., SLE-001" {...register("number")}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11" />
                  {formState.errors.number && <p className="text-red-400 text-xs mt-1">{formState.errors.number.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Bus Type</label>
                  <select {...register("type")}
                    className="w-full bg-white/5 border border-white/20 text-white rounded-xl h-11 px-3 focus:border-amber-400">
                    <option value="NON_AC" className="bg-slate-900">NON AC</option>
                    <option value="AC" className="bg-slate-900">AC</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">Total Seats</label>
                  <Input type="number" placeholder="40" {...register("totalSeats")}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11" />
                  {formState.errors.totalSeats && <p className="text-red-400 text-xs mt-1">{formState.errors.totalSeats.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-bold text-yellow-400 uppercase tracking-widest block mb-3">VIP Seats</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Count" {...register("vipSeats")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11" />
                    <Input type="number" placeholder="Price" {...register("vipPrice")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11" />
                  </div>
                  {formState.errors.vipSeats && <p className="text-red-400 text-xs mt-1">{formState.errors.vipSeats.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-bold text-blue-400 uppercase tracking-widest block mb-3">Deluxe Seats</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Count" {...register("deluxeSeats")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11" />
                    <Input type="number" placeholder="Price" {...register("deluxePrice")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-green-400 uppercase tracking-widest block mb-2">Standard Price</label>
                  <Input type="number" placeholder="200" {...register("pricePerSeat")}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11" />
                  {formState.errors.pricePerSeat && <p className="text-red-400 text-xs mt-1">{formState.errors.pricePerSeat.message}</p>}
                </div>

                {/* ✅ Operator Select */}
                <div>
                  <label className="text-sm font-bold text-purple-400 uppercase tracking-widest block mb-2">Operator</label>
                  <select {...register("operatorId")}
                    className="w-full bg-white/5 border border-white/20 text-white rounded-xl h-11 px-3 focus:border-amber-400">
                    <option value="" className="bg-slate-900">Select an operator</option>
                    {operators.map((op) => (
                      <option key={op.id} value={op.id} className="bg-slate-900">
                        {op.name} ({op.email})
                      </option>
                    ))}
                  </select>
                  {formState.errors.operatorId && (
                    <p className="text-red-400 text-xs mt-1">{formState.errors.operatorId.message}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit(onSubmit)}
                  disabled={formState.isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider mt-6"
                >
                  {formState.isSubmitting ? (
                    <><Zap className="w-4 h-4 animate-spin" /> Creating...</>
                  ) : (
                    <><Bus className="w-4 h-4" /> Create Bus</>
                  )}
                </motion.button>

              </div>
            </div>
          </motion.div>

          {/* SEAT PREVIEW */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-8">Seat Preview</h2>

              <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, minmax(40px, 1fr))' }}>
                  {seats.map((seat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`p-2 text-center text-xs font-bold rounded-lg border-2 transition-colors ${
                        seat.type === "VIP"
                          ? "bg-yellow-400/20 border-yellow-400 text-yellow-400"
                          : seat.type === "DELUXE"
                          ? "bg-blue-400/20 border-blue-400 text-blue-400"
                          : "bg-green-400/20 border-green-400 text-green-400"
                      }`}
                    >
                      {seat.label}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-md mx-auto mb-2" />
                  <p className="text-xs text-yellow-400 font-bold text-center">VIP ({vipCount})</p>
                  <p className="text-xs text-slate-400 text-center mt-1">৳{values.vipPrice || 0}</p>
                </div>
                <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-3">
                  <div className="w-4 h-4 bg-blue-400 rounded-md mx-auto mb-2" />
                  <p className="text-xs text-blue-400 font-bold text-center">Deluxe ({deluxeCount})</p>
                  <p className="text-xs text-slate-400 text-center mt-1">৳{values.deluxePrice || 0}</p>
                </div>
                <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
                  <div className="w-4 h-4 bg-green-400 rounded-md mx-auto mb-2" />
                  <p className="text-xs text-green-400 font-bold text-center">Standard ({standardCount})</p>
                  <p className="text-xs text-slate-400 text-center mt-1">৳{values.pricePerSeat || 0}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Total Seats:</span>
                  <span className="text-white font-bold">{values.totalSeats}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>VIP Seats:</span>
                  <span className="text-yellow-400 font-bold">{vipCount}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Deluxe Seats:</span>
                  <span className="text-blue-400 font-bold">{deluxeCount}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Standard Seats:</span>
                  <span className="text-green-400 font-bold">{standardCount}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}