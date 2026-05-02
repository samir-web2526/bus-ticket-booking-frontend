/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertCircle, Building, CheckCircle2, Users, Zap} from "lucide-react";
import { createOperator } from "@/src/services/user.service";

// ─── Zod Schema ──────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function CreateOperator() {
  const form = useForm<OperatorFormValues>({
    resolver: zodResolver(operatorSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      companyName: "",
      tradeLicense: "",
      nid: "",
      address: "",
    },
  });

  const { handleSubmit, register, formState, control } = form;

  const values = useWatch({
    control,
    defaultValue: {
      name: "",
      email: "",
      password: "",
      phone: "",
      companyName: "",
      tradeLicense: "",
      nid: "",
      address: "",
    },
  });

  const onSubmit = async (data: OperatorFormValues) => {
    const payload = {
      ...data,
    };

    const res = await createOperator(payload);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Operator created successfully! 🎉");
      form.reset();
    }
  };

  // Helper function to check validation status
  const isFieldValid = (fieldName: keyof OperatorFormValues): boolean => {
    const value = values[fieldName];
    if (!value || (typeof value === "string" && !value.trim())) return false;
    
    if (fieldName === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string);
    }
    if (fieldName === "phone") {
      return (value as string).length >= 10;
    }
    if (fieldName === "password") {
      return (value as string).length >= 6;
    }
    return true;
  };

  const requiredFields = ["name", "email", "password", "phone", "companyName", "tradeLicense", "nid", "address"] as const;
  const filledFields = requiredFields.filter(field => isFieldValid(field as keyof OperatorFormValues)).length;
  const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
            Create Operator
          </h1>
          <p className="text-slate-400 text-lg">
            Register a new bus operator with comprehensive company details
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORM SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-8">Operator Details</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Details Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Personal Information
                  </h3>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="text-sm font-semibold text-white block mb-2">
                      Full Name
                    </label>
                    <Input
                      placeholder="e.g., John Doe"
                      {...register("name")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.name && (
                      <p className="text-xs text-red-400 mt-2">{formState.errors.name.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-sm font-semibold text-white block mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="operator@example.com"
                      {...register("email")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.email && (
                      <p className="text-xs text-red-400 mt-2">{formState.errors.email.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="text-sm font-semibold text-white block mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.password && (
                      <p className="text-xs text-red-400 mt-2">{formState.errors.password.message}</p>
                    )}
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="text-sm font-semibold text-white block mb-2">
                        Phone Number
                      </label>
                      <Input
                        placeholder="01712345678"
                        {...register("phone")}
                        className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                      />
                      {formState.errors.phone && (
                        <p className="text-xs text-red-400 mt-2">{formState.errors.phone.message}</p>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Company Details Section */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Company Information
                  </h3>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="text-sm font-semibold text-white block mb-2">
                      Company Name
                    </label>
                    <Input
                      placeholder="e.g., Sky Line Bus Service"
                      {...register("companyName")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.companyName && (
                      <p className="text-xs text-red-400 mt-2">{formState.errors.companyName.message}</p>
                    )}
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <label className="text-sm font-semibold text-white block mb-2">
                        Trade License
                      </label>
                      <Input
                        placeholder="TL-123456"
                        {...register("tradeLicense")}
                        className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                      />
                      {formState.errors.tradeLicense && (
                        <p className="text-xs text-red-400 mt-2">{formState.errors.tradeLicense.message}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="text-sm font-semibold text-white block mb-2">
                        National ID (NID)
                      </label>
                      <Input
                        placeholder="1234567890123"
                        {...register("nid")}
                        className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                      />
                      {formState.errors.nid && (
                        <p className="text-xs text-red-400 mt-2">{formState.errors.nid.message}</p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <label className="text-sm font-semibold text-white block mb-2">
                      Address
                    </label>
                    <Input
                      placeholder="e.g., Dhaka, Bangladesh"
                      {...register("address")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.address && (
                      <p className="text-xs text-red-400 mt-2">{formState.errors.address.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:from-amber-400/50 disabled:to-amber-500/50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider mt-8"
                >
                  {formState.isSubmitting ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      Create Operator
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* PREVIEW SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-2">Operator Preview</h2>
              <p className="text-sm text-slate-400 mb-6">
                Completion: <span className="font-bold text-amber-400">{completionPercentage}%</span>
              </p>

              {/* Progress Bar */}
              <motion.div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                />
              </motion.div>

              <div className="space-y-4">
                {/* Name Card */}
                {values.name && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-400/5 rounded-xl border border-amber-500/30 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">Name</p>
                      <p className="text-lg font-black text-white">{values.name}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  </motion.div>
                )}

                {/* Email Card */}
                {values.email && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-400/5 rounded-xl border border-blue-500/30 flex items-start justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Email</p>
                      <p className="text-sm font-semibold text-white truncate">{values.email}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 ml-2" />
                  </motion.div>
                )}

                {/* Company Card */}
                {values.companyName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-green-500/20 to-green-400/5 rounded-xl border border-green-500/30 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-xs text-green-400 font-bold uppercase tracking-widest mb-1">Company</p>
                      <p className="text-lg font-black text-white">{values.companyName}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  </motion.div>
                )}

                {/* Phone Card */}
                {values.phone && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-400/5 rounded-xl border border-purple-500/30 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">Phone</p>
                      <p className="text-lg font-black text-white">{values.phone}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  </motion.div>
                )}

                {/* Address Card */}
                {values.address && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-slate-500/20 to-slate-400/5 rounded-xl border border-slate-500/30 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Address</p>
                      <p className="text-sm font-semibold text-white">{values.address}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                  </motion.div>
                )}

                {/* NID Card */}
                {values.nid && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-pink-500/20 to-pink-400/5 rounded-xl border border-pink-500/30 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-xs text-pink-400 font-bold uppercase tracking-widest mb-1">NID</p>
                      <p className="text-sm font-semibold text-white font-mono">{values.nid}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  </motion.div>
                )}

                {/* Trade License Card */}
                {values.tradeLicense && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 rounded-xl border border-cyan-500/30 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-1">Trade License</p>
                      <p className="text-sm font-semibold text-white">{values.tradeLicense}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  </motion.div>
                )}

                {/* Empty State */}
                {completionPercentage === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                    <p className="text-slate-400 text-sm">Fill in the form to see a live preview</p>
                  </div>
                )}
              </div>

              {/* Requirements Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 pt-6 border-t border-white/10 space-y-2"
              >
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Requirements</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    {values.password && values.password.length >= 6 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    Password: 6+ characters
                  </li>
                  <li className="flex items-center gap-2">
                    {values.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    Valid email address
                  </li>
                  <li className="flex items-center gap-2">
                    {values.phone && values.phone.length >= 10 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    Phone: 10+ digits
                  </li>
                  <li className="flex items-center gap-2">
                    {filledFields === requiredFields.length ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
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