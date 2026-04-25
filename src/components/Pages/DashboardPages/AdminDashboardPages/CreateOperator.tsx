/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, Zap, Mail, Phone, MapPin, FileText, Building } from "lucide-react";
import { createOperator } from "@/src/services/user.service";

// ─── Zod Schema ──────────────────────────────────────────────────────────────

// const operatorSchema = z.object({
//   name: z.string().min(1, "Operator name is required"),
//   email: z.string().email("Valid email is required"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   phone: z.string().min(10, "Valid phone number is required"),
//   profileImage: z.string().optional().default(""),
//   companyName: z.string().min(1, "Company name is required"),
//   tradeLicense: z.string().min(1, "Trade license is required"),
//   nid: z.string().min(1, "NID is required"),
//   address: z.string().min(1, "Address is required"),
// });
const operatorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),

  profileImage: z.string().default(""),

  companyName: z.string().min(1),
  tradeLicense: z.string().min(1),
  nid: z.string().min(1),
  address: z.string().min(1),
});

type OperatorFormValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  companyName: string;
  tradeLicense: string;
  nid: string;
  address: string;
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CreateOperator() {
  const form = useForm<OperatorFormValues>({
  resolver: zodResolver(operatorSchema) as any,
  defaultValues: {
    name: "",
    email: "",
    password: "",
    phone: "",
    profileImage: "",
    companyName: "",
    tradeLicense: "",
    nid: "",
    address: "",
  },
});

   const { handleSubmit, register, formState, control } = form;
  
  const values = useWatch({
    control,
  });
  const onSubmit = async (data: OperatorFormValues) => {
    const res = await createOperator(data);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Operator created successfully! 🎉");
      form.reset();
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden p-6 lg:p-12">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage:
            'linear-gradient(rgba(251, 191, 36, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
            Create Operator
          </h1>
          <p className="text-slate-600 text-lg">
            Register a new bus operator with their company details
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FORM - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-8">Operator Information</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Details Section */}
                <div className="space-y-5 pb-6 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest">
                    Personal Details
                  </h3>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <Input
                      placeholder="e.g., John Doe"
                      {...register("name")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.name && (
                      <p className="text-red-500 text-xs mt-1">{formState.errors.name.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="operator@example.com"
                      {...register("email")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1">{formState.errors.email.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.password && (
                      <p className="text-red-500 text-xs mt-1">{formState.errors.password.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <Input
                      placeholder="01712345678"
                      {...register("phone")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{formState.errors.phone.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">Profile Image URL</label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...register("profileImage")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                  </motion.div>
                </div>

                {/* Company Details Section */}
                <div className="space-y-5 pb-6 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest">
                    Company Details
                  </h3>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      <Building className="w-4 h-4 inline mr-2" />
                      Company Name
                    </label>
                    <Input
                      placeholder="e.g., Sky Line Bus Service"
                      {...register("companyName")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.companyName && (
                      <p className="text-red-500 text-xs mt-1">{formState.errors.companyName.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Trade License
                    </label>
                    <Input
                      placeholder="TL-123456"
                      {...register("tradeLicense")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.tradeLicense && (
                      <p className="text-red-500 text-xs mt-1">{formState.errors.tradeLicense.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">National ID (NID)</label>
                    <Input
                      placeholder="1234567890123"
                      {...register("nid")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.nid && (
                      <p className="text-red-500 text-xs mt-1">{formState.errors.nid.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Address
                    </label>
                    <Input
                      placeholder="e.g., Dhaka, Bangladesh"
                      {...register("address")}
                      className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                    />
                    {formState.errors.address && (
                      <p className="text-red-500 text-xs mt-1">{formState.errors.address.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed uppercase tracking-wider"
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

          {/* SUMMARY CARD - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-fit sticky top-6"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Summary</h2>

              <div className="space-y-4">
                {/* Name */}
                {values.name && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-amber-50 rounded-lg border border-amber-200"
                  >
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-widest">Name</p>
                    <p className="text-lg font-bold text-amber-900 mt-1">{values.name}</p>
                  </motion.div>
                )}

                {/* Email */}
                {values.email && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Email</p>
                    <p className="text-sm font-semibold text-blue-900 mt-1 truncate">{values.email}</p>
                  </motion.div>
                )}

                {/* Company */}
                {values.companyName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Company</p>
                    <p className="text-lg font-bold text-green-900 mt-1">{values.companyName}</p>
                  </motion.div>
                )}

                {/* Phone */}
                {values.phone && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <p className="text-xs text-purple-600 font-bold uppercase tracking-widest">Phone</p>
                    <p className="text-lg font-bold text-purple-900 mt-1">{values.phone}</p>
                  </motion.div>
                )}

                {/* Address */}
                {values.address && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-slate-100 rounded-lg border border-slate-300"
                  >
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Address</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{values.address}</p>
                  </motion.div>
                )}

                {/* Empty State */}
                {!values.name &&
                  !values.email &&
                  !values.companyName &&
                  !values.phone &&
                  !values.address && (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-sm">Fill in the form to see a preview</p>
                    </div>
                  )}
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-600 leading-relaxed">
                  ✓ All fields are required
                  <br />✓ Password must be at least 6 characters
                  <br />✓ Email must be valid and unique
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}