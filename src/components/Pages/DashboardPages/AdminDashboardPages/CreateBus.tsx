/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createBus } from "@/src/services/buses.service";
import { Bus, Zap, Users, Info, Settings, Layout, CheckCircle2, Navigation, Database, ShieldCheck, Activity } from "lucide-react";

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

  const inputCls = "bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:ring-amber-500/20 rounded-2xl h-14 transition-all duration-500 font-normal text-base";
  const selectCls = "w-full bg-muted/30 border border-border text-foreground rounded-2xl h-14 px-4 focus:border-amber-500 focus:outline-none transition-all duration-500 appearance-none font-normal text-base cursor-pointer";
  const labelCls = "text-sm font-semibold text-amber-600 block mb-3 ml-1";

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Bus Management</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Create <span className="text-amber-600">Bus</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-7">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.04] p-10 lg:p-16 relative overflow-hidden group">
              <div className="flex items-center gap-6 mb-12 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl group-hover:rotate-6 transition-transform duration-500">
                    <Settings className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold text-foreground tracking-tight">Bus Configuration</h2>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className={labelCls}>Bus Name</label>
                    <Input placeholder="Enter bus name" {...register("name")} className={inputCls} />
                    {formState.errors.name && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Bus Number</label>
                    <Input placeholder="Enter bus number" {...register("number")} className={inputCls} />
                    {formState.errors.number && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.number.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className={labelCls}>Environmental Unit</label>
                    <div className="relative">
                      <select {...register("type")} className={selectCls}>
                        <option value="NON_AC">STANDARD (NON-AC)</option>
                        <option value="AC">PREMIUM (AC)</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500/30">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Global Slot Capacity</label>
                    <Input type="number" placeholder="40" {...register("totalSeats")} className={inputCls} />
                  </div>
                </div>

                <div className="p-10 bg-muted/20 border border-border/50 rounded-[40px] space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full -mr-16 -mt-16" />
                  
                  <div className="space-y-6">
                    <label className="text-xs font-semibold text-amber-500 block flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Zap className="w-3 h-3" />
                       </div>
                       VIP Allocation & Yield
                    </label>
                    <div className="grid grid-cols-2 gap-8">
                      <Input type="number" placeholder="SLOT COUNT" {...register("vipSeats")} className={inputCls} />
                      <Input type="number" placeholder="YIELD/SLOT" {...register("vipPrice")} className={inputCls} />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <label className="text-xs font-semibold text-blue-500 block flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Layout className="w-3 h-3" />
                       </div>
                       Deluxe Allocation & Yield
                    </label>
                    <div className="grid grid-cols-2 gap-8">
                      <Input type="number" placeholder="SLOT COUNT" {...register("deluxeSeats")} className={inputCls} />
                      <Input type="number" placeholder="YIELD/SLOT" {...register("deluxePrice")} className={inputCls} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-xs font-semibold text-emerald-600 block flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3" />
                       </div>
                       Standard Operational Yield
                    </label>
                    <Input type="number" placeholder="200" {...register("pricePerSeat")} className={inputCls} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelCls}>Operator Authority Authorization</label>
                  <div className="relative">
                    <select {...register("operatorId")} className={selectCls}>
                      <option value="">SELECT AUTHORIZED OPERATOR</option>
                      {operators.map((op) => (
                        <option key={op.id} value={op.id}>{op.name.toUpperCase()} — {op.email}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  {formState.errors.operatorId && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.operatorId.message}</p>}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: '#f59e0b', color: '#fff' }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={handleSubmit(onSubmit)} 
                  disabled={formState.isSubmitting} 
                  className="w-full h-16 bg-slate-900 border border-slate-800 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-700 flex items-center justify-center gap-4 disabled:cursor-not-allowed text-base shadow-2xl shadow-slate-900/30 group/btn"
                >
                  {formState.isSubmitting ? <Activity className="w-6 h-6 animate-spin text-amber-500" /> : <Bus className="w-6 h-6 text-amber-500 group-hover/btn:text-white transition-colors" />}
                  {formState.isSubmitting ? "Creating..." : "Create Bus"}
                </motion.button>
              </div>
              
              {/* Corner Decor */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-500/[0.05] to-transparent rounded-br-[48px]" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5 sticky top-12">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.04] p-10 lg:p-16 relative overflow-hidden">
              <div className="flex items-center gap-6 mb-12 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-xl">
                    <Navigation className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold text-foreground tracking-tight">Seat Layout</h2>
              </div>

              <div className="mb-12 p-10 bg-muted/20 rounded-[48px] border border-border/50 relative z-10 backdrop-blur-xl">
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, minmax(45px, 1fr))' }}>
                  {seats.map((seat, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }} 
                      animate={{ opacity: 1, scale: 1, rotate: 0 }} 
                      transition={{ delay: i * 0.01, duration: 0.4 }}
                      className={`h-12 flex items-center justify-center text-sm font-semibold rounded-2xl border-2 transition-all duration-500 relative group/seat ${
                        seat.type === "VIP" 
                        ? "bg-amber-500 text-white border-amber-400 shadow-xl shadow-amber-500/30" 
                        : seat.type === "DELUXE" 
                          ? "bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-500/30" 
                          : "bg-white/80 border-border/50 text-muted-foreground hover:bg-muted transition-colors shadow-sm"
                      }`}
                    >
                      {seat.label}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover/seat:opacity-40 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-sm font-medium text-muted-foreground opacity-50">Bus Summary</p>
                   <div className="h-[1px] flex-1 bg-border/30 mx-6" />
                   <Database className="w-4 h-4 text-muted-foreground opacity-20" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'VIP Seats', count: vipCount, price: values.vipPrice, color: 'bg-amber-500', icon: Zap },
                    { label: 'Deluxe Seats', count: deluxeCount, price: values.deluxePrice, color: 'bg-blue-600', icon: Layout },
                    { label: 'Standard Seats', count: standardCount, price: values.pricePerSeat, color: 'bg-emerald-500', icon: CheckCircle2 }
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-muted/10 border border-border/40 rounded-[24px] group hover:bg-muted/30 transition-all duration-500">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                            <stat.icon className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-xs font-medium text-muted-foreground opacity-60 leading-none mb-1.5">{stat.label}</p>
                            <p className="text-foreground font-semibold text-sm tracking-tight">৳{stat.price || 0} / seat</p>
                         </div>
                      </div>
                      <span className="text-2xl font-bold text-foreground group-hover:text-amber-500 transition-colors">
                         {stat.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-border/50 flex items-center justify-between">
                   <div>
                      <p className="text-sm font-medium text-muted-foreground opacity-50 mb-2">Total Capacity</p>
                      <p className="text-4xl font-bold text-foreground tracking-tight leading-none">{values.totalSeats} <span className="text-lg text-muted-foreground">seats</span></p>
                   </div>
                   <div className="w-16 h-16 rounded-[24px] bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-2xl hover:rotate-12 transition-transform duration-500">
                      <Zap className="w-7 h-7 fill-amber-500" />
                   </div>
                </div>
              </div>
              
              {/* Technical Detail */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                 <p className="text-[120px] font-bold leading-none">BUS</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}