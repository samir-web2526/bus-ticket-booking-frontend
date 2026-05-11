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
    toast.success("Account Created! 🎉", { description: "Welcome to BusHub!", position: "top-right", duration: 5000 })
  }

  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden", className)} {...props}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-4xl">

        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-border text-muted-foreground hover:bg-muted hover:border-amber-500/30 hover:text-foreground rounded-2xl transition-all duration-300 flex items-center gap-2 group shadow-sm bg-background/50 backdrop-blur-sm px-6 h-12">
              <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-black uppercase tracking-widest text-[10px]">Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-[40px] overflow-hidden shadow-2xl grid lg:grid-cols-2">
          <div className="flex flex-col">
            <div className="bg-muted/30 border-b border-border px-8 py-10 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col items-center lg:items-start gap-4">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-foreground font-heading tracking-tight mb-1">Create Account</h1>
                  <p className="text-muted-foreground text-sm font-medium">Join BusHub and start booking today</p>
                </div>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-10 space-y-6 flex-1">
              {serverError && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-destructive text-sm font-medium">{serverError}</p>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-emerald-700 text-sm font-bold">🎉 Account created! You can now login.</p>
                </motion.div>
              )}

              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-2">
                  <label htmlFor="name" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                  <Input id="name" type="text" placeholder="John Doe" aria-invalid={!!errors.name} {...register("name")}
                    className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:bg-background rounded-2xl h-14 px-6 transition-all" />
                  {errors.name && <p className="text-xs text-destructive font-bold ml-1">{errors.name.message}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
                  <label htmlFor="email" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                  <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")}
                    className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:bg-background rounded-2xl h-14 px-6 transition-all" />
                  {errors.email && <p className="text-xs text-destructive font-bold ml-1">{errors.email.message}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Password</label>
                      <Input id="password" type="password" placeholder="••••••••" aria-invalid={!!errors.password} {...register("password")}
                        className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:bg-background rounded-2xl h-14 px-6 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Confirm</label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")}
                        className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:bg-background rounded-2xl h-14 px-6 transition-all" />
                    </div>
                  </div>
                  {errors.password && <p className="text-xs text-destructive font-bold ml-1">{errors.password.message}</p>}
                  {errors.confirmPassword && <p className="text-xs text-destructive font-bold ml-1">{errors.confirmPassword.message}</p>}
                  {!errors.password && !errors.confirmPassword && (
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">✓ 8+ chars &nbsp;·&nbsp; ✓ 1 upper &nbsp;·&nbsp; ✓ 1 number</p>
                  )}
                </motion.div>
              </div>

              {/* Create Account Button */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Button type="submit" disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] group">
                  {isSubmitting
                    ? (<><Loader2 className="w-5 h-5 animate-spin" />Creating...</>)
                    : (<><UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />Create Account</>)}
                </Button>
              </motion.div>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Social Join</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Google Sign-Up Button */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <button type="button" onClick={handleGoogleSignUp} disabled={isGoogleLoading}
                  className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] border border-border bg-background hover:bg-muted hover:border-amber-500/30 text-foreground transition-all duration-300 flex items-center justify-center gap-3 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.98]">
                  {isGoogleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Sign up with Google
                </button>
              </motion.div>

              <p className="text-muted-foreground text-sm text-center font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-amber-600 hover:text-amber-500 font-black transition-colors">Sign in here</Link>
              </p>
            </form>

            <div className="px-8 py-6 border-t border-border bg-muted/20">
              <p className="text-[10px] text-muted-foreground text-center font-black uppercase tracking-widest leading-relaxed">
                By joining, you agree to our <br />
                <Link href="#" className="text-foreground hover:text-amber-600 transition-colors">Terms</Link> & <Link href="#" className="text-foreground hover:text-amber-600 transition-colors">Privacy Policy</Link>
              </p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
            className="hidden lg:flex relative bg-slate-900 border-l border-border items-center justify-center p-12 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 to-transparent" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex flex-col items-center gap-8 w-full text-center">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80" alt="Bus Interior" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white font-heading italic">Join the <span className="text-amber-500">Journey</span></h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto uppercase tracking-widest text-[10px]">Over 50,000+ happy travelers daily</p>
              </div>
              
              <div className="flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
                <span className="text-[10px]">⭐⭐⭐⭐⭐</span>
                <span className="text-[10px] text-white font-black uppercase tracking-widest">4.9/5 Rating</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3 w-full">
                {[
                  { emoji: "📍", label: "500+ Routes", sub: "Nationwide coverage" },
                  { emoji: "💳", label: "Easy Refunds", sub: "Hassle-free process" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 shadow-xl text-left group hover:bg-white/10 transition-colors">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{f.emoji}</span>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-widest leading-none">{f.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <p className="mt-8 text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest lg:hidden">
          Start your journey with <span className="text-foreground">BusHub</span> today
        </p>
      </motion.div>
    </div>
  )
}