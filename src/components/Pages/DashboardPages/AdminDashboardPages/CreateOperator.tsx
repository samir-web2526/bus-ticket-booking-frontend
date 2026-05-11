/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertCircle, Building, CheckCircle2, Users, Zap, Shield, Mail, Phone, UserCheck, Loader2, Navigation, Database, ShieldCheck, Activity, Globe } from "lucide-react";
import { createOperator } from "@/src/services/user.service";

const operatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
  phone: z.string().min(10, "Invalid phone number"),
  companyName: z.string().min(1, "Company name is required"),
  tradeLicense: z.string().min(1, "Trade license is required"),
  nid: z.string().min(1, "NID is required"),
  address: z.string().min(1, "Address is required"),
});

type OperatorFormValues = z.infer<typeof operatorSchema>;

export default function CreateOperator() {
  const form = useForm<OperatorFormValues>({
    resolver: zodResolver(operatorSchema) as any,
    defaultValues: { name: "", email: "", password: "", phone: "", companyName: "", tradeLicense: "", nid: "", address: "" },
  });

  const { handleSubmit, register, formState, control } = form;
  const values = useWatch({ control, defaultValue: { name: "", email: "", password: "", phone: "", companyName: "", tradeLicense: "", nid: "", address: "" } });

  const onSubmit = async (data: OperatorFormValues) => {
    const res = await createOperator(data);
    if (res.error) { toast.error(res.error); }
    else { toast.success("Operator created successfully! 🎉"); form.reset(); }
  };

  const isFieldValid = (fieldName: keyof OperatorFormValues): boolean => {
    const value = values[fieldName];
    if (!value || (typeof value === "string" && !value.trim())) return false;
    if (fieldName === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string);
    if (fieldName === "phone") return (value as string).length >= 10;
    if (fieldName === "password") return (value as string).length >= 6;
    return true;
  };

  const requiredFields = ["name", "email", "password", "phone", "companyName", "tradeLicense", "nid", "address"] as const;
  const filledFields = requiredFields.filter(field => isFieldValid(field as keyof OperatorFormValues)).length;
  const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);

  const inputCls = "bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:ring-amber-500/20 rounded-2xl h-14 transition-all duration-500 font-normal text-base";
  const labelCls = "text-sm font-semibold text-amber-600 block mb-3 ml-1";

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Operator Management</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Create <span className="text-amber-600">Operator</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-7">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.04] p-10 lg:p-16 relative overflow-hidden">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 relative z-10">
                <div className="space-y-10">
                  <div className="flex items-center gap-6 mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">Personal Info</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className={labelCls}>Full Name</label>
                      <Input placeholder="Enter full name" {...register("name")} className={inputCls} />
                      {formState.errors.name && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Phone Number</label>
                      <Input placeholder="+880 1XXX XXXXXX" {...register("phone")} className={inputCls} />
                      {formState.errors.phone && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className={labelCls}>Email</label>
                      <Input type="email" placeholder="operator@example.com" {...register("email")} className={inputCls} />
                      {formState.errors.email && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Password</label>
                      <Input type="password" placeholder="••••••••" {...register("password")} className={inputCls} />
                      {formState.errors.password && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.password.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-10 pt-16 border-t border-border/50">
                  <div className="flex items-center gap-6 mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
                      <Building className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">Company Info</h3>
                  </div>

                  <div className="space-y-1">
                    <label className={labelCls}>Company Name</label>
                    <Input placeholder="Enter company name" {...register("companyName")} className={inputCls} />
                    {formState.errors.companyName && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.companyName.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className={labelCls}>Trade License</label>
                      <Input placeholder="Enter trade license" {...register("tradeLicense")} className={inputCls} />
                      {formState.errors.tradeLicense && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.tradeLicense.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>National ID (NID)</label>
                      <Input placeholder="Enter NID number" {...register("nid")} className={inputCls} />
                      {formState.errors.nid && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.nid.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelCls}>Address</label>
                    <Input placeholder="Enter address" {...register("address")} className={inputCls} />
                    {formState.errors.address && <p className="text-destructive text-sm font-medium mt-2 ml-1">{formState.errors.address.message}</p>}
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: '#f59e0b', color: '#fff' }} 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  disabled={formState.isSubmitting} 
                  className="w-full h-16 bg-slate-900 border border-slate-800 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-700 flex items-center justify-center gap-4 disabled:cursor-not-allowed text-base shadow-2xl shadow-slate-900/30 group/btn"
                >
                  {formState.isSubmitting ? <Activity className="w-6 h-6 animate-spin text-amber-500" /> : <UserCheck className="w-6 h-6 text-amber-500 group-hover/btn:text-white transition-colors" />}
                  {formState.isSubmitting ? "Creating..." : "Create Operator"}
                </motion.button>
              </form>
              
              {/* Corner Decor */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                 <p className="text-[140px] font-bold leading-none">OP</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5 sticky top-12">
            <div className="bg-card border border-border rounded-[48px] shadow-2xl shadow-slate-900/[0.04] p-10 lg:p-16 relative overflow-hidden">
              <div className="flex items-center justify-between mb-12 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-xl">
                       <Shield className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Progress</h2>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground opacity-50">Completion</p>
                    <p className="text-3xl font-bold text-foreground tracking-tight leading-none">{completionPercentage}%</p>
                 </div>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-16 relative z-10">
                <motion.div initial={{ width: 0 }} animate={{ width: `${completionPercentage}%` }} transition={{ duration: 1, ease: "circOut" }} className="h-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
              </div>

              <div className="space-y-6 relative z-10">
                <AnimatePresence mode="popLayout">
                  {[
                    { field: 'name', label: 'Name', icon: UserCheck, display: values.name },
                    { field: 'email', label: 'Email', icon: Mail, display: values.email, extra: !isFieldValid('email') },
                    { field: 'companyName', label: 'Company', icon: Building, display: values.companyName },
                    { field: 'phone', label: 'Phone', icon: Phone, display: values.phone, extra: !isFieldValid('phone') }
                  ].map((item, idx) => (
                    item.display && (
                      <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="p-8 bg-muted/10 border border-border/40 rounded-[32px] flex items-center justify-between group hover:bg-muted/30 transition-all duration-500">
                        <div className="flex items-center gap-6 min-w-0">
                           <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                              <item.icon className="w-5 h-5" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs text-muted-foreground font-medium mb-1.5 opacity-50 leading-none">{item.label}</p>
                              <p className="text-base font-semibold text-foreground truncate leading-none">{item.display}</p>
                           </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.extra ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-500'}`}>
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
                
                {completionPercentage === 0 && (
                  <div className="text-center py-24 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-[32px] bg-muted/40 flex items-center justify-center mb-8 border border-border border-dashed animate-pulse">
                       <Zap className="w-10 h-10 text-muted-foreground/20" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[200px] mx-auto text-center opacity-60">Start filling the form to see your progress</p>
                  </div>
                )}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-16 pt-10 border-t border-border/50 relative z-10">
                <p className="text-sm font-medium text-muted-foreground mb-8 opacity-60">Requirements</p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Password', valid: values.password && values.password.length >= 6 },
                    { label: 'Email', valid: isFieldValid('email') },
                    { label: 'National ID', valid: values.nid && values.nid.length >= 10 },
                    { label: 'Complete', valid: filledFields === requiredFields.length }
                  ].map((check, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 rounded-[20px] bg-muted/10 border border-border/40 group hover:border-amber-500/30 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${check.valid ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/20'}`} />
                      <span className="text-xs font-medium text-foreground/70">{check.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Technical Backdrop */}
              <div className="absolute bottom-0 left-0 p-10 opacity-[0.02] select-none pointer-events-none">
                 <Globe className="w-48 h-48" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}