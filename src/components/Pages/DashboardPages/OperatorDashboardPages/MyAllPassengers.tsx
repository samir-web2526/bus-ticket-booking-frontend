'use client'

import { getOperatorPassengers } from '@/src/services/passengers.sevice'
import { User } from '@/src/services/user.service'
import { useEffect, useState } from 'react'
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
import { motion } from 'framer-motion'

type Meta = {
  page: number
  limit: number
  total: number
}

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

  if (error) {
    return (
      <section className="bg-white min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-3">
            — Passenger Management
          </p>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">
            My <span className="text-gray-500">Passengers</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Total{' '}
            <span className="text-gray-900 font-semibold">{meta?.total ?? 0}</span>{' '}
            passengers registered
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-4 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search passenger…"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value) }}
              className="pl-9 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 rounded-xl"
            />
          </div>

          <Select
            value={status || 'ALL'}
            onValueChange={(val) => {
              setPage(1)
              setStatus(val === 'ALL' ? '' : val)
            }}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400 rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-gray-900">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 hover:bg-transparent bg-gray-50">
                <TableHead className="text-gray-400 font-semibold text-xs uppercase tracking-wider py-4">Passenger</TableHead>
                <TableHead className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Phone</TableHead>
                <TableHead className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Gender</TableHead>
                <TableHead className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Date of Birth</TableHead>
                <TableHead className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-gray-100">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-4 bg-gray-100 rounded-md animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isEmpty ? (
                <TableRow className="border-gray-100 hover:bg-transparent">
                  <TableCell colSpan={7} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <Users className="w-10 h-10" />
                      <p className="text-gray-400 text-base">No passengers found</p>
                    </div>
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
            </TableBody>
          </Table>
        </motion.div>

        {meta && meta.total > meta.limit && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-400 text-sm">
              Showing{' '}
              <span className="text-gray-900 font-semibold">
                {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)}
              </span>{' '}
              of <span className="text-gray-900 font-semibold">{meta.total}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-400 hover:text-gray-900 disabled:opacity-30 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

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
                      <span key={`ellipsis-${idx}`} className="text-gray-400 px-1 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                          page === p
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-900'
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
                className="border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-400 hover:text-gray-900 disabled:opacity-30 rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}