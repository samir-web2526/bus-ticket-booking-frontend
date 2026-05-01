'use client'

import { useState } from 'react'
import { User, deleteUser } from '@/src/services/user.service'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { UserCircle2, Trash2, Loader2, AlertTriangle } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-green-400/15 text-green-400 border-green-400/30',
    INACTIVE: 'bg-slate-400/15 text-slate-400 border-slate-400/30',
    SUSPENDED: 'bg-red-400/15 text-red-400 border-red-400/30',
  }
  const s = status ?? 'ACTIVE'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        map[s] ?? 'bg-amber-400/15 text-amber-400 border-amber-400/30'
      }`}
    >
      {s}
    </span>
  )
}


// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  passenger,
  open,
  onClose,
  onDeleted,
}: {
  passenger: User
  open: boolean
  onClose: () => void
  onDeleted: (id: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await deleteUser(passenger.id)
      if (res.error) {
        setError(res.error)
        return
      }
      onDeleted(passenger.id)
      onClose()
    } catch {
      setError('Failed to delete. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0c1829] border border-white/10 text-white max-w-sm rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-white font-bold text-lg">
                Delete Passenger?
              </DialogTitle>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                This will permanently delete{' '}
                <span className="text-white font-semibold">{passenger.name}</span>.
                This action cannot be undone.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4 space-y-3">
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 text-center">
              {error}
            </p>
          )}

          <Button
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl h-11"
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting…</> : 'Yes, Delete'}
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white rounded-xl h-11"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── PassengerCard ────────────────────────────────────────────────────────────

export function PassengerCard({
  passenger,
  onDeleted,
}: {
  passenger: User
  onDeleted?: (id: string) => void
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <TableRow className="border-white/5 hover:bg-white/[0.04] transition-colors duration-150">
        {/* Avatar + Name + Email */}
        <TableCell className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <UserCircle2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{passenger.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{passenger.email}</p>
            </div>
          </div>
        </TableCell>

        {/* Phone */}
        <TableCell className="text-slate-400 text-sm">
          {passenger.phone ?? <span className="text-slate-600 italic">No phone</span>}
        </TableCell>

        {/* Gender */}
        <TableCell className="text-slate-400 text-sm">
          {passenger.passengerProfile?.gender ?? <span className="text-slate-600">—</span>}
        </TableCell>

        {/* DOB */}
        <TableCell className="text-slate-400 text-sm">
          {passenger.passengerProfile?.dateOfBirth ?? <span className="text-slate-600">—</span>}
        </TableCell>

        {/* Role */}
        <TableCell>
          <span className="text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
            {passenger.role}
          </span>
        </TableCell>

        {/* Status */}
        <TableCell>
          <StatusBadge status="ACTIVE" />
        </TableCell>

        {/* Actions */}
        <TableCell>
          <div className="flex items-center gap-2">
           
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="border-white/10 bg-white/5 text-slate-300 hover:border-red-400/40 hover:text-red-400 h-8 px-3 text-xs gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <DeleteConfirmModal
        passenger={passenger}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={(id) => {
          onDeleted?.(id)
          setDeleteOpen(false)
        }}
      />
    </>
  )
}