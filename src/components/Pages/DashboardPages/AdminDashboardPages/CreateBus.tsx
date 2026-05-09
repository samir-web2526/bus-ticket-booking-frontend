/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createBus } from "@/src/services/buses.service";
import { Bus, Zap } from "lucide-react";

const busSchema = z.object({
  name: z.string().min(1, "Bus name is required"),
  number: z.string().min(1, "Bus number is required"),
  type: z.enum(["AC", "NON_AC"]),
  totalSeats: z.coerce.number().min(1),
  vipSeats: z.coerce.number().min(0),
  vipPrice: z.coerce.number().min(0),
  deluxeSeats: z.coerce.number().min(0),
  deluxePrice: z.coerce.number().min(0),
  pricePerSeat: z.coerce.number().min(1),
  isActive: z.boolean(),
  operatorId: z.string().min(1, "Operator is required"),
});

type BusFormValues = z.infer<typeof busSchema>;

interface Props {
  operators: { id: string; name: string; email: string }[];
}

export default function CreateBus({ operators = [] }: Props) {
  const form = useForm<BusFormValues>({
    resolver: zodResolver(busSchema) as any,
    defaultValues: {
      name: "", number: "", type: "NON_AC",
      totalSeats: 40, vipSeats: 0, vipPrice: 0,
      deluxeSeats: 0, deluxePrice: 0, pricePerSeat: 200,
      isActive: true, operatorId: "",
    },
  });
  const { handleSubmit, register, formState, control } = form;
  const values = useWatch({ control });

  const seats = useMemo(() => {
    const arr = [];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const vip = Number(values.vipSeats || 0);
    const deluxe = Number(values.deluxeSeats || 0);
    const total = Number(values.totalSeats || 0);
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
    if (res.error) { toast.error(res.error); }
    else { toast.success("Bus created successfully!"); form.reset(); }
  };

  const inputCls = "bg-white border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-gray-400 focus:ring-gray-200 rounded-xl h-11";
  const selectCls = "w-full bg-white border border-gray-200 text-gray-900 rounded-xl h-11 px-3 focus:border-gray-400 focus:outline-none";
  const labelCls = "text-sm font-bold text-gray-500 uppercase tracking-widest block mb-2";

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden p-6 lg:p-12">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">Create Bus</h1>
          <p className="text-gray-400 text-lg">Add a new bus with seat configuration</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Bus Details</h2>
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Bus Name</label>
                  <Input placeholder="e.g., Sky Line Express" {...register("name")} className={inputCls} />
                  {formState.errors.name && <p className="text-red-500 text-xs mt-1">{formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Bus Number</label>
                  <Input placeholder="e.g., SLE-001" {...register("number")} className={inputCls} />
                  {formState.errors.number && <p className="text-red-500 text-xs mt-1">{formState.errors.number.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Bus Type</label>
                  <select {...register("type")} className={selectCls}>
                    <option value="NON_AC">NON AC</option>
                    <option value="AC">AC</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Total Seats</label>
                  <Input type="number" placeholder="40" {...register("totalSeats")} className={inputCls} />
                </div>
                <div>
                  <label className="text-sm font-bold text-amber-600 uppercase tracking-widest block mb-3">VIP Seats</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Count" {...register("vipSeats")} className={inputCls} />
                    <Input type="number" placeholder="Price" {...register("vipPrice")} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-600 uppercase tracking-widest block mb-3">Deluxe Seats</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Count" {...register("deluxeSeats")} className={inputCls} />
                    <Input type="number" placeholder="Price" {...register("deluxePrice")} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-green-600 uppercase tracking-widest block mb-2">Standard Price</label>
                  <Input type="number" placeholder="200" {...register("pricePerSeat")} className={inputCls} />
                </div>
                <div>
                  <label className="text-sm font-bold text-purple-600 uppercase tracking-widest block mb-2">Operator</label>
                  <select {...register("operatorId")} className={selectCls}>
                    <option value="">Select an operator</option>
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>{op.name} ({op.email})</option>
                    ))}
                  </select>
                  {formState.errors.operatorId && <p className="text-red-500 text-xs mt-1">{formState.errors.operatorId.message}</p>}
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit(onSubmit)} disabled={formState.isSubmitting} className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider mt-6">
                  {formState.isSubmitting ? <><Zap className="w-4 h-4 animate-spin" /> Creating...</> : <><Bus className="w-4 h-4" /> Create Bus</>}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-8">Seat Preview</h2>

              <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto">
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, minmax(40px, 1fr))' }}>
                  {seats.map((seat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                      className={`p-2 text-center text-xs font-bold rounded-lg border-2 transition-colors ${seat.type === "VIP" ? "bg-amber-50 border-amber-300 text-amber-700" : seat.type === "DELUXE" ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-green-50 border-green-300 text-green-700"}`}>
                      {seat.label}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="w-4 h-4 bg-amber-400 rounded-md mx-auto mb-2" />
                  <p className="text-xs text-amber-700 font-bold text-center">VIP ({vipCount})</p>
                  <p className="text-xs text-gray-400 text-center mt-1">৳{values.vipPrice || 0}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="w-4 h-4 bg-blue-400 rounded-md mx-auto mb-2" />
                  <p className="text-xs text-blue-700 font-bold text-center">Deluxe ({deluxeCount})</p>
                  <p className="text-xs text-gray-400 text-center mt-1">৳{values.deluxePrice || 0}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="w-4 h-4 bg-green-400 rounded-md mx-auto mb-2" />
                  <p className="text-xs text-green-700 font-bold text-center">Standard ({standardCount})</p>
                  <p className="text-xs text-gray-400 text-center mt-1">৳{values.pricePerSeat || 0}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-400"><span>Total Seats:</span><span className="text-gray-900 font-bold">{values.totalSeats}</span></div>
                <div className="flex justify-between text-sm text-gray-400"><span>VIP Seats:</span><span className="text-amber-600 font-bold">{vipCount}</span></div>
                <div className="flex justify-between text-sm text-gray-400"><span>Deluxe Seats:</span><span className="text-blue-600 font-bold">{deluxeCount}</span></div>
                <div className="flex justify-between text-sm text-gray-400"><span>Standard Seats:</span><span className="text-green-600 font-bold">{standardCount}</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}