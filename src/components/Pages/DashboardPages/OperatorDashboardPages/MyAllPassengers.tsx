'use client'

import { getOperatorPassengers } from '@/src/services/passengers.sevice'
import { User as UserType } from '@/src/services/user.service'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, ChevronLeft, ChevronRight, Search, Activity, Zap, Database, ShieldCheck, Loader2, Filter } from 'lucide-react'
import { PassengerCard } from './PassengerCard'
import { motion, AnimatePresence } from 'framer-motion'

type Meta = {
  page: number
  limit: number
  total: number
}

export default function MyAllPassengers() {
  const [passengers, setPassengers] = useState<UserType[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await getOperatorPassengers({ page, limit: 10, search, status })

        if (res.error || !res.data) {
          setError(res.error ?? 'Failed to load passengers')
          return
        }

        setPassengers(res.data.data)
        setMeta(res.data.meta)
        setError('')
      } catch {
        setError('Failed to connect to database. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, search, status])

  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1
  const isEmpty = !loading && passengers.length === 0

  if (error) {
    return (
      <section className="bg-background min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden flex items-center justify-center">
        <div className="bg-card border border-border rounded-[48px] p-16 text-center max-w-md shadow-2xl relative z-10">
          <Activity className="w-16 h-16 text-destructive mx-auto mb-8 animate-pulse" />
          <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4">Error</h3>
          <p className="text-muted-foreground text-base font-normal mb-10">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl text-base shadow-xl transition-all"
          >
            Retry
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div>
            <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Passenger Management</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              My <span className="text-amber-600">Passengers</span>
            </h1>
            <div className="flex items-center gap-4 mt-6">
               <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
                  <Database className="w-5 h-5" />
               </div>
               <p className="text-muted-foreground text-sm font-medium opacity-60">
                  Total passengers: <span className="text-foreground font-semibold">{meta?.total ?? 0}</span>
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-card border border-border px-10 py-5 rounded-[32px] shadow-2xl shadow-slate-900/[0.03] backdrop-blur-xl">
             <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-amber-500" />
             </div>
             <div>
                <span className="text-foreground text-lg font-semibold block leading-none mb-1">{meta?.total ?? 0} Passengers</span>
                <span className="text-muted-foreground text-sm font-medium opacity-50">Active registry</span>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid lg:grid-cols-12 gap-6 mb-12"
        >
          <div className="lg:col-span-8 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 group-focus-within:rotate-12 transition-transform" />
            <input
              type="text"
              placeholder="Search by passenger name or email..."
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value) }}
              className="w-full bg-card border border-border text-foreground rounded-2xl h-14 pl-14 pr-8 text-base font-normal focus:border-amber-500 focus:outline-none transition-all shadow-lg placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="lg:col-span-4 relative group">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 z-10 pointer-events-none group-focus-within:rotate-12 transition-transform">
                <Filter className="w-4 h-4" />
             </div>
             <Select
                value={status || 'ALL'}
                onValueChange={(val) => {
                  setPage(1)
                  setStatus(val === 'ALL' ? '' : val)
                }}
              >
                <SelectTrigger className="w-full bg-card border border-border text-foreground rounded-2xl h-14 pl-14 pr-8 text-base font-normal focus:ring-0 focus:ring-offset-0 focus:border-amber-500 transition-all shadow-lg">
                  <SelectValue placeholder="ALL STATUS" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border text-foreground rounded-[24px] overflow-hidden p-2 shadow-2xl">
                  <SelectItem value="ALL" className="rounded-xl focus:bg-muted focus:text-amber-500 text-base font-medium p-4">All Status</SelectItem>
                  <SelectItem value="ACTIVE" className="rounded-xl focus:bg-muted focus:text-emerald-500 text-base font-medium p-4">Active</SelectItem>
                  <SelectItem value="INACTIVE" className="rounded-xl focus:bg-muted focus:text-slate-500 text-base font-medium p-4">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED" className="rounded-xl focus:bg-muted focus:text-destructive text-base font-medium p-4">Suspended</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl shadow-slate-900/[0.04] group"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent bg-muted/10">
                <TableHead className="text-muted-foreground font-medium text-sm py-6 pl-8 opacity-60">Passenger</TableHead>
                <TableHead className="text-muted-foreground font-medium text-sm py-6 opacity-60">Contact</TableHead>
                <TableHead className="text-muted-foreground font-medium text-sm py-6 opacity-60">Profile</TableHead>
                <TableHead className="text-muted-foreground font-medium text-sm py-6 opacity-60">Joined</TableHead>
                <TableHead className="text-muted-foreground font-medium text-sm py-6 opacity-60">Role</TableHead>
                <TableHead className="text-muted-foreground font-medium text-sm py-6 opacity-60">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium text-sm py-6 pr-8 text-right opacity-60">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border/40">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border/40">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j} className="py-8 pl-10">
                          <div className="h-4 bg-muted/50 rounded-md animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : isEmpty ? (
                  <TableRow className="border-transparent hover:bg-transparent">
                    <TableCell colSpan={7} className="text-center py-40 grayscale opacity-40">
                      <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-8 animate-pulse" />
                      <p className="text-foreground font-bold text-xl tracking-tight">No passengers found</p>
                      <p className="text-muted-foreground text-base font-normal mt-2">Try adjusting your search</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  passengers.map((passenger) => (
                    <PassengerCard
                      key={passenger.id}
                      passenger={passenger}
                      onDeleted={(id) => setPassengers((prev) => prev.filter((p) => p.id !== id))}
                    />
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>

        {meta && meta.total > meta.limit && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-between mt-12 gap-8"
          >
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-2xl">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-muted-foreground text-sm font-medium opacity-60 mb-1">Showing results</p>
                  <p className="text-foreground font-semibold text-lg tracking-tight">
                    {(page - 1) * meta.limit + 1} – {Math.min(page * meta.limit, meta.total)} of {meta.total} passengers
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-[28px] shadow-2xl shadow-slate-900/[0.03]">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 rounded-2xl bg-muted border border-border text-muted-foreground hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all duration-500 shadow-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2 px-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                      acc.push('...')
                    }
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="text-muted-foreground/40 font-medium px-2">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-12 h-12 rounded-2xl text-sm font-medium transition-all duration-500 shadow-lg ${
                          page === p
                            ? 'bg-slate-900 text-amber-500 shadow-amber-500/10'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-12 h-12 rounded-2xl bg-muted border border-border text-muted-foreground hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all duration-500 shadow-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  )
}