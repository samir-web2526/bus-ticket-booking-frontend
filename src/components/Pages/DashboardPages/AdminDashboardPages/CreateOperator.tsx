/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertCircle, Building, CheckCircle2, Users, Zap } from "lucide-react";
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

  const inputCls = "bg-white border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-gray-400 focus:ring-gray-200 rounded-xl h-11";

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden p-6 lg:p-12">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">Create Operator</h1>
          <p className="text-gray-400 text-lg">Register a new bus operator with comprehensive company details</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-8">Operator Details</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4" /> Personal Information
                  </h3>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
                    <Input placeholder="e.g., John Doe" {...register("name")} className={inputCls} />
                    {formState.errors.name && <p className="text-xs text-red-500 mt-2">{formState.errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Email Address</label>
                    <Input type="email" placeholder="operator@example.com" {...register("email")} className={inputCls} />
                    {formState.errors.email && <p className="text-xs text-red-500 mt-2">{formState.errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
                    <Input type="password" placeholder="••••••••" {...register("password")} className={inputCls} />
                    {formState.errors.password && <p className="text-xs text-red-500 mt-2">{formState.errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number</label>
                    <Input placeholder="01712345678" {...register("phone")} className={inputCls} />
                    {formState.errors.phone && <p className="text-xs text-red-500 mt-2">{formState.errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Building className="w-4 h-4" /> Company Information
                  </h3>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Company Name</label>
                    <Input placeholder="e.g., Sky Line Bus Service" {...register("companyName")} className={inputCls} />
                    {formState.errors.companyName && <p className="text-xs text-red-500 mt-2">{formState.errors.companyName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Trade License</label>
                      <Input placeholder="TL-123456" {...register("tradeLicense")} className={inputCls} />
                      {formState.errors.tradeLicense && <p className="text-xs text-red-500 mt-2">{formState.errors.tradeLicense.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">National ID (NID)</label>
                      <Input placeholder="1234567890123" {...register("nid")} className={inputCls} />
                      {formState.errors.nid && <p className="text-xs text-red-500 mt-2">{formState.errors.nid.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Address</label>
                    <Input placeholder="e.g., Dhaka, Bangladesh" {...register("address")} className={inputCls} />
                    {formState.errors.address && <p className="text-xs text-red-500 mt-2">{formState.errors.address.message}</p>}
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={formState.isSubmitting} className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider mt-8">
                  {formState.isSubmitting ? <><Zap className="w-4 h-4 animate-spin" /> Creating...</> : <><Users className="w-4 h-4" /> Create Operator</>}
                </motion.button>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Operator Preview</h2>
              <p className="text-sm text-gray-400 mb-6">Completion: <span className="font-bold text-gray-700">{completionPercentage}%</span></p>

              <motion.div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                <motion.div initial={{ width: 0 }} animate={{ width: `${completionPercentage}%` }} transition={{ duration: 0.5 }} className="h-full bg-gray-900 rounded-full" />
              </motion.div>

              <div className="space-y-4">
                {values.name && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Name</p><p className="text-lg font-black text-gray-900">{values.name}</p></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                )}
                {values.email && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
                    <div className="flex-1 min-w-0"><p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Email</p><p className="text-sm font-semibold text-gray-900 truncate">{values.email}</p></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                  </motion.div>
                )}
                {values.companyName && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Company</p><p className="text-lg font-black text-gray-900">{values.companyName}</p></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                )}
                {values.phone && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</p><p className="text-lg font-black text-gray-900">{values.phone}</p></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                )}
                {values.address && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
                    <div className="flex-1"><p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Address</p><p className="text-sm font-semibold text-gray-900">{values.address}</p></div>
                    <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </motion.div>
                )}
                {values.nid && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">NID</p><p className="text-sm font-semibold text-gray-900 font-mono">{values.nid}</p></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                )}
                {values.tradeLicense && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Trade License</p><p className="text-sm font-semibold text-gray-900">{values.tradeLicense}</p></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                )}
                {completionPercentage === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-400 text-sm">Fill in the form to see a live preview</p>
                  </div>
                )}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 pt-6 border-t border-gray-100 space-y-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Requirements</p>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-center gap-2">
                    {values.password && values.password.length >= 6 ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                    Password: 6+ characters
                  </li>
                  <li className="flex items-center gap-2">
                    {values.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                    Valid email address
                  </li>
                  <li className="flex items-center gap-2">
                    {values.phone && values.phone.length >= 10 ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                    Phone: 10+ digits
                  </li>
                  <li className="flex items-center gap-2">
                    {filledFields === requiredFields.length ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                    All required fields
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}