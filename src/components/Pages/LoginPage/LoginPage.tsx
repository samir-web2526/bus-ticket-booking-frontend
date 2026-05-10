"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, Loader2, LogIn, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "@/src/services/auth/action"
import { toast } from "sonner"
import Link from "next/link"

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type SigninFormValues = z.infer<typeof signinSchema>

const DUMMY_CREDENTIALS = {
  ADMIN:     { email: "admin@busticketbd.com",     password: "admin123" },
  OPERATOR:  { email: "operator@busticketbd.com",  password: "operator123" },
  PASSENGER: { email: "passenger@busticketbd.com", password: "passenger123" },
} as const

type DummyRole = keyof typeof DUMMY_CREDENTIALS

const ROLE_CONFIG: { role: DummyRole; label: string }[] = [
  { role: "ADMIN",     label: "Admin" },
  { role: "OPERATOR",  label: "Operator" },
  { role: "PASSENGER", label: "Passenger" },
]

export function SigninForm({ className, ...props }: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  })

  const fillCredentials = (role: DummyRole) => {
    const { email, password } = DUMMY_CREDENTIALS[role]
    setValue("email", email, { shouldValidate: true })
    setValue("password", password, { shouldValidate: true })
    setServerError(null)
    toast.info(`Filled ${role.toLowerCase()} credentials`, {
      description: "Click Login to continue",
      duration: 2000,
      position: "top-right",
    })
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      // Replace with your actual Google OAuth handler, e.g.:
      // await signIn("google")
      toast.info("Redirecting to Google...", { duration: 2000, position: "top-right" })
    } catch {
      toast.error("Google sign-in failed", { position: "top-right" })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const onSubmit = async (data: SigninFormValues) => {
    setServerError(null)
    const result = await signIn(data)
    if (result?.error) {
      setServerError(result.error)
      toast.error("Login Failed", { description: result.error, duration: 4000, position: "top-right" })
      return
    }
    const role = result.role ?? "PASSENGER"
    const toastMessage = role === "ADMIN" ? "Welcome Admin" : role === "OPERATOR" ? "Welcome Operator" : "Welcome Passenger"
    toast.success(toastMessage, { description: `You logged in successfully as ${role.toLowerCase()}`, duration: 3000, position: "top-right" })
    if (role === "ADMIN") router.replace("/admin-dashboard")
    else if (role === "OPERATOR") router.replace("/operator-dashboard")
    else router.replace("/passenger-dashboard")
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
                  <LogIn className="w-6 h-6 text-gray-600" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 text-center">Welcome Back</h1>
                <p className="text-gray-400 text-sm text-center">Login to your BusTicketBD account</p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-5 flex-1">
              {serverError && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{serverError}</p>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 rounded-xl h-11" />
                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                  <a href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">Forgot password?</a>
                </div>
                <Input id="password" type="password" placeholder="••••••••" aria-invalid={!!errors.password} {...register("password")}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 rounded-xl h-11" />
                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
              </motion.div>

              {/* Login Button */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Button type="submit" disabled={isSubmitting}
                  className="w-full h-11 rounded-xl font-bold bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group">
                  {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Logging in...</>) : (<><LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />Login</>)}
                </Button>
              </motion.div>

              {/* Dummy Login Buttons */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Demo Accounts</p>
                <div className="grid grid-cols-3 gap-2">
                  {ROLE_CONFIG.map(({ role, label }) => (
                    <button key={role} type="button" onClick={() => fillCredentials(role)}
                      className="px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 transition-all duration-200 cursor-pointer">
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-semibold">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Google Sign-In Button */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button type="button" onClick={handleGoogleSignIn} disabled={isGoogleLoading}
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
                Don&apos;t have an account?{" "}
                <a href="/register" className="text-gray-900 hover:text-gray-600 font-semibold transition-colors">Sign up here</a>
              </p>
            </form>

            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/60">
              <p className="text-xs text-gray-400 text-center">
                By logging in, you agree to our{" "}
                <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Terms of Service</a>{" "}and{" "}
                <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
            className="hidden lg:flex relative bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-100 items-center justify-center p-8 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-5 w-full">
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80" alt="Bus" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Ready to Travel?</h3>
                <p className="text-gray-500 text-sm">Book your journey today with BusTicketBD</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
                <span className="text-xs text-gray-500 font-medium">500+ routes available</span>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                {[
                  { emoji: "🔒", label: "Secure Payments", sub: "Encrypted & safe" },
                  { emoji: "⚡", label: "Real-Time Seats", sub: "No double bookings" },
                  { emoji: "🎧", label: "24/7 Support", sub: "Always online" },
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
          Ready to travel? <span className="text-gray-900 font-semibold">500+ routes</span> available
        </p>
      </motion.div>
    </div>
  )
}