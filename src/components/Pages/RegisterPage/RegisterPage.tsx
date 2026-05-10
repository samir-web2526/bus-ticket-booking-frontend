"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { AlertCircle, Loader2, UserPlus, CheckCircle2, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"
import { signUp } from "@/src/services/auth/action"

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      // Replace with your actual Google OAuth handler, e.g.:
      // await signIn("google")
      toast.info("Redirecting to Google...", { duration: 2000, position: "top-right" })
    } catch {
      toast.error("Google sign-up failed", { position: "top-right" })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null)
    const result = await signUp({ name: data.name, email: data.email, password: data.password, role: "PASSENGER" })
    if (result.error) {
      setServerError(result.error)
      toast.error("Registration Failed", { description: result.error, position: "top-right" })
      return
    }
    setIsSuccess(true)
    reset()
    toast.success("Account Created! 🎉", { description: "Welcome to BusTicketBD!", position: "top-right", duration: 5000 })
  }

  return (
    <div className={cn("min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden", className)} {...props}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-4xl">

        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 rounded-xl transition-all duration-200 flex items-center gap-2 group shadow-sm">
              <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm grid lg:grid-cols-2">
          <div className="flex flex-col">
            <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 px-8 py-8">
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-gray-600" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 text-center">Create Account</h1>
                <p className="text-gray-400 text-sm text-center">Join BusTicketBD and start booking buses</p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-5 flex-1">
              {serverError && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{serverError}</p>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-emerald-700 text-sm">🎉 Account created! Please check your email to verify.</p>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
                <Input id="name" type="text" placeholder="John Doe" aria-invalid={!!errors.name} {...register("name")}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 rounded-xl h-11" />
                {errors.name
                  ? <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                  : <p className="text-xs text-gray-400">Enter your full name</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 rounded-xl h-11" />
                {errors.email
                  ? <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                  : <p className="text-xs text-gray-400">We'll use this to verify your account</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                    <Input id="password" type="password" placeholder="••••••••" aria-invalid={!!errors.password} {...register("password")}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 rounded-xl h-11" />
                    {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 rounded-xl h-11" />
                    {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
                {!errors.password && !errors.confirmPassword && (
                  <p className="text-xs text-gray-400">✓ Min 8 characters &nbsp;·&nbsp; ✓ 1 uppercase &nbsp;·&nbsp; ✓ 1 number</p>
                )}
              </motion.div>

              {/* Create Account Button */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Button type="submit" disabled={isSubmitting}
                  className="w-full h-11 rounded-xl font-bold bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group">
                  {isSubmitting
                    ? (<><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>)
                    : (<><UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />Create Account</>)}
                </Button>
              </motion.div>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-semibold">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Google Sign-Up Button */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <button type="button" onClick={handleGoogleSignUp} disabled={isGoogleLoading}
                  className="w-full h-11 rounded-xl font-semibold border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  <span className="text-sm">Continue with Google</span>
                </button>
              </motion.div>

              <p className="text-gray-500 text-sm text-center">
                Already have an account?{" "}
                <a href="/login" className="text-gray-900 hover:text-gray-600 font-semibold transition-colors">Sign in here</a>
              </p>
            </form>

            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/60">
              <p className="text-xs text-gray-400 text-center">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Terms of Service</a>{" "}and{" "}
                <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
            className="hidden lg:flex relative bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-100 items-center justify-center p-8 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-5 w-full">
              <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80" alt="Bus Interior" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Join Our Community</h3>
                <p className="text-gray-500 text-sm">Start your journey with BusTicketBD today</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                <span className="text-sm">⭐⭐⭐⭐⭐</span>
                <span className="text-xs text-gray-500 font-medium">Trusted by 50K+ users</span>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                {[
                  { emoji: "📍", label: "500+ Routes", sub: "Every corner of Bangladesh" },
                  { emoji: "💳", label: "Easy Refunds", sub: "Within 3–5 business days" },
                  { emoji: "📱", label: "Mobile Friendly", sub: "Works on any device" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                    <span className="text-lg">{f.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 leading-none">{f.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <p className="mt-5 text-center text-gray-500 text-sm lg:hidden">
          Join <span className="text-gray-900 font-semibold">50K+ users</span> booking buses daily
        </p>
      </motion.div>
    </div>
  )
}