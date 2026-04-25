"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, Loader2, LogIn } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "@/src/services/auth/action"
import { toast } from "sonner"
import Link from "next/link"
import { Home } from "lucide-react"

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type SigninFormValues = z.infer<typeof signinSchema>

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: SigninFormValues) => {
    setServerError(null)

    const result = await signIn(data)

    if (result?.error) {
      setServerError(result.error)
      toast.error("Login Failed", {
        description: result.error,
        duration: 4000,
        position: "top-right",
      })
      return
    }
    
    // ✅ Success toast based on role
    const role = result.role ?? "PASSENGER";

    const toastMessage = role === "ADMIN" 
      ? "Welcome Admin" 
      : role === "OPERATOR" 
      ? "Welcome Operator"
      : "Welcome Passenger"
    
    const toastDescription = `You logged in successfully as ${role.toLowerCase()}`

    toast.success(toastMessage, {
      description: toastDescription,
      duration: 3000,
      position: "top-right",
    })

    // Redirect after short delay
    setTimeout(() => {
      if (role === "ADMIN") router.push("/admin-dashboard")
      else if (role === "OPERATOR") router.push("/operator-dashboard")
      else if (role === "PASSENGER") router.push("/passenger-dashboard")
    }, 500)
  }

  return (
    <div className={cn("min-h-screen bg-[#050d1a] flex items-center justify-center p-4", className)} {...props}>
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex justify-start"
        >
          <Link href="/">
            <Button
              variant="outline"
              className="border-white/20 text-slate-300 hover:bg-white/5 hover:border-amber-400 hover:text-amber-400 rounded-xl transition-all duration-200 flex items-center gap-2 group"
            >
              <Home className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
        {/* Card with Two Columns */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
          {/* Form Column */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a1628] to-[#050d1a] border-b border-white/10 px-8 py-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/30 rounded-2xl flex items-center justify-center">
                  <LogIn className="w-7 h-7 text-amber-400" />
                </div>
                <h1 className="text-3xl font-black text-white text-center">Welcome Back</h1>
                <p className="text-slate-400 text-center text-sm">Login to your BusTicketBD account</p>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-6 flex-1">
              {/* Error Banner */}
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300 text-sm flex-1">{serverError}</p>
                </motion.div>
              )}

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label htmlFor="email" className="block text-sm font-semibold text-slate-300">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 font-semibold">{errors.email.message}</p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl h-11"
                />
                {errors.password && (
                  <p className="text-xs text-red-400 font-semibold">{errors.password.message}</p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/30 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      Login
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-xs text-slate-400 font-semibold">OR</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Sign Up Link */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-center"
              >
                <p className="text-slate-400 text-sm">
                  Don&apos;t have an account?{' '}
                  <a
                    href="/register"
                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                  >
                    Sign up here
                  </a>
                </p>
              </motion.div>
            </form>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-white/10 bg-white/[0.02]">
              <p className="text-xs text-slate-400 text-center">
                By logging in, you agree to our{' '}
                <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Image Column - Hidden on mobile, visible on lg screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:flex relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-l border-white/10 items-center justify-center p-8 overflow-hidden"
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#050d1a] opacity-60"></div>

            {/* Bus Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center gap-4"
            >
              {/* Image */}
              <div className="relative w-full h-64">
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80"
                  alt="Bus"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/20"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-2 relative z-10">
                <h3 className="text-xl font-bold text-white">Ready to Travel?</h3>
                <p className="text-slate-300 text-sm">
                  Book your journey today with BusTicketBD
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs text-slate-400">500+ routes available</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional Info - Mobile Only */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-center lg:hidden"
        >
          <p className="text-slate-400 text-sm">
            Ready to travel?{' '}
            <span className="text-amber-400 font-semibold">500+ routes</span> available
          </p>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}