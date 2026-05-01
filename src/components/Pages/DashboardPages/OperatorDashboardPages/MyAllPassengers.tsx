'use client'

import { getOperatorPassengers } from '@/src/services/passengers.sevice'
import { User } from '@/src/services/user.service'
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Users, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { PassengerCard } from './PassengerCard'

// ─── Types ───────────────────────────────────────────────────────────────────

type Meta = {
  page: number
  limit: number
  total: number
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyAllPassengers() {
  const [passengers, setPassengers] = useState<User[]>([])
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
        setError('Failed to load passengers')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, search, status])

  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1

  const isEmpty = !loading && passengers.length === 0

  // ── Error State ──
  if (error) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-amber-400 hover:bg-amber-300 text-black font-bold"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Glow blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            — Passenger Management
          </p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
            My <span className="text-amber-400">Passengers</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Total{' '}
            <span className="text-amber-400 font-semibold">{meta?.total ?? 0}</span>{' '}
            passengers registered
          </p>
        </div>

        {/* ── Search + Filter ── */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search passenger…"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value) }}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-400/50 focus:ring-amber-400/20 rounded-lg"
            />
          </div>

          <Select
            value={status || 'ALL'}
            onValueChange={(val) => {
              setPage(1)
              setStatus(val === 'ALL' ? '' : val)
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-amber-400/50 focus:ring-amber-400/20 rounded-lg">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0c1829] border-white/10 text-white">
              <SelectItem value="ALL" className="focus:bg-amber-400/10 focus:text-amber-400">All Status</SelectItem>
              <SelectItem value="ACTIVE" className="focus:bg-amber-400/10 focus:text-amber-400">ACTIVE</SelectItem>
              <SelectItem value="INACTIVE" className="focus:bg-amber-400/10 focus:text-amber-400">INACTIVE</SelectItem>
              <SelectItem value="SUSPENDED" className="focus:bg-amber-400/10 focus:text-amber-400">SUSPENDED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── Table ── */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4">Passenger</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Phone</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Gender</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Date of Birth</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-4 bg-white/5 rounded-md animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isEmpty ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3 text-slate-600">
                      <Users className="w-10 h-10" />
                      <p className="text-slate-500 text-base">No passengers found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                passengers.map((passenger) => (
                  <PassengerCard key={passenger.id} passenger={passenger} onDeleted={(id) => setPassengers((prev) => prev.filter((p) => p.id !== id))} />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination ── */}
        {meta && meta.total > meta.limit && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-slate-500 text-sm">
              Showing{' '}
              <span className="text-amber-400 font-semibold">
                {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)}
              </span>{' '}
              of <span className="text-white font-semibold">{meta.total}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
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
                      <span key={`ellipsis-${idx}`} className="text-slate-600 px-1 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                          page === p
                            ? 'bg-amber-400 text-black'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:border-amber-400/30 hover:text-amber-400'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/40 hover:text-amber-400 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}